import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Crown,
  FolderPlus,
  Loader2,
  Plus,
  RefreshCcw,
  Users
} from "lucide-react";
import api from "../api/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const fetchProjects = async () => {
    setError("");
    setLoading(true);

    try {
      const { data } = await api.get("/projects");
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchProjects);
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Project name is required.");
      return;
    }

    setCreating(true);

    try {
      await api.post("/projects", formData);
      setFormData({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      setFormError(err.response?.data?.message || "Project create failed");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="badge bg-white/10 text-cyan-100 ring-1 ring-white/10">
              <FolderPlus size={14} />
              Project workspace
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
              Projects
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Create team spaces, manage members, and organize task boards
              without losing sight of ownership.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            <HeroMetric label="Projects" value={projects.length} />
            <HeroMetric
              label="Members"
              value={projects.reduce((sum, project) => sum + (project.members?.length || 0), 0)}
            />
          </div>
        </div>
      </section>

      <form onSubmit={createProject} className="card p-5 sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <h2 className="section-heading">Create Project</h2>
            <p className="muted-text">
              Start a new workspace and invite members from the project board.
            </p>
          </div>
          <span className="badge bg-emerald-50 text-emerald-700">
            Admin access included
          </span>
        </div>

        {formError && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {formError}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr_auto]">
          <label>
            <span className="label">Project name</span>
            <input
              className="input"
              placeholder="Website launch"
              value={formData.name}
              disabled={creating}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </label>

          <label>
            <span className="label">Description</span>
            <input
              className="input"
              placeholder="Short goal, client, or sprint context"
              value={formData.description}
              disabled={creating}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </label>

          <div className="flex items-end">
            <button className="btn-primary w-full lg:w-auto" disabled={creating}>
              {creating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="flex flex-col gap-3 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
          <button onClick={fetchProjects} className="btn-danger">
            <RefreshCcw size={16} />
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <ProjectGridSkeleton />
      ) : projects.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="group card relative overflow-hidden p-6 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-400 opacity-80" />

              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300 shadow-lg shadow-slate-900/10 transition group-hover:scale-105">
                  <Crown size={24} />
                </div>
                <span className="badge bg-emerald-50 text-emerald-700">
                  Active
                </span>
              </div>

              <h2 className="line-clamp-2 text-xl font-black text-slate-950">
                {project.name}
              </h2>

              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                {project.description || "No description added yet."}
              </p>

              <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 font-bold text-slate-600">
                    <Users size={16} className="text-cyan-600" />
                    {project.members?.length || 0} members
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-cyan-600"
                  />
                </div>

                <div className="rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Admin
                  </p>
                  <p className="mt-1 truncate font-black text-slate-800">
                    {project.admin?.name || "Project owner"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FolderPlus className="mx-auto text-slate-300" size={42} />
          <p className="mt-4 text-lg font-black text-slate-800">
            No projects found
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Create your first project to start adding members, assigning tasks,
            and tracking delivery from a board.
          </p>
        </div>
      )}
    </div>
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

function ProjectGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="card p-6">
          <div className="skeleton h-14 w-14" />
          <div className="skeleton mt-6 h-6 w-2/3" />
          <div className="skeleton mt-4 h-4 w-full" />
          <div className="skeleton mt-2 h-4 w-4/5" />
          <div className="skeleton mt-8 h-16 w-full" />
        </div>
      ))}
    </div>
  );
}
