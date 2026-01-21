import { getUnresolvedDepCount } from "./dependencyService.js";

const daysUntil = (dueDate) => {
  if (!dueDate) return null;
  const ms = new Date(dueDate).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

export const computeRiskForTask = (task, idToTask) => {
  let score = 20;

  const unresolvedDeps = getUnresolvedDepCount(task, idToTask);
  if (unresolvedDeps > 0) score += 20;
  score += 2 * unresolvedDeps;

  if (task.status === "Blocked") score += 30;

  const d = daysUntil(task.dueDate);
  if (d !== null) {
    if (d < 3) score += 20;
    else if (d >= 3 && d <= 7) score += 10;
  }

  if (task.status === "Done") score = 0;

  if (score > 100) score = 100;
  if (score < 0) score = 0;

  const rationaleParts = [];
  if (unresolvedDeps > 0)
    rationaleParts.push(`${unresolvedDeps} unresolved dependencies`);
  if (task.status === "Blocked") rationaleParts.push("task is Blocked");
  if (d !== null && d < 3) rationaleParts.push("due very soon");
  if (d !== null && d >= 3 && d <= 7) rationaleParts.push("due within a week");
  if (task.status === "Done") rationaleParts.push("already Done");

  const rationale =
    rationaleParts.length > 0
      ? `Risk because ${rationaleParts.join(", ")}.`
      : "Low risk based on current data.";

  return { riskScore: score, rationale };
};

export const computeAllRisks = (tasks) => {
  const idToTask = new Map();
  tasks.forEach((t) => idToTask.set(String(t._id), t));

  return tasks.map((t) => {
    const { riskScore, rationale } = computeRiskForTask(t, idToTask);
    return { taskId: String(t._id), riskScore, rationale };
  });
};
