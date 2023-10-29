import { CardContainer } from "../../../../UI/container/CardContainer";
import { Button } from "../../../../UI/button/Button";
import { HorizontalCard } from "../../../../UI/horizontalCard/HorizontalCard";
import { Association } from "../../../../../types/types";
import { AddInitiatives } from "./modal/AddInitiatives";
import styling from "./Iniciatives.module.css";
import { useState } from "react";
import { TimeAgo } from "../../../helpers/helper";

const IniciativesComponent = ({
  association,
  callback,
}: {
  association: Association;
  callback?: () => void;
}) => {
  const [visible, setVisible] = useState(false);

  const onClick = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <CardContainer>
      <div className={styling.mainSection}>
        <div className={styling.sectionHeader}>
          <h2 className={styling.titles}>Latest iniciatives</h2>
          <Button className={styling.button} onClick={() => setVisible(true)}>
            Add new iniciative
          </Button>
          <AddInitiatives
            visible={visible}
            setVisible={setVisible}
            callback={callback}
          />
        </div>
        {association?.iniciatives?.map((iniciative: any, index) => (
          <HorizontalCard
            key={index}
            avatar={true}
            button="Details"
            firstName={association?.association_name}
            title={iniciative?.title}
            subtitle={<TimeAgo timestamp={iniciative?.date_created} />}
            onClick={() => onClick(iniciative?.link)}
            onTitleClick={() => onClick(iniciative?.link)}
          />
        ))}
      </div>
    </CardContainer>
  );
};

export default IniciativesComponent;
