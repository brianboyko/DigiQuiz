'use strict';

// not strictly needed but allows us to copy/paste this code to create other models.
const TABLENAME = 'RESPONSES';

import { addByMethods } from '../util';

export default (knex) => { // takes already configured/connected knex as dependency.

  // adds a record to the db.
  const create = ({
      game,
      question,
      player,
      answer_provided,
      is_correct,
      point_value,
      response_time_ms,
    }) => knex(TABLENAME)
    .insert({
      game,
      question,
      player,
      answer_provided,
      is_correct,
      point_value,
      response_time_ms,
    })
    .returning('id');

  // creates a curry to read by a particular value.
  let read = (by) => (lookup) => knex(TABLENAME)
    .where({ [by]: lookup })
    .select();

  // another special case.
  read.all = () => knex(TABLENAME).select();

  let update = (by) => (lookup, updateData) => knex(TABLENAME)
    .where({ [by]: lookup })
    .update(updateData);


  let del = (by) => (lookup) => knex(TABLENAME)
    .where({ [by]: lookup })
    .del();

  addByMethods(read, ['id', 'roomcode', 'deck', 'created_by']);
  addByMethods(update, ['id', 'roomcode', 'deck', 'created_by']);
  addByMethods(del, ['id', 'roomcode', 'deck', 'created_by']);

  const count = () => knex(TABLENAME).count('*');

  return {
    create,
    read,
    update,
    del,
    count,
  };

};
