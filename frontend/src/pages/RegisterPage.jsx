import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../api/auth";
import { useLogin } from "../api/auth";
import "./AuthPages.css";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const register = useRegister();
  const login = useLogin();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    register.mutate(
      { full_name: fullName, email, password },
      {
        onSuccess: () => {
          // auto-login right after successful registration
          login.mutate(
            { email, password },
            { onSuccess: () => navigate("/projects", { replace: true }) },
          );
        },
      },
    );
  }

  const isPending = register.isPending || login.isPending;

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create an account</h1>
        <p className="auth-card__subtitle">
          Join the platform and start collaborating.
        </p>

        <label className="auth-field">
          <span>Full name</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>

        {register.isError && (
          <p className="auth-error">
            {register.error?.response?.data?.detail ||
              "Something went wrong. Try again."}
          </p>
        )}

        <button type="submit" className="auth-submit" disabled={isPending}>
          {isPending ? "Creating account…" : "Create account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
