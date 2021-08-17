const {Router} = require('express');
const router = Router();
const add = require('../app');
var path = require('path');
const Todo = require('../modules/todo');

router.post('/', async (req, res) => {
  try {
    const p = await Todo.find();
    res.status(201).send(p);
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

    res.status(201).json({message: 'Have fun!'});

  } catch (e){
    res.status(500).json({message: `Something wrong ${e.message}`});
  }


});

router.post('/remove', async (req, res) => {
  try{
    const {index, title, id, parentId} = req.body;
    const candidate = await Todo.deleteOne({id});

    res.status(201).json({message: 'Have fun!'});

  } catch (e){
    res.status(500).json({message: `Something wrong ${e.message}`});
  }


});

router.post('/update', async (req, res) => {
  try{
    const {index, title, id, parentId} = req.body;
    const candidate = await Todo.updateOne({id}, {index});

    res.status(201).json({message: 'Have fun!'});

  } catch (e){
    res.status(500).json({message: `Something wrong ${e.message}`});
  }


});

module.exports = router;