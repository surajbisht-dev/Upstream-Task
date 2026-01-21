import { useEffect, useMemo, useState } from "react";
import { api } from "../api";

import SectionTitle from "../components/SectionTitle";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import ErrorBox from "../components/ErrorBox";
import Loader from "../components/Loader";
import Table from "../components/Table";

const statusOptions = ["Not Started", "In Progress", "Blocked", "Done"];

export default function TasksPage() {
  const [tasksData, setTasksData] = useState(null); // { tasks, blockedInfo, cycleInfo }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // form fields
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [dueDate, setDueDate] = useState("");
  const [depIds, setDepIds] = useState([]);

  const [saving, setSaving] = useState(false);

  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/tasks");
      setTasksData(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const tasks = tasksData?.tasks || [];
  const blockedInfo = tasksData?.blockedInfo || [];
  const cycleInfo = tasksData?.cycleInfo || { hasCycle: false };

  const blockedMap = useMemo(() => {
    const map = new Map();
    blockedInfo.forEach((b) => map.set(b.taskId, b));
    return map;
  }, [blockedInfo]);

  const grouped = useMemo(() => {
    const blocked = [];
    const active = [];
    const done = [];

    tasks.forEach((t) => {
      if (t.status === "Done") return done.push(t);

      const info = blockedMap.get(t._id);
      if (info?.isBlocked) blocked.push(t);
      else active.push(t);
    });

    return { blocked, active, done };
  }, [tasks, blockedMap]);

  const onToggleDep = (id) => {
    setDepIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  const resetForm = () => {
    setTitle("");
    setStatus("Not Started");
    setDueDate("");
    setDepIds([]);
    setEditId(null);
  };

  const onCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");

    try {
      setSaving(true);
      setError("");

      const payload = {
        title,
        status,
        dueDate: dueDate ? dueDate : null,
        dependencies: depIds,
      };

      if (editId) {
        await api.put(`/tasks/${editId}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      resetForm();
      await fetchTasks();
    } catch (e2) {
      setError(e2?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (e) {
      setError(e?.response?.data?.message || "Delete failed");
    }
  };

  const onEdit = (task) => {
    setError("");
    setEditId(task._id);
    setTitle(task.title || "");
    setStatus(task.status || "Not Started");

    if (task.dueDate) {
      const d = new Date(task.dueDate);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      setDueDate(`${yyyy}-${mm}-${dd}`);
    } else {
      setDueDate("");
    }

    setDepIds(task.dependencies || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const columns = [
    { key: "title", header: "Title" },
    { key: "status", header: "Status" },
    {
      key: "dueDate",
      header: "Due Date",
      render: (r) =>
        r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "-",
    },
    {
      key: "deps",
      header: "Dependencies",
      render: (r) => (r.dependencies?.length ? r.dependencies.length : 0),
    },
    {
      key: "blocked",
      header: "Blocked?",
      render: (r) => {
        const info = blockedMap.get(r._id);
        if (!info) return "-";
        return info.isBlocked ? `Yes (${info.unresolvedDeps})` : "No";
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" type="button" onClick={() => onEdit(r)}>
            Edit
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={() => onDelete(r._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Tasks"
        subtitle="Create and edit tasks, set dependencies, and see blocked/unblocked groups."
      />

      <ErrorBox message={error} />

      {cycleInfo?.hasCycle && (
        <div className="p-3 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded text-sm">
          ⚠ Cycle detected in dependencies. App will still work, but blocked
          logic may be unreliable.
        </div>
      )}

      <Card title={editId ? "Edit Task" : "Create Task"}>
        <form onSubmit={onCreateOrUpdate} className="grid gap-3 md:grid-cols-2">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="md:col-span-2">
            <div className="text-sm mb-2 font-semibold">Dependencies</div>

            <div className="grid gap-2 md:grid-cols-2">
              {tasks.length === 0 ? (
                <div className="text-sm text-gray-600">No tasks yet</div>
              ) : (
                tasks
                  .filter((t) => t._id !== editId) // prevent self dependency when editing
                  .map((t) => (
                    <label
                      key={t._id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={depIds.includes(t._id)}
                        onChange={() => onToggleDep(t._id)}
                      />
                      {t.title}
                    </label>
                  ))
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex gap-2 flex-wrap">
            <Button disabled={saving} type="submit">
              {saving ? "Saving..." : editId ? "Update" : "Create"}
            </Button>

            {editId && (
              <Button variant="ghost" type="button" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}

            <Button variant="secondary" type="button" onClick={fetchTasks}>
              Refresh
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Blocked Tasks">
        {loading ? (
          <Loader />
        ) : (
          <Table
            columns={columns}
            rows={grouped.blocked}
            rowKey={(r) => r._id}
          />
        )}
      </Card>

      <Card title="Active Tasks">
        {loading ? (
          <Loader />
        ) : (
          <Table
            columns={columns}
            rows={grouped.active}
            rowKey={(r) => r._id}
          />
        )}
      </Card>

      <Card title="Done Tasks">
        {loading ? (
          <Loader />
        ) : (
          <Table columns={columns} rows={grouped.done} rowKey={(r) => r._id} />
        )}
      </Card>
    </div>
  );
}
