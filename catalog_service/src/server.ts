import app from './expressApp';

const PORT = process.env.PORT || 5000;

export const StartServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  process.on('uncaughtException', (err) => {
    console.error(err);
    process.exit(1);
  });
};

StartServer().then(() => {
  console.log('Server is up');
});
