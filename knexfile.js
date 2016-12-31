'use strict';
// knexfile.js must go in / (root);

var databaseURL = process.env.DATABASE_URL || 'postgres://postgres:digiquiz@127.0.0.1:5432/digiquiz2';

module.exports = {
  development: {
    client: 'pg',
    connection: databaseURL,
    migrations: {
      directory: "./bin/server/migrations",
      tableName: "version"
    },
  },
  production: {
    client: 'pg',
    connection: databaseURL,
  },
  migrations: {
    directory: "./bin/server/migrations",
    tableName: "version"
  },
};
