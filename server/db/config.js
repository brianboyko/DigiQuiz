'use strict';

import config from '../../knexfile.js';
import Knex from 'knex';
const ENV = process.env.NODE_ENV || "development";
console.log("Current process.env.NODE_ENV: ", process.env.NODE_ENV);
console.log("Current ENV", ENV);
const knex = Knex(config[ENV]);

export default knex;

// take the latest migration, if needed, and run it.
knex.migrate.latest([config]);
