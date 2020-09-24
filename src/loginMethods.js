const path = require('path');
const fs = require('fs');
const GitHubStrategy = require('passport-github').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const AppleStrategy = require('@nicokaiser/passport-apple');
const { basicGuestUser } = require('./ISEActions');

module.exports = [{
  id: 'apple',
  strategyInstance: AppleStrategy,
  config: {
    key: fs.readFileSync(path.join(__dirname, process.env['APPLE_KEY_PATH'])), // Private key, downloaded from https://developer.apple.com/account/resources/authkeys/list
    scope: ['name', 'email'],
    clientID: process.env['APPLE_CLIENT_ID'],
    teamID: process.env['APPLE_TEAM_ID'],
    keyID: process.env['APPLE_KEY_ID'],
  },
  serializeFunction: (userJson) => {
    return basicGuestUser(`apple_${userJson.id.split('.').join('')}`, null, null, userJson.email);
  }
}, {
  id: 'github',
  strategyInstance: GitHubStrategy,
  config: {
    clientID: process.env['GITHUB_CLIENT_ID'],
    clientSecret: process.env['GITHUB_SECRET'],
  },
  serializeFunction: (userJson) => {
    const user = userJson._json,
      { id, name = '', company = '', email: emailAddress = '', avatar_url = '', html_url = '', location = '', hireable = '' } = user,
      firstName = name.split(' ')[0],
      lastName = (name.indexOf(' ') > -1 && name.split(' ')[1]),
      guestUser = basicGuestUser(`github_${id}`, firstName, lastName, emailAddress);
    guestUser.GuestUser.customFields = {
      // ...guestUser.GuestUser.customFields,
      // company,
      // avatar_url,
      // html_url,
      // location,
      // hireable,
    };
    return guestUser;
  }
}, {
  id: 'linkedin',
  strategyInstance: LinkedInStrategy,
  config: {
    clientID: process.env['LINKEDIN_CLIENT_ID'],
    clientSecret: process.env['LINKEDIN_SECRET'],
    scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
  },
  serializeFunction: (userJson) => {
    const { id, name = {}, photos = [], emails = [] } = userJson;
    return basicGuestUser(`linkedin_${id}`, name.givenName || '', name.familyName || '', emails[0] && emails[0].value || '')
  }
}, {
  id: 'google',
  strategyInstance: GoogleStrategy,
  config: {
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    scope: ['email', 'profile'],
  },
  serializeFunction: (userJson) => {
    const user = userJson._json,
      { sub: id, given_name: firstName = '', family_name: lastName = '', email: emailAddress = '', picture = '' } = user,
      guestUser = basicGuestUser(`google_${id}`, firstName, lastName, emailAddress);
    guestUser.GuestUser.customFields = {
      // ...guestUser.GuestUser.customFields,
      // picture,
    };
    return guestUser;
  }
}, {
  id: 'twitter',
  strategyInstance: TwitterStrategy,
  config: {
    consumerKey: process.env['TWITTER_CONSUMER_KEY'],
    consumerSecret: process.env['TWITTER_CONSUMER_SECRET'],
  },
  serializeFunction: (userJson) => {
    const user = userJson._json,
      { id, name = '', profile_image_url = '', screen_name = '', statuses_count = '', location = '' } = user,
      firstName = name.split(' ')[0],
      lastName = (name.indexOf(' ') > -1 && name.split(' ')[1]) || '',
      guestUser = basicGuestUser(`twitter_${id}`, firstName, lastName);
    guestUser.GuestUser.customFields = {
      // ...guestUser.GuestUser.customFields,
      // screen_name,
      // location,
      // statuses_count,
      // profile_image_url,
    };
    return guestUser;
  }
}
];