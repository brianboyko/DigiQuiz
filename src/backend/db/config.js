'use strict';

import config from '../../../knexfile.js';
import Knex from 'knex';
const ENV = process.env.ENV || "development";
const knex = Knex(config[ENV]);

export default knex;

// take the latest migration, if needed, and run it.
knex.migrate.latest([config]);
