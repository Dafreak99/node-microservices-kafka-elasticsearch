import { ExpressApp } from './expressApp';
import { logger } from './utils';

const PORT = process.env.APP_PORT || 9000;

export const StartServer = async () => {
  const expressApp = await ExpressApp();

  expressApp.listen(PORT, () => {
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
