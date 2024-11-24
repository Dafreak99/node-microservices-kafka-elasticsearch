import { NextFunction, Request, Response } from 'express';
import { ValidateUser } from '../utils/broker';

export const RequestAuthorizer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { authorization } = req.headers || {};

    if (!authorization) {
      return res
        .status(403)
        .json({ error: 'Unauthorized due to authorization token missing!' });
    }

    const user = await ValidateUser(req.headers.authorization as string);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
};
