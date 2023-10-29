import { IconBell, IconMail } from "@tabler/icons-react";
import { DropdownComponent } from "../../UI/dropdown/Dropdown";
import styling from "./Notifications.module.css";
import { Badge } from "antd";
import { useState } from "react";
import UnderConstruction from "../underConstruction/UnderConstruction";

const userData: any = {
  company: [
    {
      key: "1",
      title: "Your engineering job has 10 new matches",
      subtitle:
        "Check the new matches on your dashboard and send a request for the candidate packages!",
    },
    {
      key: "2",
      title: "You have received a candidate package from MR",
      subtitle:
        "Go to your dashboard and review the full information package from this candidate!",
    },
    {
      key: "3",
      title: "Power Coders has invited new candidates",
      subtitle:
        "Find all the fresh talent on the candidate pages and discover if they match to your jobs!",
    },
  ],
  candidate: [
    {
      key: "1",
      title:
        "Women++ has accepted your participation request for their initiative",
      subtitle:
        "Check out your new tag on your profile and add the certificate for this project if you haven't yet!",
    },
    {
      key: "2",
      title: "The Dream Company is asking for your package",
      subtitle:
        "Rush rush! Someone is interested in your details! Go to your dashboard to send over the information.",
    },
    {
      key: "3",
      title: "Your data hasn't been updated since 3 months",
      subtitle:
        "Make sure your data is fresh and up to date so recruiters know what to expect when they contact you!",
    },
  ],
  admin: [
    {
      key: "1",
      title: "New admin notification",
      subtitle:
        "Welcome to the admin panel! You have the power to manage the platform's settings.",
    },
    {
      key: "2",
      title: "System update in progress",
      subtitle:
        "We are currently performing system maintenance. Expect some downtime.",
    },
  ],
  association: [
    {
      key: "1",
      title: "Association update",
      subtitle:
        "Important update from the Association. Please read for the latest news and events.",
    },
    {
      key: "2",
      title: "Join the annual conference",
      subtitle:
        "Don't miss the opportunity to join our annual conference. Register now!",
    },
  ],
};

const Notifications = () => {
  const [isUnderConstruction, setIsUnderConstruction] =
    useState<boolean>(false);

  const hanldeConstructionModal = () => {
    setIsUnderConstruction(!isUnderConstruction);
  };
  const userType = localStorage.getItem("user_type");
  if (userType) {
    const items = userData[userType].map((data: any) => ({
      key: data.key,
      label: (
        <div className={styling.container}>
          <div onClick={hanldeConstructionModal}>
            <h3 className={styling.title}>{data.title}</h3>
            <p className={styling.subtitle}>{data.subtitle}</p>
          </div>
          <IconMail size={40} />
        </div>
      ),
    }));

    return (
      <Badge color={"orange"} size="small" count={items.length}>
        <DropdownComponent
          icon={<IconBell style={{ cursor: "pointer" }} />}
          items={items || []}
          width={400}
          trigger={["click"]}
          placement="bottomRight"
        />
        <UnderConstruction
          isOpen={isUnderConstruction}
          onClose={hanldeConstructionModal}
          subtitle="Notifications coming soon!"
        />
      </Badge>
    );
  }
  return null;
};

export default Notifications;
