
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.shema.createTable('USERS', function(table) {
      table.increments('uid').primary();
      table.string('login');
      table.string('password');
      table.string('email');
      table.string('first_name');
      table.string('last_name');
      table.timestamps();
    }),

    knex.schema.createTable('QUESTIONS', function(table){
      table.increments('id').primary();
      table.integer('created_by')
           .references('uid')
           .inTable('USERS');
      table.boolean('is_public');
      table.string('type');
      table.string('category');
      table.string('prompt');
      table.string('choices'); // likely JSON;
      table.timestamps();
    }),

    knex.schema.createTable('DECKS', function(table) {
      table.increments('id').primary();
      table.integer('created_by')
           .references('uid')
           .inTable('USERS');
      table.boolean('is_public');
      table.timestamps();
      table.string('title');
      table.string('subject');
    }),

    knex.schema.createTable('GAMES', function(table){
      table.increments('id').primary();
      table.string('roomcode');
      table.timestamps();
      table.dateTime('finished');
      table.integer('deck')
           .references('id')
           .inTable('DECKS');
      table.integer('created_by')
           .referenes('uid')
           .inTable('USERS');
    }),

    knex.schema.createTable('RESPONSES', function(table) {
      table.increments('id').primary();
      table.integer('game')
           .references('id')
           .inTable('GAMES');
      table.integer('question')
           .references('id')
           .inTable('QUESTIONS');
      table.integer('player')
           .references('uid')
           .inTable('USERS');
      table.string('answer_provided')
      table.boolean('is_correct');
      table.integer('point_value');
      table.integer('max_point_value');
      table.dateTime('asked');
      table.integer('response_time_ms');
    }),

    knex.schema.createTable('KEYWORDS', function(table) {
      table.increments('id').primary();
      table.string('word');
    }),

    knex.schema.createTable('QUESTIONS_KEYWORDS', function(table){
      table.increments('id').primary();
      table.integer('question')
           .references('id')
           .inTable('QUESTIONS');
      table.integer('keyword')
           .references('id')
           .inTable('KEYWORDS')
    }),
    knex.schema.createTable('USERS_DECKS', function(table){
      table.increments('id').primary();
      table.integer('user')
           .references('uid')
           .inTable('USERS');
      table.integer('deck')
           .references('id')
           .inTable('DECKS')
    }),
    knex.schema.createTable('DECKS_QUESTIONS', function(table){
      table.increments('id').primary();
      table.integer('question')
           .references('id')
           .inTable('QUESTIONS');
      table.integer('deck')
           .references('id')
           .inTable('DECKS')
    }),
    knex.schema.createTable('GAMES_PLAYERS', function(table){
      table.increments('id').primary();
      table.integer('player')
           .references('uid')
           .inTable('USERS');
      table.integer('game')
           .references('id')
           .inTable('GAMES')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all(['USERS', 'QUESTIONS', 'DECKS', 'GAMES', 'RESPONSES', 'KEYWORDS', 'QUESTIONS_KEYWORDS', 'USERS_DECKS', 'DECKS_QUESTIONS', 'GAMES_PLAYERS'].map(function(tableName){
    return(knex.schema.dropTable(tableName))
  })
};
