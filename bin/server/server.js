'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 3000;

var app = (0, _express2.default)();
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json({
  limit: '100mb'
}));
app.use(_bodyParser2.default.urlencoded({
  limit: '100mb',
  extended: true
}));
var server = _http2.default.Server(app);

server.listen(PORT, function () {
  console.log('Server is listening on port ' + PORT);
});

(0, _router2.default)(server, app);
(0, _api2.default)(server, app);