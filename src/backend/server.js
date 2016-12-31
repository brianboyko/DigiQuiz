'use strict';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import router from './router';
import api from './api';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json({
  limit: '100mb',
}));
app.use(bodyParser.urlencoded({
  limit: '100mb',
  extended: true,
}));
const server = http.Server(app);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

router(server, app);
api(server, app);
