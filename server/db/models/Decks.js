'use strict';

// not strictly needed but allows us to copy/paste this code to create other models.
const TABLENAME = 'DECKS';

import {addByMethods} from '../util';

export default (knex) => { // takes already configured/connected knex as dependency.

  // adds a record to the db.
  const create = ({
      created_by, // references uid in USERS
      is_public,
      title,
      subject,
    }) => knex(TABLENAME)
    .insert({
      created_by, // references uid in USERS
      is_public,
      title,
      subject,
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

  addByMethods(read, ['id', 'created_by', 'title', 'subject']);
  addByMethods(update, ['id', 'created_by', 'title', 'subject']);
  addByMethods(del, ['id', 'created_by', 'title', 'subject']);

  const count = () => knex(TABLENAME).count('*');

  return {
    create,
    read,
    update,
    del,
    count,
  };

};
