'use strict';
// knexfile.js must go in / (root);
var makeUrl = function(coll) {
  return process.env.DATABASE_URL || ('postgres://digiquiz:digiquiz@127.0.0.1:5432/digiquiz' + coll);
};

module.exports = {
  development: {
    client: 'pg',
    connection: makeUrl('Dev'),
    migrations: {
      directory: "./server/migrations",
      tableName: "version"
    },
  },
  production: {
    client: 'pg',
    connection: makeUrl('Prod'),
    migrations: {
      directory: "./server/migrations",
      tableName: "version"
    },
  },
  test: {
    client: 'pg',
    connection: makeUrl('Test'),
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
