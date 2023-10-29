import { ProgressBar } from "../../../../UI/progressbar/ProgressBar";
import ProfileCompletedFields from "./ProfileCompletedFields";
import { CardContainer } from "../../../../UI/container/CardContainer";
import styling from "./ProfileComplete.module.css";
import {
  countNullFieldsByCategory,
  percentage,
  allCategories,
} from "../../../helpers/helper";
import { Candidate } from "../../../../../types/types";
import { useEffect, useState } from "react";

interface ProfileCompletedProps {
  candidate: Candidate;
  className?: string;
  setCountNullCategories: (arg: Record<string, number>) => void;
  getProgress?: (arg: number) => void;
  editContactInfo?: () => void;
  editLanguages?: () => void;
  editSkills?: () => void;
  editValues?: () => void;
  editProfile?: () => void;
  editExperience?: () => void;
  editTypeOfJobs?: () => void;
  editDocuments?: () => void;
  editVisibleInformation?: () => void;
  editJobSearchPref?: () => void;
  hidden?: boolean;
}

const ProfileComplete: React.FC<ProfileCompletedProps> = ({
  candidate,
  className,
  setCountNullCategories,
  getProgress,
  editContactInfo,
  editLanguages,
  editSkills,
  editValues,
  editProfile,
  editExperience,
  editTypeOfJobs,
  editDocuments,
  editVisibleInformation,
  editJobSearchPref,
  hidden,
}) => {
  // state
  const [fieldsByCategory, setFieldsByCategory] = useState(
    {} as { [key: string]: number }
  );
  const [categories, setCategories] = useState([] as string[]);
  const [progress, setProgress] = useState(0);

  const fetchData = () => {
    const countFields = countNullFieldsByCategory(candidate, allCategories);
    setFieldsByCategory(countFields);
    setCountNullCategories && setCountNullCategories(countFields);
    setCategories(allCategories);
    const countProgress = percentage({
      completedCategories: Object.values(countFields).filter(
        (fraction) => fraction > 0
      ).length,
      totalCategories: allCategories.length,
    });

    getProgress && getProgress(countProgress);
    setProgress(countProgress);
  };

  useEffect(() => {
    fetchData();
  }, [candidate, allCategories]);

  const handleAddClick = (category: string) => {
    switch (category) {
      case "Contact info":
        if (editContactInfo) {
          editContactInfo();
        }
        break;
      case "Languages":
        if (editLanguages) {
          editLanguages();
        }
        break;
      case "Skills":
        if (editSkills) {
          editSkills();
        }
        break;
      case "Values":
        if (editValues) {
          editValues();
        }
        break;
      case "Profile":
        if (editProfile) {
          editProfile();
        }
        break;
      case "Experience":
        if (editExperience) {
          editExperience();
        }
        break;
      case "Type of jobs":
        if (editTypeOfJobs) {
          editTypeOfJobs();
        }
        break;
      case "Documents":
        if (editDocuments) {
          editDocuments();
        }
        break;
      case "Visible Information":
        if (editVisibleInformation) {
          editVisibleInformation();
        }
        break;
      case "Job Preferences":
        if (editJobSearchPref) {
          editJobSearchPref();
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      {!hidden && (
        <CardContainer className={`${className}`}>
          <div className={styling.profileCompletedEditIcon}>
            <h3>Your profile is {progress}% complete.</h3>
            {/* <IconEdit color="black" style={{ cursor: "pointer" }} /> */}
          </div>
          <ProgressBar progress={progress} />
          <div className={styling.profileCompletedFields}>
            {
              /* Display fields by category */

              categories?.map((category) => (
                <div
                  key={category}
                  className={styling.profileCompletedCategory}
                >
                  {/* <h4>{category}</h4> */}
                  <ProfileCompletedFields
                    key={category}
                    isCompleted={fieldsByCategory[category] > 0 ? true : false}
                    category={category}
                    onAddClick={
                      fieldsByCategory[category] > 0
                        ? undefined
                        : () => handleAddClick(category)
                    }
                  />
                </div>
              ))
            }
          </div>
        </CardContainer>
      )}
    </>
  );
};

export { ProfileComplete };
