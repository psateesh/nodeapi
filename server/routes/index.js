var express = require('express');
var app_route = require('./app_routes');

var Router = express.Router();

Router.use('/app', app_route);

module.exports = Router;
