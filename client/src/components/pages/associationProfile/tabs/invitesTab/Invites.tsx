import {
  Association,
  Invite,
  InvitesComponentProps,
  Payload,
} from "../../../../../types/types";
import { CardContainer } from "../../../../UI/container/CardContainer";
import { Button } from "../../../../UI/button/Button";
import Table from "../../../../UI/table/Table";
import styling from "./Invites.module.css";
import SendInviteModal from "../../../../shared/sendInvite/SendInviteModal";
import { useState } from "react";
import { message } from "antd";
import { sendInvite } from "../../../../../api/invite";
import { updateAssociationById } from "../../../../../api/associations";
import { getAllUsers } from "../../../../../api/user";

const InvitesComponent: React.FC<InvitesComponentProps> = ({
  association,
  callback,
}) => {
  //State
  const [isSendInviteOpen, setSendInviteOpen] = useState(false);
  const [defaultOption, setDefaultOption] = useState("");

  /**
   * Sends the invite to the backend
   * @param payload - The payload to be sent to the backend
   */
  const handleSendInvite = async (payload: Payload) => {
    const payloadInvite = {
      user_type: payload.user_type,
      recipient_email: payload.recipient_email,
      association_name: association.association_name,
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

    if (!association.invites) {
      association.invites = [];
    }

    // Send invite
    const isInviteSent = await sendInvite(payloadInvite);

    const payloadInvites = {
      name: payload.name,
      email: payload.recipient_email,
      user_type: payload.user_type,
      createdAt: new Date(),
    };
    // Update association invites array
    await updateAssociationById(association?.user_id, {
      invites: [...association.invites, payloadInvites],
    });

    setSendInviteOpen(false);

    callback?.();

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

  const today = new Date();

  const inviteCandidateData: Invite[] = (association?.invites || [])
    .filter((invite: any) => invite.user_type === "candidate")
    .map((invite: any, index: number) => {
      const inviteDate = new Date(invite?.createdAt);
      const timeDifference = today.getTime() - inviteDate.getTime();

      const expiresInDays = Math.floor(
        7 - timeDifference / (1000 * 60 * 60 * 24)
      );
      console.log(`${invite?.createdAt}`, expiresInDays);

      return {
        key: index,
        name: invite.name,
        email: invite.email,
        user_type: invite.user_type,
        expiresIn: expiresInDays < 7 ? `${expiresInDays} days` : "Expired",
      };
    });

  const inviteCompanyData: Invite[] = (association?.invites || [])
    .filter((invite: any) => invite.user_type === "company")
    .map((invite: any, index: number) => {
      const inviteDate = new Date(invite?.createdAt);
      const timeDifference = today.getTime() - inviteDate.getTime();

      const expiresInDays = Math.floor(
        7 - timeDifference / (1000 * 60 * 60 * 24)
      );
      console.log(expiresInDays);

      return {
        key: index,
        name: invite.name,
        email: invite.email,
        user_type: invite.user_type,
        expiresIn: expiresInDays < 7 ? `${expiresInDays} days` : "Expired",
      };
    });

  const headerInvited = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "User",
      dataIndex: "user_type",
      key: "user_type",
    },
    {
      title: "Expires in",
      dataIndex: "expiresIn",
      key: "expiresIn",
    },
  ];

  return (
    <CardContainer className={styling.invitesTab}>
      <div className={styling.invites}>
        <div className={styling.inviteHeader}>
          <h1 className={styling.titleTables}>Candidates invited</h1>
          <Button
            className={styling.button}
            onClick={() => {
              handleOpenInvite("Candidate");
            }}
          >
            Invite
          </Button>
        </div>

        <Table columns={headerInvited} data={inviteCandidateData} />
      </div>

      <div className={styling.invites}>
        <div className={styling.inviteHeader}>
          <h1 className={styling.titleTables}>Companies invited</h1>
          <Button
            className={styling.button}
            onClick={() => {
              handleOpenInvite("Company");
            }}
          >
            Invite
          </Button>
          <SendInviteModal
            isOpen={isSendInviteOpen}
            defaultOption={defaultOption}
            onClose={() => setSendInviteOpen(false)}
            handleSend={handleSendInvite}
          />
        </div>

        <Table columns={headerInvited} data={inviteCompanyData} />
      </div>
    </CardContainer>
  );
};

export default InvitesComponent;
