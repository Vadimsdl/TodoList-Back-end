const Todo = require('../modules/todo');

async function get(req, res) {
  try {
    const result = await Todo.find();
    res.status(200).send(result);
  } catch {}
}

async function add(req, res) {
  try {
    
    const {index, title, parentId} = req.body;
    const todo = new Todo({index, title, parentId});
    await todo.save();

    res.status(200).json({message: 'Have fun!'});

  } catch (e){
    res.status(500).json({message: `Something wrong ${e.message}`});
  }

}

async function remove(req, res) {
  try{
    const {index, title, _id, parentId} = req.body;

    if (!!_id) await removeTask(_id, parentId, Todo)
    else await removeSublist(parentId, Todo)
    
    res.status(200).json({message: 'Have fun!'});

  } catch (e){
    res.status(500).json({message: `Something wrong ${e.message}`});
  }
}

async function updateUp(req, res) {
  try{
    const {index, title, _id, parentId} = req.body;
    const {index: taskMoveIndex} = await Todo.findOne({_id});
    
    if(taskMoveIndex !== 0) {
      const tasks = await Todo.find({parentId});
      const task = tasks.find(task => task.index === (taskMoveIndex-1) && task.parentId === parentId);
      await Todo.updateOne({_id}, {index: task.index});
      await Todo.updateOne({_id: task._id}, {index: taskMoveIndex});
    }
    res.status(200).json({message: 'Have fun!'});

  } catch (e){
    res.status(500).json({message: `Something wrong ${e.message}`});
  }
}

async function updateDown(req, res) {
  try{
    const {index, title, _id, parentId} = req.body;
    const {index: taskMoveIndex} = await Todo.findOne({_id});
    const tasks = await Todo.find({parentId});

    if(tasks.length-1 !== taskMoveIndex) {
      
      const task = tasks.find(task => task.index === (taskMoveIndex+1) && task.parentId === parentId);
      await Todo.updateOne({_id}, {index: task.index});
      await Todo.updateOne({_id: task._id}, {index: taskMoveIndex});
    }
    res.status(200).json({message: 'Have fun!'});

  } catch (e){
    res.status(500).json({message: `Something wrong ${e.message}`});
  }

}



async function removeTask(_id, parentId, Todo) {
  let tasks = await Todo.find();

  for (let i = 0; i < tasks.length; i++) {
    const task = await Todo.findOne({parentId: _id}) 
    if(!!task) {
      await Todo.deleteOne({parentId: _id});
      removeTask(task._id, parentId, Todo);
    } else {
      await Todo.deleteOne({_id: _id});
    }
  }
  tasks = await Todo.find();
  let next = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].parentId === parentId) {
      await Todo.updateOne({_id: tasks[i]._id}, {index: next });
      next+=1;
    }
  }
  return
}

async function removeSublist(_id, Todo) {
  const tasks = await Todo.find();
  for (let i = 0; i < tasks.length; i++) {
    const task = await Todo.findOne({parentId: _id})
    await Todo.deleteOne({parentId: _id});

    if(!!task)
      await removeSublist(task._id, Todo);
    else return;
  }
}

module.exports = {get, add, remove, updateUp, updateDown};