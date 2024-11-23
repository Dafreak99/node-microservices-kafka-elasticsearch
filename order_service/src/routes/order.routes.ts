import express, { Request, Response } from 'express';
import { MessageBroker } from '../utils/broker';
import { OrderEvent } from '../types';

const router = express.Router();

router.post('/order', async (req: Request, res: Response): Promise<any> => {
  // order create logic

  // 3rd step: publish the message
  await MessageBroker.publish({
    headers: { token: req.headers.authorization },
    topic: 'OrderEvents',
    event: OrderEvent.CREATED_ORDER,
    message: {
      orderId: 1,
      item: [
        {
          productId: 1,
          quantity: 1,
        },
        {
          productId: 2,
          quantity: 2,
        },
      ],
    },
  });

  return res.status(200).json({ message: 'order created' });
});

router.get('/order', async (req: Request, res: Response): Promise<any> => {
  return res.status(200).json({ message: 'get order' });
});

router.get('/order/:id', async (req: Request, res: Response): Promise<any> => {
  return res.status(200).json({ message: 'get order' });
});

router.patch('/order', async (req: Request, res: Response): Promise<any> => {
  return res.status(200).json({ message: 'get order' });
});

router.delete('/order', async (req: Request, res: Response): Promise<any> => {
  return res.status(200).json({ message: 'get order' });
});

export default router;
