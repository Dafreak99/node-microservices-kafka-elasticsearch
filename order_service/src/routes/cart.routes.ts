import express, { NextFunction, Request, Response } from 'express';
import * as service from '../services/cart.service';
import { CartRepository } from '../repository/cart.repository';
import { ValidateRequest } from '../utils/validator';
import { CartRequestInput, CartRequestSchema } from '../dto/cartRequest.dto';

const router = express.Router();
const repo = CartRepository;

// implement simple auth middleware
const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): any | undefined => {
  const isValidUser = true;

  if (!isValidUser) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  next();
};

router.post(
  '/cart',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const error = ValidateRequest<CartRequestInput>(
        req.body,
        CartRequestSchema,
      );

      if (error) {
        return res.status(404).json({ error });
      }

      const response = await service.CreateCart(req.body, repo);
      return res.status(200).json(response);
    } catch (error) {
      console.log('cart route', error);
      next(error);
    }
  },
);

router.get('/cart', async (req: Request, res: Response): Promise<any> => {
  // comes from our auth user parsed from JWT
  const response = await service.GetCart(req.body.customerId, repo);
  return res.status(200).json(response);
});

router.patch(
  '/cart/:lineItemId',
  async (req: Request, res: Response): Promise<any> => {
    const lineItemId = parseInt(req.params.lineItemId);

    const response = await service.EditCart(
      {
        id: +lineItemId,
        qty: req.body.qty,
      },
      repo,
    );
    return res.status(200).json(response);
  },
);

router.delete(
  '/cart/:lineItemId',
  async (req: Request, res: Response): Promise<any> => {
    const lineItemId = parseInt(req.params.lineItemId);

    const response = await service.DeleteCart(lineItemId, repo);
    return res.status(200).json(response);
  },
);

export default router;
