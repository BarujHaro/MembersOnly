const { Router } = require("express");
const usersController = require("../controllers/usersController");
const validateUser = require('../controllers/validators/userValidator');
const loginValidator = require('../controllers/validators/loginValidator');
const { loginLimiter } = require('./middleware/rateLimiter');
const {isAuth} = require('./middleware/Auth');
const usersRouter = Router();


usersRouter.get('/login', usersController.loginGet);
usersRouter.post('/login', loginLimiter, loginValidator, usersController.loginPost);
usersRouter.get('/sign-up', usersController.signUpGet);
usersRouter.post('/sign-up', validateUser, usersController.signUpPost);
usersRouter.get('/join', isAuth, usersController.joinGet);
usersRouter.post('/join', isAuth, usersController.joinPost);
usersRouter.get('/profile', isAuth, usersController.ProfileGet);

usersRouter.get("/logout", isAuth, usersController.logout);

module.exports = usersRouter;