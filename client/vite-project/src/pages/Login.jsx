import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
            Sign in to manage projects and tasks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="panel p-6">
          <h2 className="text-xl font-bold text-slate-950">Login</h2>

          {error && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-4">
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
                placeholder="Enter password"
                value={formData.password}
                autoComplete="current-password"
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
                  Signing in
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-slate-600">
            New user?{" "}
            <Link to="/signup" className="font-semibold text-blue-700">
              Create account
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
