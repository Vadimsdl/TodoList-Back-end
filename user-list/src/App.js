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
    request('/api/routs/', 'POST')
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
    request('/api/routs/add', 'POST', obj);
  }

  const deleteSublist = (id) => {
    setTasks(tasks => removeSublist({tasks, id}));
  }

  const removeSublist = ({tasks, id}) => {
    for (let i = 0; i < tasks.length; i++) {
    
      if (tasks[i].parentId === id) {
        removeSublist({tasks: tasks, id: tasks[i].id});
        const obj = tasks.splice(i, 1);
        request('/api/routs/remove', 'POST', obj[0]);
        i--;
      }
    }
   
    return [...tasks];
  }

  const deleteTask = (id, parentId) => {
    setTasks(tasks => removeTask({tasks, id, parentId}));

  }

  const removeTask = ({tasks, id, parentId}) => {
    for (let i = 0; i < tasks.length; i++) {
     
      if (tasks[i].parentId === id) {
        removeTask({tasks: tasks, id: tasks[i].id});
        const obj = tasks.splice(i, 1);
        request('/api/routs/remove', 'POST', obj[0]);
        i--;
      } else if (tasks[i].id === id) {
        const obj = tasks.splice(i, 1);
        request('/api/routs/remove', 'POST', obj[0]);
        i--;
      }
    }
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].parentId === parentId) {
        tasks[i].index = i;
        request('/api/routs/update', 'POST', tasks[i]);
      }
    }
    console.log(tasks)
    return [...tasks];
  }

  const setUp = (id, parentId) => {
    const cloneTasks = [...tasks];
    console.log(tasks);
    for(let i = 0 ; i < cloneTasks.length ; i++) 
    {
      cloneTasks[i] = {...cloneTasks[i]}

      if (cloneTasks[i].id === id) {
        try { 
          const taskMove = cloneTasks[i].index;
          const taskIndex = cloneTasks.findIndex(task => task.index === (taskMove-1) && task.parentId === parentId);
          const task = cloneTasks.find(task => task.index === (taskMove-1) && task.parentId === parentId);
          cloneTasks[i].index = task.index;
          cloneTasks[taskIndex].index = taskMove;
          request('/api/routs/update', 'POST', cloneTasks[i]);
          request('/api/routs/update', 'POST', cloneTasks[taskIndex]);
        } catch {}
      }
    }
    console.log(cloneTasks);
    setTasks([...cloneTasks]);
  }

  const setDown = (id, parentId) => {
    const cloneTasks = [...tasks];
    
    for(let i = 0 ; i < cloneTasks.length ; i++) 
    {
      cloneTasks[i] = {...cloneTasks[i]}

      if (cloneTasks[i].id === id) {
        try {
          const taskMove = cloneTasks[i].index;
          let taskIndex = cloneTasks.findIndex(task => task.index === (taskMove+1) && task.parentId === parentId);
          let task = cloneTasks.find(task => task.index === (taskMove+1) && task.parentId === parentId);
          cloneTasks[i].index = task.index;
          cloneTasks[taskIndex].index = taskMove;
          request('/api/routs/update', 'POST', cloneTasks[i]);
          request('/api/routs/update', 'POST', cloneTasks[taskIndex]);
        } catch{}
      }
    }
  
    setTasks([...cloneTasks]);
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
