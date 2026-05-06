import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Loader2,
  RefreshCcw,
  Users
} from "lucide-react";
import api from "../api/api";

const statusConfig = {
  "To Do": {
    color: "bg-slate-900",
    soft: "bg-slate-100 text-slate-700",
    label: "To Do"
  },
  "In Progress": {
    color: "bg-cyan-600",
    soft: "bg-cyan-50 text-cyan-700",
    label: "In Progress"
  },
  Done: {
    color: "bg-emerald-600",
    soft: "bg-emerald-50 text-emerald-700",
    label: "Done"
  }
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setError("");
    setLoading(true);

    try {
      const { data } = await api.get("/dashboard/stats");
      setStats(data.stats);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchStats);
  }, []);

  const getStatusCount = (status) => {
    return stats?.tasksByStatus?.find((item) => item._id === status)?.count || 0;
  };

  const completedTasks = getStatusCount("Done");

  const completionRate = stats?.totalTasks
    ? Math.round((completedTasks / stats.totalTasks) * 100)
    : 0;

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <section className="card p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="badge bg-slate-100 text-slate-700">
              <BarChart3 size={14} />
              Executive overview
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Monitor projects, task progress, workload distribution, and overdue
              work from one focused command center.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            <MiniMetric label="Completion" value={`${completionRate}%`} />
            <MiniMetric label="Overdue" value={stats?.overdueTasks?.length || 0} />
          </div>
        </div>
      </section>

      {error && (
        <div className="flex flex-col gap-3 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
          <button onClick={fetchStats} className="btn-danger">
            <RefreshCcw size={16} />
            Retry
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Projects"
          value={stats?.totalProjects || 0}
          icon={FolderKanban}
          accent="bg-cyan-50 text-cyan-700"
          helper="Active workspaces"
        />
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks || 0}
          icon={Clock3}
          accent="bg-slate-100 text-slate-700"
          helper="Across all projects"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon={CheckCircle2}
          accent="bg-emerald-50 text-emerald-700"
          helper={`${completionRate}% completion rate`}
        />
        <StatCard
          title="Overdue"
          value={stats?.overdueTasks?.length || 0}
          icon={AlertTriangle}
          accent="bg-amber-50 text-amber-700"
          helper="Needs attention"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="card p-5 sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="section-heading">Task Status Progress</h2>
              <p className="muted-text">A quick pulse on execution flow.</p>
            </div>
            <span className="badge bg-slate-100 text-slate-600">
              {stats?.totalTasks || 0} total
            </span>
          </div>

          {stats?.totalTasks ? (
            <div className="space-y-5">
              {Object.keys(statusConfig).map((status) => {
                const count = getStatusCount(status);
                const percent = Math.round((count / stats.totalTasks) * 100);
                const config = statusConfig[status];

                return (
                  <div key={status}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className={`badge ${config.soft}`}>{config.label}</span>
                      <span className="font-black text-slate-900">
                        {count} <span className="text-slate-400">({percent}%)</span>
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${config.color} transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No task data yet"
              text="Create tasks inside a project to see progress analytics here."
            />
          )}
        </section>

        <section className="card p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="section-heading">Tasks Per User</h2>
              <p className="muted-text">Workload distribution by teammate.</p>
            </div>
            <Users className="text-slate-300" size={24} />
          </div>

          <div className="space-y-3">
            {stats?.tasksPerUser?.length ? (
              stats.tasksPerUser.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4 transition hover:border-cyan-100 hover:bg-cyan-50/40"
                >
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-900">
                      {item.name || "Unassigned"}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {item.email || "No email available"}
                    </p>
                  </div>

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-black text-cyan-700 shadow-sm">
                    {item.count}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState
                title="No workload yet"
                text="Assigned tasks will appear here once your team starts planning."
              />
            )}
          </div>
        </section>
      </div>

      <section className="card p-5 sm:p-6">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="section-heading">Overdue Tasks</h2>
            <p className="muted-text">Items that are past due and still open.</p>
          </div>
          <span className="badge bg-amber-50 text-amber-700">
            <AlertTriangle size={14} />
            {stats?.overdueTasks?.length || 0} flagged
          </span>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {stats?.overdueTasks?.length ? (
            stats.overdueTasks.map((task) => (
              <div
                key={task._id}
                className="rounded-[1.25rem] border border-amber-200 bg-amber-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-slate-950">{task.title}</p>
                    <p className="mt-1 text-sm font-medium text-amber-700">
                      Assigned to: {task.assignedTo?.name || "Unassigned"}
                    </p>
                  </div>
                  <AlertTriangle className="shrink-0 text-amber-600" size={20} />
                </div>
              </div>
            ))
          ) : (
            <div className="lg:col-span-2">
              <EmptyState
                title="No overdue tasks"
                text="Great shape. Your team does not have any overdue work right now."
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, accent, helper }) {
  return (
    <div className="card p-5 transition hover:-translate-y-1 hover:shadow-xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-5 border-t border-slate-100 pt-4 text-xs font-bold uppercase tracking-wide text-slate-400">
        {helper}
      </p>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="empty-state">
      <p className="font-black text-slate-800">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-56 rounded-[2rem] bg-slate-900/90" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="card p-6">
            <div className="skeleton h-12 w-12" />
            <div className="skeleton mt-5 h-4 w-24" />
            <div className="skeleton mt-3 h-9 w-16" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
        <Loader2 size={18} className="animate-spin" />
        Loading dashboard analytics
      </div>
    </div>
  );
}
