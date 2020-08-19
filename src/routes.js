const controllers = require('./controllers');

/**
 * Assign controllers to routes
 *
 * @param {Express.Application} app
 */
module.exports = (app) => {
  app.get('/auth/:provider', controllers.authEndpoint);
  app.get('/auth/:provider/callback', controllers.authCallbackMiddleware, controllers.authCallbackEndpoint);
  app.get('/failauth', controllers.failureRedirection);
  app.get('*', (req, res) => {
    res.status(404).render('error');
  });
}