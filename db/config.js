'use strict';

import knexSetup from 'knex';
import config from '../knexfile';

const ENV = 'development';
const knex = knexSetup(config[ENV]);

knex.migrate.latest([config]);

export default knex
