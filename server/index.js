/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint consistent-return:0 */
var dotenv = require('dotenv');

dotenv.config();
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('./util//logger');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var session = require('express-session');
var argv = require('./util/argv');
var port = require('./util//port');
var path = require('path');
var multer = require('multer');
var multerS3 = require('multer-s3');
var aws = require('aws-sdk');
var Router = require('./routes/index');
var config = require('./config');
var fs = require('fs');

var logPath = '.logs';
 
var Logger = require('tracer').dailyfile({
  root: logPath,
  maxLogFiles: 10,
  allLogsFileName: 'UserInfo',
});
var axios = require('axios');
var jwt = require('jsonwebtoken');
var jwt_decode = require('jwt-decode');

var app = express();
app.disable('x-powered-by');

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('test'));



var payload = {};


// To fetch user's IP-Address
var requestIp = require('request-ip');

app.use(requestIp.mw());

//Stop cacheing
app.set('etag', false);
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
});
app.disable('view cache');


//Global variables
let sessionId = "-";
let clientIP = "-";



app.get('/*', (req, res, next) => {
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});



let csrfProtection;
if (config.ENABLE_CSRF === 'true') {
  csrfProtection = csrf();
}



// Database connection
var db = require('./models/index');

var Payment = db.payments;
var User = db.users;
var { Op } = db.Sequelize;
db.sequelize.sync();





app.use('/locales', express.static(path.join(__dirname, 'locales')));


// get the intended host and port number, use localhost and port 3000 if not provided
var customHost = argv.host || process.env.HOST;
var host = customHost || null; // Let http.Server use its default IPv6/4 host
var prettyHost = customHost || 'localhost';

app.get('/*', (req, res, next) => {
  // res.setHeader('Cache-Control', 'public, max-age=2592000');
  res.setHeader('Expires', new Date(Date.now() + 85000000).toUTCString());
  next();

});


// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }
  logger.appStarted(port, prettyHost);
});

var decodeAccessToken = (reqHeaders) => {
  try {
    let token = '';
    if (reqHeaders.authorization && reqHeaders.authorization.split(' ')[0] === 'Bearer') {
      token = reqHeaders.authorization.split(' ')[1];
    }
    var decoded = jwt.verify(token, 'nodeApi123!679');
    console.log("1-------decoded",decoded);
    return decoded;
  } catch(err) {
    console.log("1-----jwt verify error", err);
  }
}

app.post('/api/userDetails/', (req, res) => {
   console.log("userDetails :: ",req.body.userId );
   
  User.findOne({
    where: {
       id: req.body.userId
    }
  }).then((data) => {
    Logger.info(' Selected User Info => ', data);
        res.send({
          message: data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Something went wrong',
        });
      });
    
});

app.post('/api/updateDetails', (req, res) => {
  console.log("POST userDetails :: ",req.body );
 
  console.log("POST userDetails accessToken :: ",req.headers.authorization );
  
  try {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
  }
//    var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJ1c2VySWQiOjEsInVzZXJUeXBlIjoiYWRtaW4ifQ.Ihd4cYVc2E-xJH63V8E5BsXjtGSXZlWiFINDVkcT8b0';
    var decoded = jwt.verify(token, 'nodeApi123!679');
    console.log("decoded",decoded);
  } catch(err) {
    console.log("jwt verify error", err);
  }
  
  var jwtInfo = decodeAccessToken(req.headers);
   if( jwtInfo.userType === 'user' ) {
      if(userInfo.hasOwnProperty('roleId')){
        res.status(403).send({
          message: "You do not have permission to modify role"
        });
      }
   } 
  var updateData = req.body;
  User.update(updateData, {
    where: { id: req.body.userId }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "User details has been updated successfully."
      });
    } else {
      res.send({
        message: `User details not updated `
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Something went wrong"
    });
  });
});


app.post('/api/allUsers/', (req, res) => {
  
 User.findAll().then((data) => {
  
  Logger.info('All User Info => ', data);
       res.send({
         message: data,
       });
     })
     .catch((err) => {
       res.status(500).send({
         message:
           err.message || 'Something went wrong',
       });
     });
   
});

app.post('/api/deleteUser/', (req, res) => {
  console.log("deleteUsers :: ",req.body.userId );
  
    var jwtInfo = decodeAccessToken(req.headers);
  if(jwtInfo.userType !== 'admin'){
    res.status(403).send({
      message: "You do not have permission to delete user",
    });
  }

  
 User.destroy({
  where: {
     id: req.body.userId 
  }
}).then((data) => {
    console.log("1--------del ", data);
    if(data === 1) {
       res.send({
         message: "User has been removed",
       });
      } else {
        res.send({
          message: "User not exist",
        });
      }
     })
     .catch((err) => {
       res.status(500).send({
         message:
           err.message || 'Something went wrong',
       });
     });
   
});







