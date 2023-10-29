import { CardContainer } from "../../../../UI/container/CardContainer";
import { Button } from "../../../../UI/button/Button";
import { HorizontalCard } from "../../../../UI/horizontalCard/HorizontalCard";
import { Association } from "../../../../../types/types";
import styling from "./Iniciatives.module.css";
import { useState } from "react";
import { TimeAgo } from "../../../helpers/helper";
import RequestParticipation from "./modal/RequestParticipation";

const PublicIniciativesComponent = ({
  association,
}: {
  association: Association;
}) => {
  const [visible, setVisible] = useState(false);
  const user = JSON.parse(localStorage.getItem("auth") || "{}")?.user;

  const onTitleClick = (link: string) => {
    window.open(link, "_blank");
  };

  const onButtonClick = (link: string) => {
    if (user?.user_type === "association") {
      window.open(link, "_blank");
    } else {
      setVisible(true);
    }
  };

  const buttonText =
    user?.user_type === "association" ? "See more" : "Request participation";

  return (
    <CardContainer>
      <div className={styling.mainSection}>
        <div className={styling.sectionHeader}>
          <h2 className={styling.titles}>Latest iniciatives</h2>
        </div>
        {association?.iniciatives?.map((iniciative: any, index) => (
          <div key={index}>
            <HorizontalCard
              avatar={true}
              button={buttonText}
              firstName={association?.association_name}
              title={iniciative?.title}
              subtitle={<TimeAgo timestamp={iniciative?.date_created} />}
              onClick={() => onButtonClick(iniciative?.link)}
              onTitleClick={() => onTitleClick(iniciative?.link)}
            />
            {user?.user_type === "candidate" && (
              <RequestParticipation
                visible={visible}
                setVisible={setVisible}
                initiativeName={iniciative?.title}
                association={association}
              />
            )}
          </div>
        ))}
      </div>
    </CardContainer>
  );
};

export default PublicIniciativesComponent;
