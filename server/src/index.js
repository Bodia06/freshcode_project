const http = require('http');
const app = require('./app');
const controller = require('./socketInit');
const { startCronJob } = require('./utils/logRotationService');

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`SERVER RUNING http://${HOST}:${PORT}`);
});

startCronJob();
controller.createConnection(server);
