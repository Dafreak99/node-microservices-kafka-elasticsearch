import express from 'express';
import catalogRouter from './api/catalog.routes';
import { HandleErrorWithLogger, httpLogger, logger } from './utils';

const app = express();

app.use(express.json());
app.use(httpLogger);

app.use('/', catalogRouter);

app.use(HandleErrorWithLogger as any);

export default app;
