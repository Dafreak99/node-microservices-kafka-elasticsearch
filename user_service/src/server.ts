import app from './expressApp';
import { logger } from './utils';

const PORT = process.env.PORT || 9001;

export const StartServer = async () => {
  app.listen(PORT, () => {
    logger.info(`Server is running at http://localhost:${PORT}`);
  });

  process.on('uncaughtException', (err) => {
    logger.error(err);
    process.exit(1);
  });
};

StartServer().then(() => {
  logger.info('Server is up');
});
