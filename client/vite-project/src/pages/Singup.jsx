import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  User,
  UsersRound
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please complete all fields to create your workspace account.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await signup(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center justify-center bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                <Sparkles size={20} />
              </div>
              <div>
                <h1 className="text-xl font-black">TeamFlow</h1>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Team Task Manager
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="panel p-6 sm:p-8">
              <p className="badge bg-emerald-50 text-emerald-700">
                Start free
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Create your account
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Set up your profile and start managing team projects in minutes.
              </p>

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-7 space-y-5">
                <Field label="Full name" icon={User}>
                  <input
                    className="input pl-12"
                    placeholder="Alex Morgan"
                    value={formData.name}
                    autoComplete="name"
                    disabled={loading}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </Field>

                <Field label="Email address" icon={Mail}>
                  <input
                    className="input pl-12"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    autoComplete="email"
                    disabled={loading}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Field>

                <Field label="Password" icon={Lock}>
                  <input
                    className="input pl-12"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    autoComplete="new-password"
                    disabled={loading}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </Field>

                <button className="btn-primary w-full py-4" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating account
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

              <p className="mt-7 text-center text-sm text-slate-500">
                Already registered?{" "}
                <Link to="/login" className="font-black text-cyan-700 hover:text-cyan-800">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </section>

        <section className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-emerald-950 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
                <Sparkles size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">TeamFlow</h1>
                <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">
                  Built for delivery
                </p>
              </div>
            </div>

            <div className="mt-24 max-w-xl">
              <p className="badge bg-white/10 text-emerald-100 ring-1 ring-white/10">
                <UsersRound size={14} />
                Team-first workflow
              </p>
              <h2 className="mt-6 text-5xl font-black leading-tight tracking-tight xl:text-6xl">
                Create projects, assign owners, and track execution.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-300">
                Purpose-built presentation for a hiring assignment: clean
                dashboards, accessible forms, and responsive task boards.
              </p>
            </div>
          </div>

          <div className="relative grid gap-4 xl:grid-cols-3">
            <Feature text="Admin-managed projects" />
            <Feature text="Member assignment" />
            <Feature text="Overdue visibility" />
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <span className="relative block">
        <Icon className="absolute left-4 top-3.5 text-slate-400" size={20} />
        {children}
      </span>
    </label>
  );
}

function Feature({ text }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
      <CheckCircle2 size={19} className="text-emerald-200" />
      <p className="mt-3 text-sm font-bold text-white">{text}</p>
    </div>
  );
}
