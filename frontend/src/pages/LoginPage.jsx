import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useLogin } from "../api/auth";
import "./AuthPages.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/projects";

  function handleSubmit(e) {
    e.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: () => navigate(redirectTo, { replace: true }),
      },
    );
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Log in</h1>
        <p className="auth-card__subtitle">
          Welcome back — pick up where you left off.
        </p>

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {login.isError && (
          <p className="auth-error">
            {login.error?.response?.data?.detail ||
              "Something went wrong. Try again."}
          </p>
        )}

        <button
          type="submit"
          className="auth-submit"
          disabled={login.isPending}
        >
          {login.isPending ? "Logging in…" : "Log in"}
        </button>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
