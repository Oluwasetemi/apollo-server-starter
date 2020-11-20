const { google } = require('googleapis');
const axios = require('axios');

/** **************** */
/** CONFIGURATION * */
/** **************** */

const defaultScope = [
  'https://www.googleapis.com/auth/user.phonenumbers.read',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

/** ********** */
/** HELPERS * */
/** ********** */

if (!process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_SECRET) {
  throw Error('Enter the google secret in the env file');
}
/**
 * @summary create connection to google-api
 * @param {*} url the redirect url
 * @returns {any} authentication object
 */
function createConnection(url) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    url
  );
}

/**
 * @summary generatea url
 * @param {*} auth google auth object
 * @returns {string} return an authentication url
 */
function getConnectionUrl(auth) {
  return auth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: defaultScope,
  });
}

/** ******* */
/** MAIN * */
/** ******* */

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
/**
 * @summary Create a Google URL and send to the client to log in the user
 * @returns {string} authentication url
 */
function urlGoogle() {
  let url = '';
  url = encodeURI('https://chooselife.com/app');
  const auth = createConnection(url);
  url = getConnectionUrl(auth);
  return url;
}

/**
 * @summary Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 * @param {string} code uri encoded auth token
 * @returns {object} google user profile
 */
const getGoogleAccountFromCode = async (code) => {
  try {
    const url = encodeURI('https://chooselife.com/app');
    const auth = createConnection(url);
    const data = await auth.getToken(code);
    const { tokens } = data;
    const options = {
      method: 'GET',
      uri:
        'https://people.googleapis.com/v1/people/me?personFields=emailAddresses,names,photos,phoneNumbers,addresses',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    };
    let me = await axios(options);
    me = JSON.parse(me);
    const userGoogleEmail = me.emailAddresses[0].value;
    const userAvatar = me.photos[0].url;
    const { displayName } = me.names[0];

    return {
      email: userGoogleEmail,
      image: userAvatar,
      name: displayName,
      source: 'GOOGLE',
    };
  } catch (error) {
    if (error.message === 'invalid_grant')
      throw new Error(
        'The generated authorization code can only be used once. Regenerate another authorization code'
      );
    throw new Error(error);
  }
};

module.exports = {
  urlGoogle,
  getGoogleAccountFromCode,
};
