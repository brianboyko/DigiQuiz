'use strict';
// src/backend/api.js
import moment from 'moment';
import knex from './db/config';
// import QueryController from './database/controllers/query';
// const queryController = QueryController(knex);

export default (server, app) => {
  // const queryController = QueryController(knex);

  app.get('/api/test', (req, res) => {
    res.send("I'm in L.A. My highlights look okay.");
  });


  app.post('/api/testpost', (req, res) => {
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
