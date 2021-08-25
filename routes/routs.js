const {Router} = require('express');
const router = Router();
const Todo = require('../modules/todo');

router.post('/', async (req, res) => {
  try {
    const result = await Todo.find();
    res.status(200).send(result);
  } catch {}

});

router.post('/add', async (req, res) => {
  try {
    const {index, title, id, parentId} = req.body;
    const candidate = await Todo.findOne({id});

    if(candidate) {
      return res.status(400).json({message: 'Такой id есть'});
    }

    const todo = new Todo({index, title, id, parentId});
    
    await todo.save();

    res.status(200).json({message: 'Have fun!'});

  } catch (e){
    res.status(500).json({message: `Something wrong ${e.message}`});
  }


});

router.post('/remove', async (req, res) => {
  try{
    const {index, title, id, parentId} = req.body;
    if (!!id) await removeTask(id, parentId)
    else await removeSublist(parentId)
   
    res.status(200).json({message: 'Have fun!'});

  } catch (e){
    res.status(500).json({message: `Something wrong ${e.message}`});
  }


});

async function removeTask(id, parentId) {
  let tasks = await Todo.find();
  for (let i = 0; i < tasks.length; i++) {
    const task = await Todo.findOne({parentId: id}) 
    if(!!task) {
      await Todo.deleteOne({parentId: id});
      removeTask(task.id);
    } else {
      await Todo.deleteOne({id: id});
    }
  }
  tasks = await Todo.find();

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].parentId === parentId) {
      await Todo.updateOne({id: tasks[i].id}, {index: i });
    }
  }
  return
}

async function removeSublist(id) {
  const tasks = await Todo.find();
  
  for (let i = 0; i < tasks.length; i++) {
    const task = await Todo.findOne({parentId: id})
    await Todo.deleteOne({parentId: id});

    if(!!task)
      await removeSublist(task.id);
    else return;
  }
    
}

router.post('/update/up', async (req, res) => {
  try{
    const {index, title, id, parentId} = req.body;
    const taskMove = await Todo.findOne({id});
    const tasks = await Todo.find({parentId});
    const taskIndex = tasks.findIndex(task => task.index === (taskMove.index-1) && task.parentId === parentId);
    const task = tasks.find(task => task.index === (taskMove.index-1) && task.parentId === parentId);
    await Todo.updateOne({id: taskMove.id}, {index: taskIndex});
    await Todo.updateOne({id: task.id}, {index: taskMove.index});

    res.status(200).json({message: 'Have fun!'});

  } catch (e){
    res.status(500).json({message: `Something wrong ${e.message}`});
  }


});

router.post('/update/down', async (req, res) => {
  try{
    const {index, title, id, parentId} = req.body;
    const taskMove = await Todo.findOne({id});
    const tasks = await Todo.find({parentId});
    const taskIndex = tasks.findIndex(task => task.index === (taskMove.index+1) && task.parentId === parentId);
    const task = tasks.find(task => task.index === (taskMove.index+1) && task.parentId === parentId);
    await Todo.updateOne({id: taskMove.id}, {index: taskIndex});
    await Todo.updateOne({id: task.id}, {index: taskMove.index});

    res.status(200).json({message: 'Have fun!'});

  } catch (e){
    res.status(500).json({message: `Something wrong ${e.message}`});
  }


});

module.exports = router;