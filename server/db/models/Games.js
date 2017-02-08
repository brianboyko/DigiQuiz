'use strict';

// not strictly needed but allows us to copy/paste this code to create other models.
const TABLENAME = 'GAMES';

import { addByMethods } from '../util';

export default (knex) => { // takes already configured/connected knex as dependency.

  // adds a record to the db.
  const create = ({
      roomcode,
      deck,
      created_by,
    }) => knex(TABLENAME)
    .insert({
      roomcode,
      deck,
      created_by,
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
