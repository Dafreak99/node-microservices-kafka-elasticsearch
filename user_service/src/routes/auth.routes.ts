import express, { Request, Response } from 'express';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../services/user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CreateUserRequest } from '../dto/CreateUserRequest.dto';
import { RequestValidator } from '../utils';
import { generateToken } from '../utils/token';
import { LoginUserRequest } from '../dto/LoginUserRequest.dto';

const router = express.Router();

export const userService = new UserService(new UserRepository());

router.post('/register', async (req: Request, res: Response): Promise<any> => {
  try {
    const { errors, input } = await RequestValidator(
      CreateUserRequest,
      req.body,
    );

    if (errors) {
      return res.status(400).json({ message: errors });
    }

    const { username, email, password } = req.body;

    const user = await userService.getUserByEmail(email);

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userService.createUser({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const { errors } = await RequestValidator(LoginUserRequest, req.body);

    if (errors) {
      return res.status(400).json({ errors });
    }

    const { email, password } = req.body;

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

router.get('/validate', async (req: Request, res: Response): Promise<any> => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const tokenData = token.split(' ')[1];
    const user = jwt.verify(tokenData, process.env.JWT_SECRET!);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
});

export default router;
