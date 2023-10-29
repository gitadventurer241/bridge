import styling from "./SkillsLevelGuide.module.css";

const SkillsLevelGuide = () => {
  return (
    <div className={styling.row}>
      <p>
        <strong>b</strong> - Beginner (0-1 years)
      </p>
      <p> | </p>
      <p>
        <strong>i</strong> - Intermediate (1-3 years)
      </p>
      <p> | </p>
      <p>
        <strong>a</strong> - Advanced (3-5 years)
      </p>
      <p> | </p>
      <p>
        <strong>p</strong> - Pro (5+ years)
      </p>
    </div>
  );
};

export { SkillsLevelGuide };
