const express = require("express"); 
const app = express();    
const path = require("node:path");  
require('dotenv').config();
const session = require("express-session");
const passport = require("passport");
require("./src/config/passport");
const messagesRouter = require("./src/routes/messageRoutes");
const usersRouter = require("./src/routes/UserRoutes");

app.use(session({ secret: process.env.SESSION_KEY, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");  
app.set('views', path.join(__dirname, 'src', 'views'));

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// RUTAS//
//app.use('/category', categoriesRouter);
app.use('/', messagesRouter);
app.use('/user', usersRouter);


// 404 (SIEMPRE AL FINAL)
app.use((req, res) => {
  res.status(404).render('partials/error', {
    title: 'Error',
    status: 404,
    message: 'Page not found',
    details: `The route "${req.originalUrl}" does not exist`
  });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {   
  if (error) {
    throw error;
  }
  console.log(`Express app listening on port ${PORT}!`);
});