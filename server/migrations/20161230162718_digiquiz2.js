exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('USERS', function(table) {
      table.increments('uid')
        .primary();
      table.string('login');
      table.string('password');
      table.string('email');
      table.string('first_name');
      table.string('last_name');
      table.timestamps();
    }),

    knex.schema.createTable('QUESTIONS', function(table) {
      table.increments('id')
        .primary();
      table.integer('created_by')
        .references('uid')
        .inTable('USERS')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table.boolean('is_public');
      table.string('type');
      table.string('category');
      table.string('prompt');
      table.string('choices'); // likely JSON;
      table.string('answer');
      table.timestamps();
    }),

    knex.schema.createTable('DECKS', function(table) {
      table.increments('id')
        .primary();
      table.integer('created_by')
        .references('uid')
        .inTable('USERS')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table.boolean('is_public');
      table.string('title');
      table.string('subject');
      table.timestamps();
    }),

    knex.schema.createTable('GAMES', function(table) {
      table.increments('id')
        .primary();
      table.string('roomcode');
      table.timestamps();
      table.dateTime('finished');
      table.integer('deck')
        .references('id')
        .inTable('DECKS')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.integer('created_by')
        .references('uid')
        .inTable('USERS')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
    }),

    knex.schema.createTable('RESPONSES', function(table) {
      table.increments('id')
        .primary();
      table.integer('game')
        .references('id')
        .inTable('GAMES')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.integer('question')
        .references('id')
        .inTable('QUESTIONS')
        .onDelete('CASCADE')
        .onDelete('CASCADE');
      table.integer('player')
        .references('uid')
        .inTable('USERS')
        .onDelete('SET NULL')
        .onUpdate('CASCADE');
      table.string('answer_provided');
      table.boolean('is_correct');
      table.integer('point_value');
      table.integer('max_point_value');
      table.dateTime('asked');
      table.integer('response_time_ms');
    }),

    knex.schema.createTable('KEYWORDS', function(table) {
      table.increments('id')
        .primary();
      table.string('word');
    }),

    knex.schema.createTable('QUESTIONS_KEYWORDS', function(table) {
      table.increments('id')
        .primary();
      table.integer('question')
        .references('id')
        .inTable('QUESTIONS')
        .onDelete('CASCADE');
      table.integer('keyword')
        .references('id')
        .inTable('KEYWORDS')
        .onDelete('CASCADE');
    }),
    knex.schema.createTable('USERS_DECKS', function(table) {
      table.increments('id')
        .primary();
      table.integer('user')
        .references('uid')
        .inTable('USERS')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.integer('deck')
        .references('id')
        .inTable('DECKS')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    }),
    knex.schema.createTable('DECKS_QUESTIONS', function(table) {
      table.increments('id')
        .primary();
      table.integer('question')
        .references('id')
        .inTable('QUESTIONS')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.integer('deck')
        .references('id')
        .inTable('DECKS')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    }),
    knex.schema.createTable('GAMES_PLAYERS', function(table) {
      table.increments('id')
        .primary();
      table.integer('player')
        .references('uid')
        .inTable('USERS')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.integer('game')
        .references('id')
        .inTable('GAMES')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    'USERS',
    'QUESTIONS',
    'DECKS',
    'GAMES',
    'RESPONSES',
    'KEYWORDS',
    'QUESTIONS_KEYWORDS',
    'USERS_DECKS',
    'DECKS_QUESTIONS',
    'GAMES_PLAYERS'
  ].map(function(tableName) {
    return knex.schema.dropTable(tableName);
  }));
};
