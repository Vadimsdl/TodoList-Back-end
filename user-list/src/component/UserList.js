import React, { useState } from 'react';
import Sublist from './Sublist';

function UserList({tasks, addListElem, id = null, deleteSublist, removeTask, setUp, setDown}) {
	const [getValue, setValue] = useState('');
  const [getIndex, setIndex] = useState(0);

	const changeAddTask = (e) => { 
			setValue(e.target.value);
	}
	
	const clickAddTask = () => {

		if (getValue !== '') {
			addListElem({parentId: id, title: getValue, index: getIndex});
			setIndex(index => index += 1);
			setValue('');
		}
	}

	return (
		<ul className="items-li">
			{tasks.map((task, index) => {
				return (
						<Sublist 
						key={index}
						taskTitle={task.title}
						task={task}
						index={index}
						tasks={tasks}
						addListElem={addListElem}
						deleteSublist={deleteSublist}
						removeTask={removeTask}
						setUp={setUp}
						setDown={setDown}
						getIndex={getIndex}
						setIndex={setIndex}
						/>
					);
				}
			)}
			<li>
				<input
					type="text"
					name="task-name"
					className="task-name"
					value={getValue}
					onChange={changeAddTask}
				/>
				<button type="button" className="btn" onClick={clickAddTask} >Add</button>
			</li>
		</ul>
	);
}

export default UserList;