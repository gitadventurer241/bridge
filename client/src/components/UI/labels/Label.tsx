import React, { useEffect } from "react";
import styling from "./Label.module.css";
import { IconX } from "@tabler/icons-react";

interface LabelProps {
  labelName: string | number | JSX.Element;
  icon?: React.ReactNode;
  onCloseIcon?: () => void;
  disableCloseIcon?: boolean;
  customClass?: string;
  onClickHandle?: () => void;
  isSkill?: boolean;
  skillLevel?: string;
  color?: string;
}

const skillLevelInitials = {
  beginner: "b",
  intermediate: "i",
  advanced: "a",
  pro: "p",
};

const Labels: React.FC<LabelProps> = ({
  icon,
  labelName,
  onCloseIcon,
  disableCloseIcon,
  customClass = "styling.label",
  onClickHandle,
  isSkill,
  skillLevel,
  color,
}) => {
  const [skillLevelInitial, setSkillLevelInitial] = React.useState("");

  useEffect(() => {
    if (skillLevel && isSkill) {
      const initials: { [key: string]: string } = skillLevelInitials;
      setSkillLevelInitial(initials[skillLevel]);
    }
  }, [skillLevel, isSkill]);

  return (
    <div
      className={`${styling.labelContainer} ${customClass}`}
      onClick={onClickHandle}
      style={{ backgroundColor: color }}
    >
      {!isSkill ? (
        <div className={styling.labelIcon}>
          {icon} {labelName}
        </div>
      ) : (
        <div className={styling.labelIcon}>
          {icon} <strong>{labelName}</strong> {skillLevel ? "| " : ""}
          <strong>{skillLevelInitial}</strong>
        </div>
      )}

      {!disableCloseIcon && (
        <div className={styling.labelCloseIcon} onClick={onCloseIcon}>
          <IconX
            color={`var(--gray-medium)`}
            style={{ cursor: "pointer", color: "var(--gray-medium)" }}
          />
        </div>
      )}
    </div>
  );
};

export { Labels };
