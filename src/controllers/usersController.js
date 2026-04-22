const User = require('../models/users');
const Message = require('../models/messages');
const {validationResult, matchedData} = require("express-validator");
const validateUser = require('./validators/userValidator');
const loginValidator = require('./validators/loginValidator');
const bcrypt = require("bcryptjs");

exports.loginGet = async (req, res) => {
    try{
    
        res.render("login", {
            title: "Login",
            error: null
        });

    }catch(error){
        res.status(500).render("login", {
            title: "Login",
            error: "Error: loading form"
        });
    }

};

exports.loginPost = async (req, res) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        return res.render("login", {
            title: "Login",
            error: errors.array()[0].msg  
        });
        }


        const {gmail, pass} = req.body;
        
        //Basic validation
        if (!gmail || !pass) {
            return res.render("login", {
                title: "Login",
                error: "All fields are required"
            });
        }

        const user = await User.findByGmail(gmail);
        //Looking for user
        

        if (!user) {
        return res.render("login", {
            title: "Login",
            error: "User not found"
        });
        }

        const validPassword = await bcrypt.compare(pass, user.pass);
        //Matching password
        if (!validPassword) {
        return res.render("login", {
            title: "Login",
            error: "Incorrect password"
        });
        }
         
        //Login success
        req.login(user, (err) => {
            
            if (err) {
                return res.render("login", {
                title: "Login",
                error: "Login failed"
                });
            }

            return res.redirect("/");
        });

    }catch(error){
        res.status(500).render("login", {
            title: "Login",
            error: "Error: Login failed"
        });
    }

};

exports.signUpGet = async (req, res) => {
    try{
    
        res.render("sign-up", {
            title: "Sign up",
            error: null
        });

    }catch(error){
        res.status(500).render("sign-up", {
            title: "Sign up",
            error: "Error: loading form"
        });
    }

};

exports.signUpPost = async (req, res) => {
    try{
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        return res.render("sign-up", {
            title: "Sign up",
            error: errors.array()[0].msg 
        });
        }
        
        const {
            first_name,
            last_name,
            gmail,
            pass
        } = req.body;

        const newUser = await User.create({
            first_name,
            last_name,
            gmail,
            pass,
            member: false,
            admin: false
        });
        
        res.redirect("/user/login");

    }catch(error){
        console.error("SIGNUP ERROR:", error);
        res.status(500).render("sign-up", {
            title: "Sign up",
            error: "Error: Sign up failed"
        });
    }

};

exports.joinGet = async (req, res) => {
    try{
    //console.log("USER:", req.user);
        res.render("join", {
            title: "Join",
            secret: "OdinPro()",
            error: null
        });

    }catch(error){
        res.status(500).render("Join", {
            title: "Join",
            secret: "OdinPro()",
            error: "Error: loading form"
        });
    }

};

exports.joinPost = async (req, res) => {
    try{


    if (!req.user) {
      return res.status(401).render("Join", {
        title: "Join",
        secret: "OdinPro()",
        error: "You must be logged in"
      });
    }

    const { code } = req.body;


    if(code!=="OdinPro()" && code!=="4dm1nR3q()"){
        return res.render("Join", {
            title: "Join",
            secret: "OdinPro()",
            error: "Error: Invalid code"
        });
    }
 
    await User.setMembership(req.user.id);

    if(code==="4dm1nR3q()"){
        await User.setAdmin(req.user.id);
    }

    res.redirect("/");

    }catch(err){
        console.log(err);
        res.status(500).render("Join", {
            title: "Join",
            secret: "OdinPro()",
            error: "Error: Join failed"
        });
    }
};

exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }


    req.session.destroy(() => {
      res.redirect("/");
    });
  });
};



exports.ProfileGet = async (req, res) => {
    try{
        
        if (!req.user) {
        return res.status(401).render("profile", {
                title: "Profile",
                user: null,
                messages: [],
                error: "Error: You need to login first"
        });
        }

        
        const messages = await Message.getAllFromIdUser(req.user.id);
       
        res.render("profile", {
        title: "Profile",
        user: req.user,
        messages,
        error: null
        });

    }catch(error){
        console.error("PROFILE ERROR:", error);

        res.status(500).render("profile", {
            title: "Profile",
            user: null,
            messages: [],
            error: "Error: Loading messages failed"
        });
    }

};

