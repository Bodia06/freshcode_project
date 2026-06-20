const http = require('http');
const app = require('./app');
const controller = require('./socketInit');
const { startCronJob } = require('./utils/logRotationService');
const db = require('./database/models');

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

async function bootstrap () {
  try {
    console.log('Connecting to Neon Postgres database...');

    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await db.sequelize.sync({ alter: true });
    console.log('All database tables synchronized successfully with Neon.');

    server.listen(PORT, HOST, () => {
      console.log(`SERVER RUNNING http://${HOST}:${PORT}`);
    });

    startCronJob();
    controller.createConnection(server);
  } catch (error) {
    console.error('Error during server startup or database sync:', error);
    process.exit(1);
  }
}

bootstrap();
