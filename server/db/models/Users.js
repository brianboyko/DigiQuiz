'use strict';

// not strictly needed but allows us to copy/paste this code to create other models.
const TABLENAME = 'USERS';

import { addByMethods } from '../util';

export default (knex) => { // takes already configured/connected knex as dependency.

  // adds a record to the db.
  const create = ({
      login,
      password,
      email,
      first_name,
      last_name
    }) => knex(TABLENAME)
    .insert({
      login,
      password,
      email,
      first_name,
      last_name,
    })
    .returning('uid');

  // creates a curry to read by a particular value.
  let read = (by) => (lookup) => knex(TABLENAME)
    .where({ [by]: lookup })
    .select();


  // special case where curry function cannot be used. Looks up user by first and last nam.
  read.by_name = (first_name, last_name) => knex(TABLENAME)
    .where({
      first_name,
      last_name
    })
    .select();
  // another special case.
  read.all = () => knex(TABLENAME).select();

  let update = (by) => (lookup, updateData) => knex(TABLENAME)
    .where({ [by]: lookup })
    .update(updateData);


  let del = (by) => (lookup) => knex(TABLENAME)
    .where({ [by]: lookup })
    .del();


  del.by_name = (first_name, last_name) => knex(TABLENAME)
    .where({
      first_name,
      last_name
    })
    .del();

  addByMethods(read, ['uid', 'login', 'email']);
  addByMethods(update, ['uid']);
  addByMethods(del, ['uid', 'login', 'email']);

  const count = () => knex(TABLENAME).count('*');

  return {
    create,
    read,
    update,
    del,
    count,
  };

};
