'use strict';
// src/backend/routes.js

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (server, app) {
  app.use('/', _express2.default.static('./'));
  app.use('/queryresults/:queryId', _express2.default.static('./'));
};