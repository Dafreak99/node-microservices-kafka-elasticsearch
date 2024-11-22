import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/order', async (req: Request, res: Response): Promise<any> => {
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
