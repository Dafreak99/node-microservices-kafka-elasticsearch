import express from 'express';
import authRoute from './routes/auth.routes';
import { HandleErrorWithLogger, httpLogger } from './utils';

const app = express();

app.use(express.json());
app.use(httpLogger);

app.use('/auth', authRoute);

app.use(HandleErrorWithLogger as any);

export default app;
