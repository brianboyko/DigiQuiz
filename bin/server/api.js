'use strict';
// src/backend/api.js

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _config = require('./db/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import QueryController from './database/controllers/query';
// const queryController = QueryController(knex);

exports.default = function (server, app) {
  // const queryController = QueryController(knex);

  app.get('/api/test', function (req, res) {
    res.send("I'm in L.A. My highlights look okay.");
  });

  app.post('/api/testpost', function (req, res) {
    res.send(req.body.data.toUpperCase());
  });

  // app.post('/api/createcollection', function (req, res) {
  //   queryController.startQuery(
  //     req.body.tagName,
  //     { startDate: req.body.startDate, endDate: req.body.endDate },
  //     req.body.userEmail,
  //     res
  //   ).catch((e) => console.log(e));
  // });

  // app.get('/api/getCollection/:queryId', function (req, res) {
  //   queryController.retrieveQuery(req.params.queryId, res)
  //     .catch((e) => console.log(e));
  // });
};