const { Router } = require("express");
const messageController = require("../controllers/messageController");
const messageValidator = require('../controllers/validators/messageValidator');
const { isAuth } = require('./middleware/Auth');

const messageRouter = Router();

messageRouter.get('/message/:id', messageController.messageGetOne);
messageRouter.post('/message/:id/delete', messageController.messageDelete);
messageRouter.get('/new-message', isAuth, messageController.newMessageGet);
messageRouter.post('/new-message', isAuth, messageValidator, messageController.newMessagePost);

messageRouter.get('/', messageController.messagesListGet);
 
module.exports = messageRouter;