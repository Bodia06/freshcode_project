const express = require('express');
const cors = require('cors');
const router = require('./router');
const { errorHandlers } = require('./middlewares');
const { STATIC_PATH } = require('./constants');

const app = express();

app.use(
  cors({
    origin: 'https://squad-help.vercel.app',
    credentials: true,
  })
);

app.use(express.json());

app.use('/public', express.static(STATIC_PATH));

app.get('/', (req, res) => {
  res.status(200).send('Server is alive!');
});

app.use('/api', router);

app.use(errorHandlers.errorHandler);

module.exports = app;
