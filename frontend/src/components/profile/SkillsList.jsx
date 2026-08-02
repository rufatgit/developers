import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import {
  useUserSkills,
  useSkillCatalog,
  useAddMySkill,
  useRemoveMySkill,
} from "../../api/skills";
import "./SkillsList.css";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function SkillsList({ userId }) {
  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = currentUser?.id === userId;

  const { data: userSkills = [], isLoading } = useUserSkills(userId);

  return (
    <section className="skills-list">
      <h2>Skills</h2>

      {isLoading && <p className="skills-list__status">Loading skills…</p>}

      {!isLoading && userSkills.length === 0 && (
        <p className="skills-list__status">No skills added yet.</p>
      )}

      <div className="skills-list__tags">
        {userSkills.map((us) => (
          <SkillTag key={us.skill_id} userSkill={us} editable={isOwnProfile} />
        ))}
      </div>

      {isOwnProfile && (
        <AddSkillForm existingSkillIds={userSkills.map((us) => us.skill_id)} />
      )}
    </section>
  );
}

function SkillTag({ userSkill, editable }) {
  const removeSkill = useRemoveMySkill();

  return (
    <span className="skill-tag">
      {userSkill.skill.name}
      <span className="skill-tag__level">{userSkill.level}</span>
      {editable && (
        <button
          className="skill-tag__remove"
          onClick={() => removeSkill.mutate(userSkill.skill_id)}
          aria-label={`Remove ${userSkill.skill.name}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

function AddSkillForm({ existingSkillIds }) {
  const { data: catalog = [] } = useSkillCatalog();
  const addSkill = useAddMySkill();
  const [skillId, setSkillId] = useState("");
  const [level, setLevel] = useState(LEVELS[0]);

  const availableSkills = catalog.filter(
    (s) => !existingSkillIds.includes(s.id),
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!skillId) return;
    addSkill.mutate(
      { skill_id: Number(skillId), level },
      { onSuccess: () => setSkillId("") },
    );
  }

  return (
    <form className="add-skill-form" onSubmit={handleSubmit}>
      <select value={skillId} onChange={(e) => setSkillId(e.target.value)}>
        <option value="">Add a skill…</option>
        {availableSkills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        {LEVELS.map((lvl) => (
          <option key={lvl} value={lvl}>
            {lvl}
          </option>
        ))}
      </select>
      <button type="submit" disabled={!skillId || addSkill.isPending}>
        Add
      </button>
    </form>
  );
}
