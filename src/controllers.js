const passport = require('passport');
const ISEActions = require('./ISEActions');
const loginMethods = require('./loginMethods');

// TODO
// Implement redirection mechanism back to portal
exports.failureRedirection = (req, res) => { res.send('shit') };

exports.authEndpoint = (req, res, next) => {
  const { portal, iseAddress: portalCallbackAddress, token } = req.query;
  if (!portalCallbackAddress || !portal || !token || !loginMethods.filter((s) => (s.id === req.params.provider)).length) {
    return res.redirect('/failauth');
  }
  const state = Buffer.from(JSON.stringify({ portal, portalCallbackAddress, token })).toString('base64');
  // Fallback method for oauth1.0 requests (twitter)
  req.session.state = state;
  passport.authenticate(req.params.provider, { state })(req, res, next);
};

exports.authCallbackEndpoint = async (req, res) => {
  const { state } = req.session || req.query,
    { provider } = req.params,
    { portal, portalCallbackAddress, token } = JSON.parse(Buffer.from(state, 'base64').toString()),
    guestUserObj = loginMethods.find(s => s.id === provider).serializeFunction(req.user),
    guestUserName = guestUserObj.GuestUser.name;
  console.log('Authetication callback called. provider:', provider, 'token:', token, 'guestUserName:', guestUserName);
  try {
    let guestUserCredentials = await ISEActions.fetchGuestUser(guestUserName);
    console.log('After search for existing user: ', guestUserCredentials);
    if (!guestUserCredentials) {
      guestUserCredentials = await ISEActions.createGuestUser(guestUserObj);
      console.log('User not found. Creating user: ', guestUserCredentials);
    }
    const { user, password } = guestUserCredentials;
    console.log('Redirect user to login page');
    res.render('success', { user: req.user._json, provider, portalCallbackAddress, portal, user, password, token, layout: 'layout' });
  } catch (err) {
    console.error('callback flow failed:', err, err.response && JSON.stringify(err.response.data.ERSResponse.messages))
  }
}

exports.authCallbackMiddleware = (req, res, next) => { passport.authenticate(req.params.provider, { failureRedirect: '/failauth' })(req, res, next); }
