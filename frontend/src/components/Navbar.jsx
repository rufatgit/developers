import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import NotificationBell from "./NotificationBell";
import "./Navbar.css";

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          DevCollab
        </Link>

        {token && (
          <nav className="navbar__links">
            <Link to="/projects">Projects</Link>
          </nav>
        )}

        <div className="navbar__actions">
          {token ? (
            <>
              <NotificationBell />
              <Link
                to={`/profile/${user?.id}`}
                className="navbar__avatar"
                title={user?.full_name}
              >
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "?"}
              </Link>
              <button className="navbar__logout" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register" className="navbar__cta">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
