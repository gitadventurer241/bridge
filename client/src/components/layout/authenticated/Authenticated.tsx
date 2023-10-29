import React, { useState, useEffect } from "react";
import { Layout as AntLayout, Space } from "antd";
import { ToastContainer } from "react-toastify";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const { Content } = AntLayout;

const Authenticated = ({ content }: { content: JSX.Element }) => {
  const [selectedComponent, setSelectedComponent] = useState(() => {
    const storedComponent = window.sessionStorage.getItem("selectedComponent");
    return storedComponent || "dashboard";
  });
  //  state
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [collapsed, setCollapsed] = useState(false);

  const authCheck = async () => {
    try {
      await axios
        .get("/api/check_authentication", {
          withCredentials: true,
        })
        .then((response) => {
          if (response) {
            if (response.data.authenticated) {
              setIsAuth(true);
              setIsLoading(false);
            } else {
              setIsAuth(true);
              setIsLoading(false);
            }
          } else {
            console.log("error", response);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    authCheck();
    // Save the selected component in sessionStorage
    window.sessionStorage.setItem("selectedComponent", selectedComponent);
  }, [selectedComponent]);

  const contentStyle: React.CSSProperties = {
    minHeight: 120,
    color: "black",
    backgroundColor: "var(--blue-lighter)",
    marginLeft: collapsed ? 80 : 200,
    paddingTop: 64,
    paddingRight: 40,
    paddingLeft: 40,
    overflow: "initial",
    transition: "margin-left 0.3s",
  };

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }} size={[0, 48]}>
        <AntLayout>
          <Navbar />
          <AntLayout hasSider>
            <Sidebar
              selectedKey={selectedComponent}
              setSelectedKey={setSelectedComponent}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
            <ToastContainer theme="light" />
            <Content style={contentStyle}>{content}</Content>
          </AntLayout>
          {/* <Footer style={footerStyle}>Footer</Footer> */}
        </AntLayout>
      </Space>
    </>
  );
};

export default Authenticated;
