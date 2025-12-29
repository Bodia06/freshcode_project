const { Router } = require('express');
const { checkToken } = require('../middlewares');
const { chatControllers } = require('../controllers');

const chatRouters = Router();

chatRouters.use(checkToken.checkToken);

chatRouters.post('/newMessage', chatControllers.addMessage);

chatRouters.post('/getChat', chatControllers.getChat);

chatRouters.post('/getPreview', chatControllers.getPreview);

chatRouters.post('/blackList', chatControllers.blackList);

chatRouters.post('/favorite', chatControllers.favoriteChat);

chatRouters.post('/createCatalog', chatControllers.createCatalog);

chatRouters.post('/updateNameCatalog', chatControllers.updateNameCatalog);

chatRouters.post('/addNewChatToCatalog', chatControllers.addNewChatToCatalog);

chatRouters.post(
  '/removeChatFromCatalog',
  chatControllers.removeChatFromCatalog
);

chatRouters.post('/deleteCatalog', chatControllers.deleteCatalog);

chatRouters.post('/getCatalogs', chatControllers.getCatalogs);

module.exports = chatRouters;
