'use strict';
// to do, curry this ito multiple models. 

export default (knex) => {

  /**
   * creates an entry in the database.
   * @method create
   * @param  {string} login      login name
   * @param  {string} password   password (hashed)
   * @param  {string} email      email
   * @param  {string} first_name first name
   * @param  {string} last_name  last name
   * @return {object}            Object containing the UID of the user
   */
  const create = ({
      login,
      password,
      email,
      first_name,
      last_name
    }) => knex('USERS')
    .insert({
      login,
      password,
      email,
      first_name,
      last_name,
    })
    .returning('uid');

  let read = (by) => (lookup) => knex('USERS').where({ [by] : lookup }).select();
  ['uid', 'login', 'email'].forEach((by) => {
    read["by_" + by] = read(by);
  });
  read.by_name = (first_name, last_name) => knex('USERS').where({ first_name, last_name }).select();


  let update = (id, updateData) => knex('USERS')
    .where({
      uid: id
    })
    .update(updateData);

  let makeDel = (lookups) => lookups.reduce((pv, cv) => Object.assign(pv, {
    [by_ + cv]: (value) => knex('USERS')
      .where({
        [cv]: value
      })
      .del()
  }), {});

  let del = makeDel(['uid', 'login', 'email']);
  del.by_name = (first_name, last_name) => knex('USERS')
    .where({
      first_name,
      last_name
    })
    .del();

  let output = {
    create,
    read,
    update,
    del
  };

  let info = (o) =>
    Object.keys(o)
    .forEach((k) => {
      if (!!o[k] && typeof(o[k] == 'object')) {
        console.log(k);
        info(o[i]);
      }
      else {
        console.log(k);
      }
    });


  return Object.assign(output, {
    getInfo: () => info(output)
  });
};
