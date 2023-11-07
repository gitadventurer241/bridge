import { useEffect, useState } from "react";
import Tabs from "../../UI/tabs/Tabs";
import { CardContainer } from "../../UI/container/CardContainer";
import InvitesComponent from "./tabs/invitesTab/Invites";
import RequestsComponent from "./tabs/requestsTab/Requests";
import IniciativesComponent from "./tabs/iniciativesTab/Iniciatives";

import {
  getAssociationById,
  updateAssociationById,
} from "../../../api/associations";

import { Association } from "../../../types/types";

import styling from "./AssociationProfile.module.scss";

import { IconEdit, IconMapPin, IconWorldWww } from "@tabler/icons-react";
import Spinner from "../../UI/spinner/Spinner";
import EditAssociationProfile from "../../shared/editAssociationProfile/EditAssociationProfile";
import Avatar from "../../UI/avatar/Avatar";

const AssociationProfile = () => {
  //State
  const [association, setAssociation] = useState({} as Association);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const handleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleModalSave = async (payload: object) => {
    try {
      const response = await updateAssociationById(
        association?.user_id,
        payload
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setEditModalOpen(false);
    fetchAssociation();
  };

  /**
   * Fetches the association data object by id
   */
  const fetchAssociation = async () => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const userId = auth?.user?.id;

    if (userId) {
      const association = await getAssociationById(userId);
      setAssociation(association);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociation();
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
      label: "Initiatives",
      key: "1",
      children: (
        <IniciativesComponent
          association={association}
          callback={fetchAssociation}
        />
      ),
    },
    {
      label: "Invites",
      key: "2",
      children: (
        <InvitesComponent
          association={association}
          callback={fetchAssociation}
        />
      ),
    },
    {
      label: "Requests",
      key: "3",
      children: <RequestsComponent association={association} />,
    },
    {
      label: "About the association",
      key: "4",
      children: about,
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styling.main}>
      <div className={styling.container}>
        <div className={styling.header}>
          {association.logo ? (
            <img
              className={styling.logo}
              src={association?.logo}
              alt="Avatar"
            />
          ) : (
            <Avatar size={80} firstName={association?.association_name} />
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
                <p>Add address</p>
              )}
              <p>|</p>
              {association?.url ? (
                <a href={association?.url} target="_blank" rel="noreferrer">
                  <IconWorldWww />
                </a>
              ) : (
                <p>Add url</p>
              )}
            </div>
          </div>

          <div className={styling.icon}>
            <IconEdit
              color="black"
              style={{ cursor: "pointer" }}
              onClick={handleEditModal}
            />
          </div>
        </div>
      </div>

      <div className={styling.container}>
        <Tabs centered={false} items={tabs} />
      </div>

      <EditAssociationProfile
        open={editModalOpen}
        onOk={handleModalSave}
        onCancel={handleEditModal}
        associationId={association?.user_id}
        associationInfo={association}
      />
    </div>
  );
};

export default AssociationProfile;
