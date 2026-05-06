import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Lock, Mail, User } from "lucide-react";
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
      setError("Please complete all fields.");
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
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-950">TeamFlow</h1>
          <p className="mt-2 text-sm text-slate-600">
            Create an account to start managing team tasks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="panel p-6">
          <h2 className="text-xl font-bold text-slate-950">Signup</h2>

          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <Field label="Name" icon={User}>
              <input
                className="input pl-10"
                placeholder="Your name"
                value={formData.name}
                autoComplete="name"
                disabled={loading}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Field>

            <Field label="Email" icon={Mail}>
              <input
                className="input pl-10"
                type="email"
                placeholder="you@example.com"
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
                className="input pl-10"
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

            <button className="btn-primary w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-700">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <span className="relative block">
        <Icon className="absolute left-3 top-3 text-slate-400" size={18} />
        {children}
      </span>
    </label>
  );
}
