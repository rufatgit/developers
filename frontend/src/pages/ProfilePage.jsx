import { useParams } from "react-router-dom";
import { useUser } from "../api/users";
import ProfileHeader from "../components/profile/ProfileHeader";
import SkillsList from "../components/profile/SkillsList";
import ReviewSection from "../components/profile/ReviewSection";
import UserProjects from "../components/profile/UserProjects";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { userId } = useParams();
  const numericUserId = Number(userId);
  const { data: user, isLoading, isError } = useUser(numericUserId);

  if (isLoading)
    return <p className="profile-page__status">Loading profile…</p>;
  if (isError || !user)
    return <p className="profile-page__status">User not found.</p>;

  return (
    <div className="profile-page">
      <ProfileHeader user={user} />

      <div className="profile-page__grid">
        <div className="profile-page__main">
          <SkillsList userId={numericUserId} />
          <ReviewSection userId={numericUserId} />
        </div>
        <div className="profile-page__side">
          <UserProjects userId={numericUserId} />
        </div>
      </div>
    </div>
  );
}
