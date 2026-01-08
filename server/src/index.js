const http = require('http');
const app = require('./app');
const controller = require('./socketInit');

const server = http.createServer(app);

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  console.log(`SERVER RUNING http://${HOST}:${PORT}`);
});

controller.createConnection(server);
