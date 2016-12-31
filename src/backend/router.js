'use strict';
// src/backend/routes.js
import express from 'express';

export default (server, app) => {
  app.use('/', express.static('./'));
  app.use('/queryresults/:queryId', express.static('./'));
};
