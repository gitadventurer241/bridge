import React, { useEffect } from "react";
import styling from "./CompanyCard.module.css";
import {
  IconBookmark,
  IconExternalLink,
  IconMapPin,
} from "@tabler/icons-react";
import { Labels } from "../../UI/labels/Label";
import Avatar from "../../UI/avatar/Avatar";
import { Candidate, User } from "../../../types/types";
import { updateCompanyById } from "../../../api/companies";
import { updateAssociationById } from "../../../api/associations";
import { updateCandidateById } from "../../../api/candidates";

interface CardProps {
  companyName?: string;
  user?: User;
  user_type?: string;
  candidate?: Candidate;
  logo?: string;
  header?: string;
  subheader?: string;
  associations?: string[];
  description?: string;
  skills?: object[] | undefined;
  values?: string[];
  isBookmarkVisible?: boolean;
  onClickRedirect?: () => void;
}

const CompanyCard: React.FC<CardProps> = ({
  logo,
  header,
  user,
  companyName,
  user_type,
  candidate,
  subheader,
  description,
  associations,
  skills,
  values,
  isBookmarkVisible = false,
  onClickRedirect,
}) => {
  // pass user, pass candidateID
  // state
  const [isSaved, setIsSaved] = React.useState(false);

  // functions
  const handleSaveShortlist = async () => {
    if (isBookmarkVisible) {
      // add to local storage
      setIsSaved(!isSaved);
      // if not yet saved
      if (!isSaved) {
        // Check if the job is already saved
        const isJobSaved = user?.saved_items?.includes(
          candidate?.user_id || ""
        );
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
            } else if (user_type === "candidate") {
              await updateCandidateById(user?.user_id || "", {
                saved_items: [...(user?.saved_items || []), candidate?.user_id],
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        // if already saved
        const savedItems = JSON.parse(
          localStorage.getItem("saved_items") || "[]"
        );
        // Check if the job is already saved in local storage
        const isJobSaved = savedItems.includes(candidate?.user_id);
        if (!isJobSaved) {
          return;
        }
        const filtered = savedItems.filter(
          (savedItem: string) => savedItem !== candidate?.user_id
        );
        localStorage.setItem("saved_items", JSON.stringify(filtered));
        try {
          if (user_type === "candidate") {
            await updateCandidateById(user?.user_id || "", {
              saved_items: filtered,
            });
          } else if (user_type === "company") {
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
  }, []);

  return (
    <div className={styling.candidateCard}>
      <div className={styling.cardHeader}>
        <Avatar firstName={companyName} size={50} />
        <div className={styling.headerContainer}>
          <h2 className={styling.header} onClick={onClickRedirect}>
            {header}
          </h2>
          <div className={styling.rowSubheader}>
            <IconMapPin size={20} />
            <p className={styling.subheader}>{subheader}</p>
          </div>
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

export default CompanyCard;
