import React, { useEffect } from 'react';
import UserList from './UserList'

function Sublist({taskTitle, task, deleteSublist, tasks, addListElem, removeTask, setUp, setDown, getIndex, setIndex }) {

  useEffect(() => {
    setIndex(task.index+1);
  });

  const clickRemoveTask = () => {
    removeTask(task._id, task.parentId);
    setIndex(index=>index-=1);
  }

  const clickRemoveSublist =() => {
    setIndex(0);
    deleteSublist(task._id);
  }
  
  return (
    <li >
      <div className="title-block">
      <span className="title-task">{taskTitle}</span>
      </div>
      <button className={task.index === 0 ? "btn display-none" : "btn" } type="button" onClick={() => setUp(task._id, task.parentId)}>Up</button>
      <button className={task.index === tasks.length-1 ? "btn display-none" : "btn" }  type="button" onClick={() => setDown(task._id, task.parentId)}>Down</button>
      <button className="btn" type="button" onClick={() => clickRemoveTask()}>Delete</button>
      <button className="btn" type="button" onClick={() => clickRemoveSublist()}>Remove Sublist</button>
        <UserList
          addListElem={addListElem}
          tasks={task.sublist}
          id={task._id}
          taskTitle={taskTitle}
          deleteSublist={deleteSublist}
          removeTask={removeTask}
          setUp={setUp}
          getIndex={getIndex}
          setDown={setDown}
          setIndex={setIndex}
        />
    </li>
  );
}

export default Sublist;