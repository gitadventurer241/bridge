import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "../../UI/tabs/Tabs";
import { CardContainer } from "../../UI/container/CardContainer";
import PublicIniciativesComponent from "./tabs/iniciativesTab/Iniciatives";

import { getAssociationById } from "../../../api/associations";

import { Association } from "../../../types/types";

import styling from "./AssociationPublicProfile.module.scss";

import { IconMapPin, IconWorldWww } from "@tabler/icons-react";
import Spinner from "../../UI/spinner/Spinner";
import Avatar from "../../UI/avatar/Avatar";

const AssociationPublicProfile = () => {
  //State
  const { id } = useParams();
  const [association, setAssociation] = useState({} as Association);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  /**
   * Fetches the association data object by id
   */
  const fetchAssociation = async (userId: string) => {
    if (userId) {
      const association = await getAssociationById(userId);
      setAssociation(association);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociation(id || "");
  }, []);

  const about = (
    <CardContainer>
      <div className={styling.mainSection}>
        <h2 className={styling.titles}>About us</h2>
        <div className={styling.description}>
          <h3 className={styling.subtitles}>Description</h3>
          <p className={styling.text}>{association?.description}</p>
        </div>
      </div>
    </CardContainer>
  );

  const tabs = [
    {
      label: "About the association",
      key: "1",
      children: about,
    },
    {
      label: "Initiatives",
      key: "2",
      children: <PublicIniciativesComponent association={association} />,
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styling.main}>
      <div className={styling.container}>
        <div className={styling.header}>
          {association?.logo ? (
            <img
              className={styling.logo}
              src={association?.logo}
              alt="Avatar"
            />
          ) : (
            <Avatar firstName={association?.association_name} size={80} />
          )}

          <div>
            <h1 className={styling.headerTitle}>
              {association?.association_name}
            </h1>

            <div className={styling.subheader}>
              <IconMapPin />
              {association?.address ? (
                <p>{association?.address}</p>
              ) : (
                <p>No address</p>
              )}
              <p>|</p>
              {association?.url ? (
                <a href={association?.url} target="_blank" rel="noreferrer">
                  <IconWorldWww />
                </a>
              ) : (
                <p>No url</p>
              )}
            </div>
          </div>

          <div className={styling.icon}></div>
        </div>
      </div>

      <div className={styling.container}>
        <Tabs centered={false} items={tabs} />
      </div>
    </div>
  );
};

export default AssociationPublicProfile;
