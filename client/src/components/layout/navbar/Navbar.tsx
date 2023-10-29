import React, { useEffect, useState } from "react";
import { Layout, Input } from "antd";
import { useNavigate } from "react-router-dom";

import Avatar from "../../UI/avatar/Avatar";

import logo from "../../../media/bridge-logo.png";

import "./Navbar.css";
import { getCompanyById } from "../../../api/companies";
import { getAssociationById } from "../../../api/associations";
import { getCandidateById } from "../../../api/candidates";
import Notifications from "../../shared/notifications/Notifications";
import UnderConstruction from "../../shared/underConstruction/UnderConstruction";

const Navbar = () => {
  const navigate = useNavigate();
  const { Search } = Input;

  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const userType = auth.user.user_type;

  const [avatarComponent, setAvatarComponent] = useState<React.ReactNode>();
  const [isUnderConstruction, setIsUnderConstruction] =
    useState<boolean>(false);

  const loadAvatar = async () => {
    if (userType === "company") {
      const company = await getCompanyById(auth?.user?.id);
      setAvatarComponent(
        <Avatar
          firstName={company?.company_name}
          lastName=""
          size="large"
          handleProfileClick={handleProfileClick}
        />
      );
    } else if (userType === "candidate") {
      const candidate = await getCandidateById(auth?.user?.id);
      setAvatarComponent(
        <Avatar
          firstName={candidate?.first_name}
          lastName={candidate?.last_name}
          size="large"
          handleProfileClick={handleProfileClick}
        />
      );
    } else if (userType === "association") {
      const association = await getAssociationById(auth?.user?.id);
      setAvatarComponent(
        <Avatar
          firstName={association?.association_name}
          lastName=""
          size="large"
          handleProfileClick={handleProfileClick}
        />
      );
    } else if (userType === "admin") {
      setAvatarComponent(
        <Avatar
          firstName="Admin"
          lastName=""
          size="large"
          handleProfileClick={handleProfileClick}
        />
      );
    } else {
      setAvatarComponent(
        <Avatar
          firstName=""
          lastName=""
          size="large"
          handleProfileClick={handleProfileClick}
        />
      );
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  const handleProfileClick = () => {
    const user = JSON.parse(localStorage.getItem("auth") || "{}")?.user;
    if (user?.user_type === "company") navigate(`/company-profile/${user?.id}`);
    else if (user?.user_type === "candidate")
      navigate(`/candidate-profile/${user?.id}`);
    else if (user?.user_type === "association")
      navigate(`/association-profile/${user?.id}`);
  };

  const hanldeConstructionModal = () => {
    setIsUnderConstruction(!isUnderConstruction);
  };

  return (
    <nav className="navbar">
      <Layout>
        <Layout.Header className="nav-header">
          <div className="navbar-menu">
            <img
              className=""
              alt="logo"
              style={{ width: 180, height: 60 }}
              src={String(logo)}
            />
            <div className="leftMenu">
              <Search
                placeholder="Enter a job title, name o keyword"
                style={{ position: "relative", width: 400 }}
                onClick={hanldeConstructionModal}
              />
            </div>

            <UnderConstruction
              isOpen={isUnderConstruction}
              onClose={hanldeConstructionModal}
              subtitle="Global search coming soon!"
            />

            <div className="rightMenu">
              <Notifications />
              
              {avatarComponent}
            </div>
          </div>
        </Layout.Header>
      </Layout>
    </nav>
  );
};

export default Navbar;
