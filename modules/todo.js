const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  index: {type: Number, require: true},
  title: {type: String, require: true},
  id: {type: String, require: true, unique: true},
  parentId: {type: String, require: true}
});

module.exports = model('ToDoList', schema);