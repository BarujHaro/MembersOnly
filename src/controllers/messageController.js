const Message = require('../models/messages');
const User = require('../models/users');
const {validationResult, matchedData} = require("express-validator");
const validateMessage = require('./validators/messageValidator');

exports.messagesListGet = async (req, res) => {
    try{
        const messages = await Message.getAll();
        res.render("index", {
            title: "Members Only",
            messages,
            user: req.user || null,
            error: null
        });

    }catch(error){
        res.status(500).render("index", {
            title: "Members Only",
            user: req.user || null,
            error: "Error: loading messages is not posible"
        });
    }

};


exports.messageGetOne = async (req, res) => {
    const messageId = req.params.id;
    if(isNaN(messageId)){
        return res.status(400).send('ID invalid');
    }

    try{
        const message = await Message.findById(messageId);

        res.render('single-message', {
            title: 'Members Only',
            message: message,
            user: req.user || null,
            error: null
        });


    }catch(error){
        res.status(500).render("single-message", {
            title: "Members Only",
            message: null,
            user: req.user || null,
            error: "Error: loading message is not posible"
        });
    }
};