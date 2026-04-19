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


    try{
        const messageId = req.params.id;
        if (isNaN(messageId)) {
            return res.status(401).render("index", {
                title: "Members Only",
                messages,
                user: req.user || null,
                error: "Error: ID invalid"
            });
        }


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


exports.newMessageGet = async (req, res) => {
    try{
        res.render('new-message', {
            title: 'New message',
            error: null
        });
    }catch(error){
        res.render('new-message', {
            title: 'New message',
            error: 'Error: loading form failed'
        });
    }
};

exports.newMessagePost = async (req, res) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        return res.render("new-message", {
            title: "New message",
            error: errors.array()[0].msg  
        });
        }

        if (!req.user) {
        return res.status(401).render("new-message", {
            title: "New message",
            error: "You must be logged in"
        });
        }
        

        console.log(req.body);
        const {title, text} = req.body;
        const user_id = req.user.id;

        await Message.create({ title, text, user_id });

        res.redirect("/");

    }catch(error){
        console.log(error);
        res.render('new-message', {
            title: 'New message',
            error: 'Error: failed storing message'
        });
    }
};


exports.messageDelete = async (req, res) => {
    

    try{
        const messageId = req.params.id;
        if (isNaN(messageId)) {
            return res.status(401).render("index", {
                title: "Members Only",
                messages,
                user: req.user || null,
                error: null
            });
        }


        if (!req.user) {
            return res.status(401).render("single-message", {
                title: "Members Only",
                message: null,
                user: null,
                error: "Error: loading message is not posible"
            });
        }

        if (!req.user.admin) {
            return res.status(401).render("single-message", {
                title: "Members Only",
                message: null,
                user: req.user,
                error: "Error: Admin is necessary"
            });
        }

        
        await Message.deleteById(messageId);
        res.redirect('/');
    }catch(error){
        console.error(error);
        res.status(500).send('Error: Deleting message failed');
    }

};