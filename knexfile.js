'use strict';
// knexfile.js must go in / (root);

var databaseURL = process.env.DATABASE_URL || 'postgres://digiquiz:digiquiz@127.0.0.1:5432/digiquiz';

module.exports = {
  development: {
    client: 'pg',
    connection: databaseURL,
    migrations: {
      directory: "./server/migrations",
      tableName: "version"
    },
  },
  production: {
    client: 'pg',
    connection: databaseURL,
    migrations: {
      directory: "./server/migrations",
      tableName: "version"
    },
  },
  migrations: {
    directory: "./server/migrations",
    tableName: "version"
  },
};
