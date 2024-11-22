import express, { Request, Response } from 'express';
import cors from 'cors';
import orderRoutes from './routes/order.routes';
import cartRoutes from './routes/cart.routes';
import { HandleErrorWithLogger, httpLogger } from './utils';

const app = express();

app.use(cors());
app.use(express.json());
app.use(httpLogger);

app.use(cartRoutes);
app.use(orderRoutes);

app.use('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'I am healthy' });
});

app.use(HandleErrorWithLogger as any);

export default app;
