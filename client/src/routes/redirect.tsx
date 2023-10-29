import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

import Register from "../components/pages/register/Register";
import DashboardCompany from "../components/pages/dashboardCompanies/DashboardCompanies";
import DashboardCandidate from "../components/pages/dashboardCandidate/DashboardCandidate";
import DashboardAssociations from "../components/pages/dashboardAssociations/DashboardAssociations";
import DashboardAdmin from "../components/pages/dashboardAdmin/DashboardAdmin";

const RegisterRoute: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const link = searchParams.get("link") || "";
  const token = searchParams.get("token") || "";
  const expires = searchParams.get("expires") || "";
  const user_type = searchParams.get("user_type") || "";
  const signature = searchParams.get("signature") || "";
  const associations = searchParams.get("associations") || "";

  // Use a state variable to manage the component's state
  const [validURL, setValidURL] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make an API call to verify the URL
    axios
      .post(
        "/api/verify_invite",
        { link: location.search, user_type: user_type },
        { withCredentials: true }
      )
      .then((response) => {
        // If the URL is valid, set the validURL state to true
        const status_code = response.data.response;
        if (status_code === 200) {
          setValidURL(true);
        }
      })
      .catch((error) => {
        console.log("error", error);
        // If the URL is not valid, set the validURL state to false
        setValidURL(false);
      })
      .finally(() => {
        // Set loading to false when the API call is complete
        setLoading(false);
      });
  }, [location.search, user_type]);

  // Render the appropriate component based on the validURL state
  if (loading) {
    return <div>Loading...</div>;
  } else if (validURL) {
    return (
      <Register
        token={token}
        expires={expires}
        user_type={user_type}
        signature={signature}
        associations={[associations]}
      />
    );
  } else {
    return <Navigate to="/not-found" state={link} />;
  }
};

const DashboardRoute: React.FC = () => {
  const userType = localStorage.getItem("user_type");
  if (userType === "candidate") {
    return <DashboardCandidate />;
  } else if (userType === "company") {
    return <DashboardCompany />;
  } else if (userType === "association") {
    return <DashboardAssociations />;
  } else if (userType === "admin") {
    return <DashboardAdmin />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export { RegisterRoute, DashboardRoute };
