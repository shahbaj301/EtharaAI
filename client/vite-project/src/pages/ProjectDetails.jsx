import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock3,
  Crown,
  Flag,
  Loader2,
  Plus,
  RefreshCcw,
  Trash2,
  UserPlus,
  Users
} from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const columns = ["To Do", "In Progress", "Done"];

const columnStyles = {
  "To Do": {
    icon: Clock3,
    header: "bg-slate-100 text-slate-700",
    marker: "bg-slate-900"
  },
  "In Progress": {
    icon: RefreshCcw,
    header: "bg-cyan-50 text-cyan-700",
    marker: "bg-cyan-600"
  },
  Done: {
    icon: CheckCircle2,
    header: "bg-emerald-50 text-emerald-700",
    marker: "bg-emerald-600"
  }
};

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [memberError, setMemberError] = useState("");
  const [taskError, setTaskError] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState("");
  const [deletingTaskId, setDeletingTaskId] = useState("");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    assignedTo: ""
  });

  const currentUserId = user?.id || user?._id;
  const isAdmin = project?.admin?._id === currentUserId;

  const fetchData = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const projectsRes = await api.get("/projects");
      const selectedProject = projectsRes.data.projects.find((p) => p._id === id);
      setProject(selectedProject || null);

      const tasksRes = await api.get(`/tasks/project/${id}`);
      setTasks(tasksRes.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load project details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, [fetchData]);

  const addMember = async (e) => {
    e.preventDefault();
    setMemberError("");

    if (!memberEmail.trim()) {
      setMemberError("Enter a member email address.");
      return;
    }

    setAddingMember(true);

    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      setMemberEmail("");
      fetchData();
    } catch (err) {
      setMemberError(err.response?.data?.message || "Failed to add member");
    } finally {
      setAddingMember(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    setTaskError("");

    if (!taskForm.title.trim()) {
      setTaskError("Task title is required.");
      return;
    }

    if (!taskForm.assignedTo) {
      setTaskError("Please assign the task to a project member.");
      return;
    }

    setCreatingTask(true);

    try {
      await api.post("/tasks", { ...taskForm, project: id });
      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        assignedTo: ""
      });
      fetchData();
    } catch (err) {
      setTaskError(err.response?.data?.message || "Failed to create task");
    } finally {
      setCreatingTask(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    setUpdatingTaskId(taskId);

    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingTaskId("");
    }
  };

  const deleteTask = async (taskId) => {
    setDeletingTaskId(taskId);

    try {
      await api.delete(`/tasks/${taskId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
    } finally {
      setDeletingTaskId("");
    }
  };

  const boardSummary = useMemo(() => {
    return columns.map((status) => ({
      status,
      count: tasks.filter((task) => task.status === status).length
    }));
  }, [tasks]);

  if (loading) {
    return <ProjectDetailsSkeleton />;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <p className="badge bg-white/10 text-cyan-100 ring-1 ring-white/10">
              <Crown size={14} />
              Project board
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
              {project?.name || "Project"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {project?.description || "Manage project members and task progress."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:min-w-[26rem]">
            {boardSummary.map((item) => (
              <HeroMetric key={item.status} label={item.status} value={item.count} />
            ))}
          </div>
        </div>
      </section>

      {error && (
        <div className="flex flex-col gap-3 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
          <button onClick={fetchData} className="btn-danger">
            <RefreshCcw size={16} />
            Retry
          </button>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="card p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                <Users size={22} />
              </div>
              <div>
                <h2 className="section-heading">Members</h2>
                <p className="muted-text">
                  {project?.members?.length || 0} teammates in this project
                </p>
              </div>
            </div>
            {isAdmin && (
              <span className="badge bg-amber-50 text-amber-700">
                <Crown size={14} />
                Admin
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {project?.members?.length ? (
              project.members.map((member) => (
                <div
                  key={member._id}
                  className="rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-cyan-700 shadow-sm">
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-900">
                        {member.name || "Member"}
                      </p>
                      <p className="truncate text-xs font-medium text-slate-500">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state sm:col-span-2 xl:col-span-1 2xl:col-span-2">
                <p className="font-black text-slate-800">No members yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Add teammates to start assigning tasks.
                </p>
              </div>
            )}
          </div>

          {isAdmin && (
            <form onSubmit={addMember} className="mt-5">
              <label>
                <span className="label">Add member by email</span>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    className="input"
                    type="email"
                    placeholder="teammate@company.com"
                    value={memberEmail}
                    disabled={addingMember}
                    onChange={(e) => setMemberEmail(e.target.value)}
                  />
                  <button className="btn-accent shrink-0" disabled={addingMember}>
                    {addingMember ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <UserPlus size={18} />
                    )}
                    Add
                  </button>
                </div>
              </label>
              {memberError && (
                <p className="mt-3 text-sm font-bold text-red-600">{memberError}</p>
              )}
            </form>
          )}
        </section>

        {isAdmin ? (
          <form onSubmit={createTask} className="card p-5 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
              <div>
                <h2 className="section-heading">Create Task</h2>
                <p className="muted-text">
                  Add context, due date, priority, and an owner.
                </p>
              </div>
              <span className="badge bg-cyan-50 text-cyan-700">
                <Plus size={14} />
                New work item
              </span>
            </div>

            {taskError && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {taskError}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="label">Task title</span>
                <input
                  className="input"
                  placeholder="Prepare API handoff"
                  value={taskForm.title}
                  disabled={creatingTask}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, title: e.target.value })
                  }
                />
              </label>

              <label>
                <span className="label">Due date</span>
                <input
                  className="input"
                  type="date"
                  value={taskForm.dueDate}
                  disabled={creatingTask}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, dueDate: e.target.value })
                  }
                />
              </label>

              <label>
                <span className="label">Priority</span>
                <select
                  className="input"
                  value={taskForm.priority}
                  disabled={creatingTask}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>

              <label>
                <span className="label">Assign to</span>
                <select
                  className="input"
                  value={taskForm.assignedTo}
                  disabled={creatingTask}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, assignedTo: e.target.value })
                  }
                >
                  <option value="">Assign to member</option>
                  {project?.members?.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="md:col-span-2">
                <span className="label">Description</span>
                <textarea
                  className="input min-h-28 resize-y"
                  placeholder="Acceptance criteria, context, or implementation notes"
                  value={taskForm.description}
                  disabled={creatingTask}
                  onChange={(e) =>
                    setTaskForm({ ...taskForm, description: e.target.value })
                  }
                />
              </label>
            </div>

            <button className="btn-primary mt-5" disabled={creatingTask}>
              {creatingTask ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create task
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="card flex items-center p-5 sm:p-6">
            <div>
              <h2 className="section-heading">Member View</h2>
              <p className="muted-text">
                You can update task status on work assigned to you. Project admins
                manage members and create new tasks.
              </p>
            </div>
          </div>
        )}
      </div>

      <section>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="section-heading">Task Board</h2>
            <p className="muted-text">
              Trello-style status columns for planning and delivery.
            </p>
          </div>
          <span className="badge bg-slate-100 text-slate-600">
            {tasks.length} total tasks
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {columns.map((status) => {
            const filteredTasks = tasks.filter((task) => task.status === status);
            const style = columnStyles[status];
            const Icon = style.icon;

            return (
              <div
                key={status}
                className="min-h-[18rem] rounded-[1.5rem] border border-slate-200 bg-slate-100/80 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className={`badge ${style.header}`}>
                    <span className={`h-2 w-2 rounded-full ${style.marker}`} />
                    <Icon size={14} />
                    {status}
                  </div>
                  <span className="badge bg-white text-slate-500 shadow-sm">
                    {filteredTasks.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {filteredTasks.length ? (
                    filteredTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        isAdmin={isAdmin}
                        isUpdating={updatingTaskId === task._id}
                        isDeleting={deletingTaskId === task._id}
                        updateStatus={updateStatus}
                        deleteTask={deleteTask}
                      />
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-slate-300 bg-white/60 p-6 text-center">
                      <p className="text-sm font-black text-slate-600">
                        No {status.toLowerCase()} tasks
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TaskCard({
  task,
  isAdmin,
  isUpdating,
  isDeleting,
  updateStatus,
  deleteTask
}) {
  const priorityStyle = {
    High: "bg-red-50 text-red-700 ring-red-100",
    Medium: "bg-amber-50 text-amber-700 ring-amber-100",
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-100"
  };

  const dueDate = formatDate(task.dueDate);
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) &&
    task.status !== "Done";

  return (
    <article className="group rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-base font-black leading-6 text-slate-950">
          {task.title}
        </h3>
        <span className={`badge shrink-0 ring-1 ${priorityStyle[task.priority] || priorityStyle.Medium}`}>
          <Flag size={13} />
          {task.priority || "Medium"}
        </span>
      </div>

      <p className="text-sm leading-6 text-slate-500">
        {task.description || "No description provided."}
      </p>

      <div className="mt-5 grid gap-2 text-xs font-bold text-slate-500">
        <div
          className={`flex items-center gap-2 rounded-2xl px-3 py-2 ${
            isOverdue ? "bg-red-50 text-red-700" : "bg-slate-50"
          }`}
        >
          <Calendar size={14} />
          <span>Due: {dueDate}</span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
          <Users size={14} />
          <span className="truncate">
            Assigned: {task.assignedTo?.name || "Unassigned"}
          </span>
        </div>
      </div>

      <label className="mt-5 block">
        <span className="label">Status</span>
        <div className="relative">
          <select
            className="input pr-10"
            value={task.status}
            disabled={isUpdating}
            onChange={(e) => updateStatus(task._id, e.target.value)}
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          {isUpdating && (
            <Loader2
              size={18}
              className="absolute right-4 top-3.5 animate-spin text-cyan-600"
            />
          )}
        </div>
      </label>

      {isAdmin && (
        <button
          onClick={() => deleteTask(task._id)}
          className="btn-danger mt-3 w-full"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
          Delete task
        </button>
      )}
    </article>
  );
}

function HeroMetric({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function ProjectDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-56 rounded-[2rem] bg-slate-900/90" />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="card p-6">
          <div className="skeleton h-12 w-12" />
          <div className="skeleton mt-5 h-6 w-40" />
          <div className="skeleton mt-5 h-16 w-full" />
          <div className="skeleton mt-3 h-16 w-full" />
        </div>
        <div className="card p-6">
          <div className="skeleton h-6 w-44" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="skeleton h-12" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
        <Loader2 size={18} className="animate-spin" />
        Loading project board
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "No due date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TM"
  );
}
