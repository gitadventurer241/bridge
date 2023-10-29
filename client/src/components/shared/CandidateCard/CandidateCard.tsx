import React, { useEffect } from "react";
import { IconBookmark, IconExternalLink } from "@tabler/icons-react";
import { Labels } from "../../UI/labels/Label";
import Avatar from "../../UI/avatar/Avatar";
import { Candidate, User } from "../../../types/types";
import { updateCompanyById } from "../../../api/companies";
import { updateAssociationById } from "../../../api/associations";
import styling from "./CandidateCard.module.css";

interface CardProps {
  user?: User;
  user_type?: string;
  company?: any;
  candidate?: Candidate;
  logo?: string;
  header?: string;
  subheader?: string;
  associations?: string[];
  description?: string;
  skills?: object[] | undefined;
  soft_skills?: string[] | undefined;
  values?: string[];
  isBookmarkVisible?: boolean;
  onClickRedirect?: () => void;
}

const CandidateCard: React.FC<CardProps> = ({
  user,
  user_type,
  company,
  candidate,
  header,
  subheader,
  description,
  associations,
  skills,
  soft_skills,
  values,
  isBookmarkVisible = false,
  onClickRedirect,
}) => {
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSaveShortlist = async () => {
    if (isBookmarkVisible) {
      setIsSaved(!isSaved);
      if (!isSaved) {
        const isJobSaved = company?.saved_items?.includes(
          candidate?.user_id || ""
        );
        console.log(isJobSaved);
        if (isJobSaved) {
          return;
        } else {
          localStorage.setItem(
            "saved_items",
            JSON.stringify([...(user?.saved_items || []), candidate?.user_id])
          );
          try {
            if (user_type === "company") {
              await updateCompanyById(user?.user_id || "", {
                saved_items: [...(user?.saved_items || []), candidate?.user_id],
              });
            } else if (user_type === "association") {
              await updateAssociationById(user?.user_id || "", {
                saved_items: [...(user?.saved_items || []), candidate?.user_id],
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        const savedItems = JSON.parse(
          localStorage.getItem("saved_items") || "[]"
        );
        const isJobSaved = savedItems.includes(candidate?.user_id);
        if (!isJobSaved) {
          return;
        }
        const filtered = savedItems.filter(
          (savedItem: string) => savedItem !== candidate?.user_id
        );
        localStorage.setItem("saved_items", JSON.stringify(filtered));
        try {
          if (user_type === "company") {
            await updateCompanyById(user?.user_id || "", {
              saved_items: filtered,
            });
          } else if (user_type === "association") {
            await updateAssociationById(user?.user_id || "", {
              saved_items: filtered,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const renderBookmark = () => {
    if (isBookmarkVisible) {
      if (isSaved || user?.saved_items?.includes(candidate?.user_id || "")) {
        return (
          <IconBookmark
            className={styling.savedBookmark}
            onClick={handleSaveShortlist}
          />
        );
      } else {
        return <IconBookmark onClick={handleSaveShortlist} />;
      }
    }
  };

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("saved_items") || "[]");
    if (savedItems?.includes(candidate?.id)) {
      setIsSaved(true);
    }
  }, [candidate?.id]);

  return (
    <div className={styling.candidateCard}>
      <div className={styling.cardHeader}>
        <Avatar
          firstName={candidate?.first_name}
          lastName={candidate?.last_name}
          size={50}
        />
        <div>
          <h2 className={styling.header} onClick={onClickRedirect}>
            {header}
          </h2>
          <p className={styling.subheader}>{subheader}</p>
        </div>
        <div className={styling.topRightIcon}>
          {renderBookmark()}
          <IconExternalLink color="black" onClick={onClickRedirect} />
        </div>
      </div>

      {description && (
        <div className={styling.description}>
          <p>{description}</p>
        </div>
      )}

      <hr className={styling.horizontalLine} />

      <div className={styling.container}>
        <div className={styling.labelContainer}>
          {associations?.map((association, index) => (
            <Labels
              key={index}
              color="var(--association-label)"
              labelName={association}
              customClass={styling.associationLabel}
              disableCloseIcon
            />
          ))}
        </div>

        <div className={styling.labelContainer}>
          {skills?.map((skill: any, index) => (
            <Labels
              key={index}
              color="var(--skills-label)"
              labelName={skill?.skill_name}
              customClass={styling.label}
              disableCloseIcon
            />
          ))}
        </div>

        <div className={styling.labelContainer}>
          {soft_skills?.map((skill: any, index) => (
            <Labels
              key={index}
              color="var(--softSkills-label)"
              labelName={soft_skills[index] as string}
              customClass={styling.label}
              disableCloseIcon
            />
          ))}
        </div>

        <div className={styling.labelContainer}>
          {values?.map((value, index) => (
            <Labels
              key={index}
              color="var(--values-label)"
              labelName={value}
              customClass={styling.label}
              disableCloseIcon
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { CandidateCard };
