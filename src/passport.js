const passport = require('passport');


module.exports = (app, strategies) => {
  const applicationAddress = `${process.env['PROTOCOL']}://${process.env['HOSTNAME']}:${process.env['PORT']}`;
  strategies.forEach((strategy) => {
    passport.use(new strategy.strategyInstance({
      ...strategy.config,
      callbackURL: `${applicationAddress}/auth/${strategy.id}/callback`
    }, (accessToken, refreshToken, profile, done) => done(null, profile)));
  });
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  app.use(passport.initialize());
  app.use(passport.session());
}
