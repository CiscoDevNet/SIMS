require('dotenv').config();

var express = require('express');
var partials = require('express-partials')
var passportConfig = require('./src/passport');
const routes = require('./src/routes');
const loginMethods = require('./src/loginMethods');

// Create a new Express application.
var app = express();


// Configure view engine to render EJS templates.
app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');
app.use(partials());

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

passportConfig(app, loginMethods);

routes(app);

app.listen(process.env['PORT'] || 3001, (...args) => {
  console.log('App is listening', args)
});