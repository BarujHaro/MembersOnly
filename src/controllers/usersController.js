const User = require('../models/users');
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