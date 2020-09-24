const passport = require('passport');


module.exports = (app, strategies) => {
  const envPort = process.env['PORT'];
  const port = envPort && (envPort == 443 || envPort == 80) ? '' : `:${process.env['PORT']}`;
  const applicationAddress = `${process.env['PROTOCOL']}://${process.env['CALLBACK_HOSTNAME']}${port}`;
  strategies.forEach((strategy) => {
    const cb = strategy.authCallback || ((accessToken, refreshToken, profile, done) => done(null, profile));
    passport.use(new strategy.strategyInstance({
      ...strategy.config,
      callbackURL: `${applicationAddress}/auth/${strategy.id}/callback`
    }, cb));
  });
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
  app.use(passport.initialize());
  app.use(passport.session());
}
