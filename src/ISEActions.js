const Axios = require('axios');
const https = require('https');

const axiosERSGuestConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),
  auth: {
    username: process.env['ISE_SPONSOR_USER_NAME'],
    password: process.env['ISE_SPONSOR_PASSWORD']
  }
};

const credentials = (username, password) => {
  return {
    ...{
      username,
      password
    }
  }
}

/**
 *
 *
 * @param {*} user
 * @returns
 */
exports.basicGuestUser = (
  username,
  firstName,
  lastName,
  emailAddress,
  customFields = {}
) => {
  return {
    ...{
      GuestUser: {
        guestType: 'SocialLogin (default)',
        name: username,
        status: 'ACTIVE',
        guestInfo: {
          ...{
            /**
             * The default config for self-regiested password required 4 digits minimum
             * It's recommended to change it here and in ISE in case you changed the password policy
             */
            password: `${Math.floor(Math.random() * (9999 - 1000)) + 1000}`,
            firstName,
            lastName,
            emailAddress,
            userName: username,
            enabled: true,
          }
        },
        guestAccessInfo: {
          ...{
            validDays: 5,
            location: process.env['GUEST_USER_LOCATION']
          }
        },
        portalId: process.env['SPONSOR_PORTAL_ID'],
        customFields
      }
    }
  };
}

/**
 * 
 *
 * @param {string} username
 * @returns {Promise<null|credentials>}
 * @throws {error}
 */
exports.fetchGuestUser = async (username) => {
  let userObj = null;
  try {
    const getUserRequest = await Axios.get(`https://${process.env['ISE_ADDRESS']}:9060/ers/config/guestuser/name/${username}`, axiosERSGuestConfig);
    userObj = getUserRequest.data;
  } catch (error) {
    if (!error.response || error.response.status !== 404) {
      throw error;
    }
  }
  return userObj && credentials(userObj.GuestUser.guestInfo.userName, userObj.GuestUser.guestInfo.password);
}

/**
 *
 *
 * @returns {Promise<credentials>}
 * @throws {error}
 */
exports.createGuestUser = async (user) => {
  const username = user.GuestUser.guestInfo.userName,
    password = user.GuestUser.guestInfo.password;
  try {
    await Axios.post(`https://${process.env['ISE_ADDRESS']}:9060/ers/config/guestuser`, user, axiosERSGuestConfig);
  } catch (error) {
    let messages = [];
    if (error.response && error.response.data && error.response.data.ERSResponse && error.response.data.ERSResponse.messages && error.response.data.ERSResponse.messages.length) {
      messages = error.response.data.ERSResponse.messages.map(m => m.title);
      
    }
    console.error(`ERS Call failed. Status: ${error.response.status}. Details ${messages}`);
    throw error;
  }
  return credentials(username, password);
}
