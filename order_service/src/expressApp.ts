import express, { Request, Response } from 'express';
import cors from 'cors';
import orderRoutes from './routes/order.routes';
import cartRoutes from './routes/cart.routes';
import { HandleErrorWithLogger, httpLogger } from './utils';
import { MessageBroker } from './utils/broker';
import { Consumer, Producer } from 'kafkajs';

export const ExpressApp = async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);

  // // 1st step: connect to the producer and consumer
  // const producer = await MessageBroker.connectProducer<Producer>();
  // producer.on('producer.connect', () => {
  //   console.log('producer connected');
  // });

  // const consumer = await MessageBroker.connectConsumer<Consumer>();
  // consumer.on('consumer.connect', () => {
  //   console.log('consumer connected');
  // });

  // // 2nd step: subscribe to the topics or publish the message
  // await MessageBroker.subscribe((message) => {
  //   console.log('Consumer received the message');
  //   console.log('Message received!', message);
  // }, 'OrderEvents');

  app.use(cartRoutes);
  app.use(orderRoutes);

  app.use('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'I am healthy' });
  });

  app.use(HandleErrorWithLogger as any);

  return app;
};
