var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
  _owner   : {type: String},
  _deck    : {type: String},
  time     : {type: Date}, 
  testData : {
    type: Array
  }
});

module.exports = mongoose.model('test', testSchema);
