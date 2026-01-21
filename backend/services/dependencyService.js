export const checkCycle = (tasks) => {
  const idToTask = new Map();
  tasks.forEach((t) => idToTask.set(String(t._id), t));

  const WHITE = 0,
    GRAY = 1,
    BLACK = 2;

  const color = new Map();
  const parent = new Map();

  for (const t of tasks) color.set(String(t._id), WHITE);

  const cycle = [];

  const dfs = (nodeId) => {
    color.set(nodeId, GRAY);

    const node = idToTask.get(nodeId);
    const deps = (node?.dependencies || []).map(String);

    for (const depId of deps) {
      if (!idToTask.has(depId)) continue;
      if (color.get(depId) === WHITE) {
        parent.set(depId, nodeId);
        if (dfs(depId)) return true;
      } else if (color.get(depId) === GRAY) {
        cycle.push(depId);
        let cur = nodeId;
        while (cur && cur !== depId) {
          cycle.push(cur);
          cur = parent.get(cur);
        }
        cycle.push(depId);
        cycle.reverse();
        return true;
      }
    }

    color.set(nodeId, BLACK);
    return false;
  };

  for (const t of tasks) {
    const id = String(t._id);
    if (color.get(id) === WHITE) {
      if (dfs(id)) break;
    }
  }

  return { hasCycle: cycle.length > 0, cycle };
};

export const getUnresolvedDepCount = (task, idToTask) => {
  const deps = (task.dependencies || []).map(String);
  let unresolved = 0;

  for (const depId of deps) {
    const dep = idToTask.get(depId);
    if (!dep) continue;
    if (dep.status !== "Done") unresolved++;
  }
  return unresolved;
};

export const computeBlockedInfo = (tasks) => {
  const idToTask = new Map();
  tasks.forEach((t) => idToTask.set(String(t._id), t));

  const result = tasks.map((t) => {
    const unresolvedDeps = getUnresolvedDepCount(t, idToTask);
    const isBlockedByDeps = unresolvedDeps > 0;

    return {
      taskId: String(t._id),
      unresolvedDeps,
      isBlockedByDeps,
    };
  });

  return result;
};
