import React from "react";
import { IconExternalLink } from "@tabler/icons-react";
import { Labels } from "../../UI/labels/Label";
import Avatar from "../../UI/avatar/Avatar";
import { Association } from "../../../types/types";

import styling from "./AssociationCard.module.css";

interface CardProps {
  association?: Association;
  logo?: string;
  header?: string;
  subheader?: string;
  description?: string;
  skills?: object[] | undefined;
  values?: string[];
  avatar?: string;
  onClickRedirect?: () => void;
}

const AssociationCard: React.FC<CardProps> = ({
  association,
  logo,
  header,
  subheader,
  description,
  skills,
  values,
  avatar,
  onClickRedirect,
}) => {
  return (
    <div className={styling.candidateCard}>
      <div className={styling.cardHeader}>
        {logo ? (
          <Avatar size={50} imageSrc={logo} firstName={avatar} />
        ) : (
          <Avatar size={50} firstName={avatar} />
        )}
        <div>
          <h2 className={styling.header} onClick={onClickRedirect}>
            {association?.association_name || header}
          </h2>
          <p className={styling.subheader}>{subheader}</p>
        </div>
        <div className={styling.topRightIcon}>
          <IconExternalLink color="black" onClick={onClickRedirect} />
        </div>
      </div>

      <hr className={styling.horizontalLine} />
      {association?.iniciatives && association?.iniciatives?.length > 0 ? (
        <div className={styling.container}>
          <div className={styling.labelContainer}>
            {association?.iniciatives?.map((initiative, index) => (
              <Labels
                key={index}
                color="var(--association-label)"
                labelName={initiative?.title!}
                customClass={styling.label}
                disableCloseIcon
              />
            ))}
          </div>
        </div>
      ) : (
        <p className={styling.noInfo}>No initiatives</p>
      )}
    </div>
  );
};

export default AssociationCard;
