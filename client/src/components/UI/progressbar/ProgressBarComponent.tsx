import React from "react";
import { ProgressBar } from "./ProgressBar";
import styling from "./ProgressBarComponent.module.css";
import { Candidate } from "../../../types/types"; // Import the Candidate interface

interface ProgressBarComponentProps {
  customClass?: string;
  candidate: Candidate; // Update the prop to accept a Candidate object
}

function LanguageItem({ language }: { language: any }) {
  return (
    <div className={styling.elementInOneRow}>
      <p>{language.name}</p>
      <p>{language.level}</p>
    </div>
  );
}

const ProgressBarComponent: React.FC<ProgressBarComponentProps> = ({
  customClass,
  candidate,
}) => {
  return (
    <div className={customClass}>
      {candidate?.languages &&
        candidate?.languages?.map((language, index) => (
          <div key={index}>
            <LanguageItem language={language} />
            <ProgressBar progress={language.score} height="1.5rem" />
          </div>
        ))}
    </div>
  );
};

export { ProgressBarComponent };
