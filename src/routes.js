const controllers = require('./controllers');

module.exports = (app) => {
  app.get('/auth/:provider', controllers.authEndpoint);
  app.get('/auth/:provider/callback', controllers.authCallbackMiddleware, controllers.authCallbackEndpoint);
  app.get('/failauth', controllers.failureRedirection);
  app.get('*', (req, res) => {
    res.status(404).render('error');
  });
}