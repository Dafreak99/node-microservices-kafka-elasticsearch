import express, { NextFunction, Request, Response } from 'express';
import * as service from '../services/cart.service';
import { CartRepository } from '../repository/cart.repository';
import { ValidateRequest } from '../utils/validator';
import { CartRequestInput, CartRequestSchema } from '../dto/cartRequest.dto';
import { RequestAuthorizer } from './middleware';

const router = express.Router();
const repo = CartRepository;

router.post(
  '/cart',
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { user } = req;

      if (!user) {
        next(new Error('User not found'));
        return;
      }

      const error = ValidateRequest<CartRequestInput>(
        req.body,
        CartRequestSchema,
      );

      if (error) {
        return res.status(404).json({ error });
      }

      const input = {
        ...req.body,
        customerId: user.id,
      };

      const response = await service.CreateCart(input, repo);
      return res.status(200).json(response);
    } catch (error) {
      console.log('cart route', error);
      next(error);
    }
  },
);

router.get(
  '/cart',
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { user } = req;

      if (!user) {
        next(new Error('User not found'));
        return;
      }

      const response = await service.GetCart(user.id, repo);
      return res.status(200).json(response);
    } catch (error) {
      console.log('cart route', error);
      next(error);
    }
  },
);

router.patch(
  '/cart/:lineItemId',
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { user } = req;

      if (!user) {
        next(new Error('User not found'));
        return;
      }

      const lineItemId = parseInt(req.params.lineItemId);

      const response = await service.EditCart(
        {
          id: +lineItemId,
          qty: req.body.qty,
          customerId: user.id,
        },
        repo,
      );
      return res.status(200).json(response);
    } catch (error) {
      console.log('cart route', error);
      next(error);
    }
  },
);

router.delete(
  '/cart/:lineItemId',
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { user } = req;

      if (!user) {
        next(new Error('User not found'));
        return;
      }

      const lineItemId = parseInt(req.params.lineItemId);

      const response = await service.DeleteCart(
        {
          id: +lineItemId,
          customerId: user.id,
        },
        repo,
      );
      return res.status(200).json(response);
    } catch (error) {
      console.log('cart route', error);
      next(error);
    }
  },
);

export default router;
