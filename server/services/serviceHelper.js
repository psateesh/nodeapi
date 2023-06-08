var config = require('../config');
var fetch = require('node-fetch');
var jwt_decode = require('jwt-decode');

var privateDec = (data) => {
  if (process.env.encrypt === 'yes') {
    const decrypted = jwt_decode(data);
    return decrypted;
  } else return data;
};

function refreshToken(req, res, tokens) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(tokens).accessToken}`,
    },
    body: JSON.stringify({
      RefreshUserTokenRequestMessage: {
        refreshToken: JSON.parse(tokens).refreshToken,
      },
    }),
    method: 'post',
  };
  fetch(`${config.CCB_API_URL}/ccb/refreshUserToken`, options)
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((result) => {
      if (status == 200) {
        req.session.tokens = JSON.stringify({
          refreshToken: result.RefreshUserTokenResponseMessage.refreshToken,
          accessToken: result.RefreshUserTokenResponseMessage.accessToken,
        });
        res.redirect(307, req.originalUrl);
      } else if (status == 401) {
        res.clearCookie(config.SESS_NAME);
        res.status(418).json({
          reason: 'Auth Failed while refreshing user token',
        });
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('Error in RefreshToken', error);
      res.clearCookie(config.SESS_NAME);
      res.status(418).json({
        reason: 'Error while refreshing user token',
      });
    });
}

function apiRequest(tokens, obj, apiName) {
  // console.log("JSON.stringify(obj)", JSON.stringify(obj));
  if (process.env.encrypt === 'yes') {
    // console.log("req",req);
    req.body = privateDec(req.body.data);
  }
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(tokens).accessToken}`,
      },
      body: JSON.stringify(obj),
      method: 'post',
    };
    fetch(`${config.CCB_API_URL}/ccb/${apiName}`, options)
      .then((response) => {
        const responseData = response.json();
        return {
          data: responseData,
          status: response.status,
        };
      })
      .then((result) => {
        if (result.status == 401) {
          // result.status = status;
          reject(result);
        } else {
          resolve(result.data);
        }
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error in ServiceHelper', error);
        reject(
          new Error({
            status: 500,
            error: 'something went wrong!!',
            errorObject: error,
          }),
        );
      });
  });
}

const serviceHelper = {};
serviceHelper.apiRequest = apiRequest;
serviceHelper.refreshToken = refreshToken;

module.exports = serviceHelper;
