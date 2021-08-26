const convertToTree = (tasks) => {
  let map = {}, node, roots = [], i;
  let tasksClone = [...tasks];
  tasksClone = tasksClone.sort((taskA, taskB) => taskA.index - taskB.index)
  
  for (i = 0; i < tasksClone.length; i++) {
    tasksClone[i] = {...tasksClone[i]}
    map[tasksClone[i]._id] = i;
    tasksClone[i].sublist = [];
  }
  
  for (i = 0; i < tasksClone.length; i++) {
    node = tasksClone[i];
    
    if (!!node.parentId) tasksClone[map[node.parentId]].sublist.push(node); 
    else roots.push(node);
  }

  return roots;
}


export {convertToTree}