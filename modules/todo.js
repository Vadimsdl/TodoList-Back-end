const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  index: {type: Number, require: true},
  title: {type: String, require: true},
  parentId: {type: String, require: true}
},
{
  versionKey: false
}
);

module.exports = model('ToDoList', schema);