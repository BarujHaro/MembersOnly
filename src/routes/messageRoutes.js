const { Router } = require("express");
const messageController = require("../controllers/messageController");
const messageRouter = Router();

messageRouter.get('/message/:id', messageController.messageGetOne);


messageRouter.get('/', messageController.messagesListGet);

module.exports = messageRouter;