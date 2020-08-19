/**
 * @module controllers
 * @author gmanor@cisco.com
 * 
 */
const passport = require('passport');
const ISEActions = require('./ISEActions');
const loginMethods = require('./loginMethods');

const portalFromRequest = (req) => {
  const { state } = req.session || req.query;
  if (!state) {
    return {};
  }
  const portal = { portalID = null, portalCallbackAddress = null, token = null } = JSON.parse(Buffer.from(state, 'base64').toString());
  return portal;
};


/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.failureRedirection = (req, res) => {
  const { portalCallbackAddress, portalID } = portalFromRequest(req);
  if(!portalCallbackAddress || !portalID) {
    return res.redirect('/');
  }
  res.redirect(`https://${portalCallbackAddress}/portal/PortalSetup.action?portal=${portalID}`);
};

/**
 *
 *
 * @param {Express.Request]} req
 * @param {Express.Response} res
 * @param {Function} next
 */
exports.authEndpoint = (req, res, next) => {
  const { portal, iseAddress: portalCallbackAddress, token } = req.query;
  if (!portalCallbackAddress || !portal || !token || !loginMethods.filter((s) => (s.id === req.params.provider)).length) {
    return res.redirect('/failauth');
  }
  const state = Buffer.from(JSON.stringify({ portalID: portal, portalCallbackAddress, token })).toString('base64');
  // Fallback method for oauth1.0 requests (twitter)
  req.session.state = state;
  passport.authenticate(req.params.provider, { state })(req, res, next);
};

exports.authCallbackEndpoint = async (req, res) => {
  const { provider } = req.params,
    portal = portalFromRequest(req),
    guestUserObj = loginMethods.find(s => s.id === provider).serializeFunction(req.user),
    guestUsername = guestUserObj.GuestUser.name;
  try {
    let credentials = await ISEActions.fetchGuestUser(guestUsername);
    if (!credentials) {
      credentials = await ISEActions.createGuestUser(guestUserObj);
    }
    const { username, password } = credentials;
    res.render('success', { portal, username, password, layout: 'layout' });
  } catch (err) {
    res.redirect('/failauth');
  }
}

exports.authCallbackMiddleware = (req, res, next) => { passport.authenticate(req.params.provider, { failureRedirect: '/failauth' })(req, res, next); }
