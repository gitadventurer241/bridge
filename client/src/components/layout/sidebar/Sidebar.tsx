import React from "react";
import configureAxios from "../../../config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Layout as AntLayout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  IconLogout2,
  IconDashboard,
  IconDeviceLaptop,
  IconBuildingSkyscraper,
  IconBookmarks,
  IconStar,
  IconSettings,
  IconUsers,
  IconInfoCircle,
} from "@tabler/icons-react";

import "./Sidebar.css";
const axios = configureAxios();

const { Sider } = AntLayout;

interface SidebarProps {
  selectedKey: string;
  setSelectedKey: (key: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedKey,
  setSelectedKey,
  collapsed,
  setCollapsed,
}) => {
  // state
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");

  type MenuItem = Required<MenuProps>["items"][number];

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    items?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      icon,
      items,
      label,
      type,
    } as MenuItem;
  }

  // Set permissions for sidebar items
  const isCompaniesVisible = auth?.user?.user_type !== "company";
  const isTalentVisible = auth?.user?.user_type !== "candidate";
  const isShortListVisible =
    auth?.user?.user_type !== "association" &&
    auth?.user?.user_type !== "admin";
  const isFaqVisible =
    auth?.user?.user_type !== "association" &&
    auth?.user?.user_type !== "admin";

  const topItems: MenuItem[] = [
    getItem("Dashboard", "", <IconDashboard />),
    isCompaniesVisible
      ? getItem("Jobs", "jobs", <IconDeviceLaptop />)
      : getItem("My Jobs", "jobs", <IconDeviceLaptop />),
    isCompaniesVisible
      ? getItem("Companies", "companies", <IconBuildingSkyscraper />)
      : null,
    isTalentVisible ? getItem("Talent", "candidates", <IconStar />) : null,
    getItem("Associations", "associations", <IconUsers />),
    isShortListVisible
      ? getItem("Short List", "saved", <IconBookmarks />)
      : null,
    isFaqVisible ? getItem("FAQ", "faq", <IconInfoCircle />) : null,
  ];

  const bottomItems: MenuItem[] = [
    getItem("Settings", "settings", <IconSettings />),
    getItem("Logout", "logout", <IconLogout2 />),
  ];

  const handleButtonClick = async (
    button: string,
    navigate: any
  ): Promise<void> => {
    try {
      if (button === "logout") {
        try {
          // Send logout request to the backend (you'll need to replace the URL and method)
          await axios.get("/api/logout", { withCredentials: true });
          // Remove user_type, auth from local storage
          localStorage.removeItem("user_type");
          localStorage.removeItem("auth");
          // Navigate to the login page
          navigate("/login");
        } catch (error) {
          toast.error("Logout error", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } else {
        navigate(`/${button}`);
      }
    } catch (error) {
      console.error("Button Click Error:", error);
    }
  };

  return (
    <>
      <div className="toggle">
        <Sider
          style={{
            height: "100vh",
            position: "fixed",
            paddingTop: 64,
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "#fff",
          }}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          <Menu
            className="custom-menu"
            mode="inline"
            items={topItems ?? []}
            onClick={(item) => {
              setSelectedKey(item.key.toString());
              handleButtonClick(item.key.toString(), navigate);
              return item.key.toString();
            }}
            selectedKeys={[selectedKey]}
          />

          <Menu
            className="bottom-menu"
            mode="inline"
            items={bottomItems ?? []}
            onClick={(item) => {
              setSelectedKey(item.key.toString());
              handleButtonClick(item.key.toString(), navigate);
              return item.key.toString();
            }}
            selectedKeys={[selectedKey]}
          />
        </Sider>
      </div>
    </>
  );
};

export default Sidebar;
