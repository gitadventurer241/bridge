import styling from "./DashboardAdmin.module.css";
import { IconExternalLink } from "@tabler/icons-react";
import { Button } from "../../UI/button/Button";
import { CardContainer } from "../../UI/container/CardContainer";
import Avatar from "../../UI/avatar/Avatar";
import Table from "../../UI/table/Table";
import { message } from "antd";
import { useEffect, useState } from "react";
import SendInviteModal from "../../shared/sendInvite/SendInviteModal";
import { sendInvite } from "../../../api/invite";
import { getAllAssociations } from "../../../api/associations";
import { getAllCandidates } from "../../../api/candidates";
import { getAllCompanies } from "../../../api/companies";
import { getAllUsers } from "../../../api/user";
import { Payload } from "../../../types/types";
import Spinner from "../../UI/spinner/Spinner";

const DashboardAdmin = () => {
  //State
  const [associations, setAssociations] = useState<any>(null);
  const [companies, setCompanies] = useState<any>(null);
  const [candidates, setCandidates] = useState<any>(null);
  const [isSendInviteOpen, setSendInviteOpen] = useState(false);
  const [defaultOption, setDefaultOption] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Sends the invite to the backend
   * @param payload - The payload to be sent to the backend
   */
  const handleSendInvite = async (payload: Payload) => {
    const payloadInvite = {
      user_type: payload.user_type,
      recipient_email: payload.recipient_email,
      association_name: "default", // TODO: Update send invite modal to allow for a payload without association
    };

    // Check if user already exists in the database
    const users = await getAllUsers();
    const user = users.find(
      (user: any) => user.email === payload.recipient_email
    );

    if (user) {
      message.error("User already exists");
      return;
    }

    // Send invite
    const isInviteSent = await sendInvite(payloadInvite);

    setSendInviteOpen(false);

    if (isInviteSent.success) {
      message.success("Invite sent");
    } else {
      message.error("Error sending invite. Please try again");
    }
  };

  /**
   * Opens the send invite modal
   * @param defaultOption - The default option to be selected
   */
  const handleOpenInvite = (defaultOption: any) => {
    setDefaultOption(defaultOption);
    setSendInviteOpen(true);
  };

  const fetchAssociation = async () => {
    const associations = await getAllAssociations();
    const candidates = await getAllCandidates();
    const companies = await getAllCompanies();

    setAssociations(associations);
    setCandidates(candidates);
    setCompanies(companies);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAssociation();
  }, []);

  const headerTable = [
    {
      title: "Associations",
      dataIndex: "associations",
      key: "associations",
    },
    {
      title: "Iniciatives",
      dataIndex: "iniciatives",
      key: "iniciatives",
    },
    {
      title: "Related companies",
      dataIndex: "relatedCompanies",
      key: "relatedCompanies",
    },
    {
      title: "Related candidates",
      dataIndex: "relatedCandidates",
      key: "relatedCandidates",
    },
  ];

  const dataTable = associations?.map((association: any) => {
    const associationName = association?.association_name;
    const iniciatives = association?.iniciatives
      ? association.iniciatives.length
      : 0;

    const relatedCompaniesCount =
      companies?.filter((company: any) =>
        company?.associations?.includes(associationName)
      ).length ?? 0;

    const relatedCandidatesCount =
      candidates?.filter((candidate: any) =>
        candidate?.associations?.includes(associationName)
      ).length ?? 0;

    return {
      associations: associationName,
      iniciatives: iniciatives,
      relatedCompanies: relatedCompaniesCount,
      relatedCandidates: relatedCandidatesCount,
    };
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styling.main}>
      {/* Profile component */}
      <CardContainer className={styling.profile}>
        <Avatar firstName="Admin" size={80} />
        <div className={styling.header}>
          <h2 className={styling.headerTitle}>Hey Admin!</h2>
        </div>
        {/* //TODO: Add "under construction pop up" */}
        <IconExternalLink color="var(--gray-dark)" />
      </CardContainer>

      <div className={styling.invites}>
        <CardContainer className={styling.inviteSection}>
          <h1 className={styling.inviteHeader}>Invite associations</h1>
          <p>
            {" "}
            Share your exclusive invitation link with associations seeking to
            connect skilled professionals with their dream jobs.
          </p>
          <Button
            className={styling.inviteButton}
            onClick={() => {
              handleOpenInvite("Association");
            }}
          >
            Invite
          </Button>
        </CardContainer>

        <CardContainer className={styling.inviteSection}>
          <h1 className={styling.inviteHeader}>Invite candidates</h1>
          <p>
            Share your unique invitation link with potential candidates and
            let's connect them with their dream jobs.
          </p>
          <Button
            className={styling.inviteButton}
            onClick={() => {
              handleOpenInvite("Candidate");
            }}
          >
            Invite
          </Button>
        </CardContainer>

        <CardContainer className={styling.inviteSection}>
          <h1 className={styling.inviteHeader}>Invite companies</h1>
          <p>
            {" "}
            Share your exclusive invitation link with organizations seeking
            skilled professionals, and let's help them find their ideal
            candidates.
          </p>
          <Button
            className={styling.inviteButton}
            onClick={() => {
              handleOpenInvite("Company");
            }}
          >
            Invite
          </Button>
        </CardContainer>
      </div>
      <SendInviteModal
        isOpen={isSendInviteOpen}
        defaultOption={defaultOption}
        onClose={() => setSendInviteOpen(false)}
        handleSend={handleSendInvite}
      />

      <div className={styling.tables}>
        <CardContainer className={styling.overview}>
          <h1 className={styling.titleTables}>
            Overview of active associations
          </h1>
          <Table columns={headerTable} data={dataTable} />
        </CardContainer>
      </div>
    </div>
  );
};

export default DashboardAdmin;
