import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const generateToken = (user: Partial<User>) => {
  return jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
