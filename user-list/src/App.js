import React, {useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
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
    request('/api/', 'POST')
    .then(tasks => setTasks(tasks));
  }, [request]);

  useEffect(() => {
    setTasksTree(() => convertToTree(tasks));
  }, [tasks]);
  
  const setItems = ({parentId = null, title, index}) => {
    const obj = {
      index: index,
      title: title,
      id: uuidv4(),
      parentId: parentId,
    };
    setTasks([...tasks, obj]);
    request('/api/add', 'POST', obj);
  }

  const deleteSublist = async (id) => {
    await request('/api/remove', 'POST',{ parentId: id});
    await request('/api/', 'POST')
    .then(tasks => setTasks(tasks));
  }

  const deleteTask = async (id, parentId) => {
    await request('/api/remove', 'POST',{ id: id, parentId: parentId});
    await request('/api/', 'POST')
    .then(tasks => setTasks(tasks));
  }

  const setUp = async (id, parentId) => {
    await request('/api/update/up', 'POST', {id, parentId});
    await request('/api/', 'POST')
    .then(tasks => setTasks(tasks));
  }

  const setDown = async (id, parentId) => {
    await request('/api/update/down', 'POST', {id, parentId});
    await request('/api/', 'POST')
    .then(tasks => setTasks(tasks));
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
