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

exports.basicGuestUser = (user) => {
  const {
    userName,
    firstName,
    lastName,
    email,
    customFields = {}
  } = user;
  return {
    ...{
      GuestUser: {
        guestType: 'SocialLogin (default)',
        name: userName,
        status: 'ACTIVE',
        guestInfo: {
          ...{
            /**
             * TODO
             * Write this comment better
             * The default config for self-regiested password required
             * 4 minimum digits, you should change it
             * in case you changed the password policy
             */
            password: Math.floor(Math.random() * (9999 - 1000))+1000,
            firstName,
            lastName,
            email,
            userName,
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

exports.fetchGuestUser = async (userName) => {
  let userObj = null;
  try {
    const getUserRequest = await Axios.get(`https://${process.env['ISE_ADDRESS']}:9060/ers/config/guestuser/name/${userName}`, axiosERSGuestConfig);
    userObj = getUserRequest.data;
  } catch (error) {
    if (error.response && error.response.status !== 404) {
      throw error;
    }
  }
  return userObj && { user: userObj.GuestUser.guestInfo.userName, password: userObj.GuestUser.guestInfo.password };
}

exports.createGuestUser = async (user) => {
  try {
    const postUserRequest = await Axios.post(`https://${process.env['ISE_ADDRESS']}:9060/ers/config/guestuser`, this.basicGuestUser(user), axiosERSGuestConfig);
    console.log(postUserRequest.headers);
  } catch (error) {
    if (error.response && error.response.status !== 500) {
      throw error;
    } else if(error.response && error.response.status == 500 && error.response.data && error.response.data.ERSResponse && error.response.data.ERSResponse.messages && error.response.data.ERSResponse.messages.length) {
      // TODO:
      // Throw error with request 
      console.error(error.response.data.ERSResponse.messages);
    }
  }
  return { user: userObj.GuestUser.guestInfo.userName, password: userObj.GuestUser.guestInfo.password };
}
