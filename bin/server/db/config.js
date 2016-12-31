'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _knexfile = require('../../../knexfile.js');

var _knexfile2 = _interopRequireDefault(_knexfile);

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENV = process.env.ENV || "development";
var knex = (0, _knex2.default)(_knexfile2.default[ENV]);

exports.default = knex;

// take the latest migration, if needed, and run it.

knex.migrate.latest([_knexfile2.default]);