'use strict';

// not strictly needed but allows us to copy/paste this code to create other models.
const TABLENAME = 'QUESTIONS';

const addByMethods = (fn, bys) => {
  bys.forEach((by) => {
    fn["by_" + by] = fn(by);
  });
};

export default (knex) => { // takes already configured/connected knex as dependency.

  // adds a record to the db.
  const create = ({
      created_by, // references uid in USERS
      is_public,
      type,
      category,
      prompt,
      choices,
    }) => knex(TABLENAME)
    .insert({
      created_by,
      is_public,
      type,
      category,
      prompt,
      choices,
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


  del.by_name = (first_name, last_name) => knex(TABLENAME)
    .where({
      first_name,
      last_name
    })
    .del();

  addByMethods(read, ['id', 'created_by', 'type']);
  addByMethods(update, ['id']);
  addByMethods(del, ['id', 'created_by']);

  const count = () => knex(TABLENAME).count('*');

  return {
    create,
    read,
    update,
    del,
    count,
  };

};
