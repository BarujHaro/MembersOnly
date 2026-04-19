const { Router } = require("express");
const usersController = require("../controllers/usersController");
const validateUser = require('../controllers/validators/userValidator');
const loginValidator = require('../controllers/validators/loginValidator');
const usersRouter = Router();

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/user/login");
}; 

usersRouter.get('/login', usersController.loginGet);
usersRouter.post('/login', loginValidator, usersController.loginPost);
usersRouter.get('/sign-up', usersController.signUpGet);
usersRouter.post('/sign-up', validateUser, usersController.signUpPost);
usersRouter.get('/join', isAuth, usersController.joinGet);
usersRouter.post('/join', isAuth, usersController.joinPost);
usersRouter.get('/profile', isAuth, usersController.ProfileGet);

usersRouter.get("/logout", isAuth, usersController.logout);

module.exports = usersRouter;