'use strict';
// /index.js

import express from 'express';
import db from '../db/config'; 

const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT + '!')
})
