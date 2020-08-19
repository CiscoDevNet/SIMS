require('dotenv').config();

const express = require('express'),
  partials = require('express-partials'),
  passportConfig = require('./src/passport'),
  routes = require('./src/routes'),
  loginMethods = require('./src/loginMethods'),
  parser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  expressSession = require('express-session');

// Create a new Express app
var app = express();

// Configure view engine to render EJS templates
app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');
app.use(partials());

// Configure parsers and session manangement
app.use(cookieParser());
app.use(parser.urlencoded({ extended: true }));
app.use(expressSession({ secret: process.env['SESSION_SECRET'] || 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize passport strategies by loginMethods
passportConfig(app, loginMethods);

// Add basic auth routes
routes(app);

app.listen(process.env['PORT'] || 3001, () => {
  console.log('App is listening in port:', process.env['PORT'] || 3001);
});