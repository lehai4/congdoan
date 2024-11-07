import { Layout, theme } from "antd";
import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // Import Outlet from react-router-dom
import envConfig from "../config";
import Navbar from "./Navbar";

function LayoutContent() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prevState) => !prevState);
  };
  const user = localStorage.getItem("user");
  const userParse = JSON.parse(user);

  const handlerLogOut = async () => {
    localStorage.clear();
    window.location.href = "/login";

    try {
      const response = await axios.post(
        `${envConfig.VITE_API_ENDPOINT}/auth/logout`,
        {
          user,
        }
      );
      if (response.status === 200) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const render = () => {
    switch (userParse.role) {
      case "admin":
        return (
          <Layout className="h-full">
            <Layout>
              <header
                style={{
                  padding: 0,
                  background: colorBgContainer,
                }}
              >
                <Navbar
                  onToggleSidebar={toggleSidebar}
                  isSidebarCollapsed={isSidebarCollapsed}
                  handlerLogOut={handlerLogOut}
                  user={userParse}
                />
              </header>
              <div className="my-[24px] mx-[16px] h-full">
                <div
                  style={{
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
                  className="px-[30px] py-[25px]"
                >
                  <main className="content w-full">
                    <Outlet />
                  </main>
                </div>
              </div>
            </Layout>
          </Layout>
        );
      case "user":
        return (
          <Layout className="h-full">
            <Layout>
              <header
                style={{
                  padding: 0,
                  background: colorBgContainer,
                }}
              >
                <Navbar
                  onToggleSidebar={toggleSidebar}
                  isSidebarCollapsed={isSidebarCollapsed}
                  handlerLogOut={handlerLogOut}
                  user={userParse}
                />
              </header>
              <div className="my-[24px] mx-[16px] h-full">
                <div
                  style={{
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
                  className="px-[30px] py-[25px]"
                >
                  <main className="content w-full">
                    <Outlet />
                  </main>
                </div>
              </div>
            </Layout>
          </Layout>
        );
    }
  };
  return <>{render()}</>;
}

export default LayoutContent;
