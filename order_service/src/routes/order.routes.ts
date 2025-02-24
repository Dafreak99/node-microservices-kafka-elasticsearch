import express, { NextFunction, Request, Response } from 'express';
import { RequestAuthorizer } from './middleware';
import * as service from '../services/order.service';
import { OrderRepository } from '../repository/order.repository';
import { CartRepository } from '../repository/cart.repository';

const router = express.Router();
const repo = OrderRepository;
const cartRepo = CartRepository;

router.post(
  '/orders',
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { user } = req;

      if (!user) {
        next(new Error('User not found'));
        return;
      }

      const response = await service.CreateOrder(user.id, repo, cartRepo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/orders',
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { user } = req;

      if (!user) {
        next(new Error('User not found'));
        return;
      }

      const response = await service.GetOrders(user.id, repo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
    return res.status(200).json({ message: 'get order' });
  },
);

router.get(
  '/orders/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { user } = req;
      const orderId = parseInt(req.params.id);

      if (!user) {
        next(new Error('User not found'));
        return;
      }

      const response = await service.GetOrder(orderId, repo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
);

// only going to call from microservice
router.patch(
  '/orders/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      // security check for microservice calls only
      const { status } = req.body;
      const orderId = parseInt(req.params.id);
      const response = await service.UpdateOrder(orderId, status, repo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
);

// only going to call from microservice
router.delete(
  '/orders/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { user } = req;
      const orderId = parseInt(req.params.id);

      if (!user) {
        next(new Error('User not found'));
        return;
      }

      const response = await service.DeleteOrder(orderId, repo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
