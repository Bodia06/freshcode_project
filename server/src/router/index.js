const { Router } = require('express');
const contestRouters = require('./contestRouters');
const userRouters = require('./userRouters');
const chatRouters = require('./chatRouters');

const router = Router();

router.use('/contest', contestRouters);

router.use('/user', userRouters);

router.use('/chat', chatRouters);

module.exports = router;
