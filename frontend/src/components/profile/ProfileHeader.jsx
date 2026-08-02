import { useAuthStore } from "../../store/authStore";
import "./ProfileHeader.css";

export default function ProfileHeader({ user }) {
  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="profile-header">
      <div className="profile-header__avatar">
        {user.full_name.charAt(0).toUpperCase()}
      </div>
      <div className="profile-header__info">
        <h1>{user.full_name}</h1>
        <p className="profile-header__email">{user.email}</p>
      </div>
      {isOwnProfile && (
        <span className="profile-header__badge">This is you</span>
      )}
    </div>
  );
}
