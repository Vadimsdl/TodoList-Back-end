import React, {useState, useEffect} from 'react';
import UserList from './component/UserList';
import {convertToTree} from './helpers/helper'
import { useHttp } from './hooks/http.hook';
import './App.css'
import {BrowserRouter as Router} from 'react-router-dom'

function App() {
  const [tasks, setTasks] = useState([]);
  const [tasksTree, setTasksTree] = useState([]);
  const {request} = useHttp();

  useEffect(() => {
    request('/', 'POST')
    .then(tasks => setTasks(tasks));
  }, [request]);

  useEffect(() => {
    setTasksTree(() => convertToTree(tasks));
  }, [tasks]);

  const setItems = async ({parentId = null, title, index}) => {
    const obj = {
      index: index,
      title: title,
      parentId: parentId,
    };
    await request('/add', 'POST', obj);
    request('/', 'POST')
    .then(tasks => setTasks(tasks));
  }

  const deleteSublist = async (id) => {
    await request('/remove', 'POST',{ parentId: id});
    await request('/', 'POST')
    .then(tasks => setTasks(tasks));
  }

  const deleteTask = async (id, parentId) => {
    await request('/remove', 'POST',{ _id: id, parentId: parentId});
    await request('/', 'POST')
    .then(tasks => setTasks(tasks));
  }

  const setUp = async (id, parentId) => {
    const clone = [...tasks];
    const task = clone.find(task => task._id === id);

    if(task.index !== 0) {
      await request('/update/up', 'POST', {_id: id, parentId});
      await request('/', 'POST')
      .then(tasks => setTasks(tasks));
    }
  }

  const setDown = async (id, parentId) => {
    const clone = [...tasks];
    const task = clone.find(task => task._id === id);
    const tasksParent = clone.filter(task => task.parentId === parentId);

    if(tasksParent.length-1 !== task.index) {
      await request('/update/down', 'POST', {_id: id, parentId});
      await request('/', 'POST')
      .then(tasks => setTasks(tasks));
    }
  }

  return (
    <div className="App">
      <Router>
        <UserList 
        tasks={tasksTree}
        addListElem={setItems}
        deleteSublist={deleteSublist}
        removeTask={deleteTask}
        setUp={setUp}
        setDown={setDown}
        />
      </Router>
    </div>
  );
}

export default App;
