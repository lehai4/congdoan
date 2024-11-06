import { Outlet } from "react-router-dom"; // Import Outlet from react-router-dom
import Navbar from "./Navbar";

//
import { Layout, theme } from "antd";
import React, { useState } from "react";
import envConfig from "../config";
import Menubar from "./Menu";
const { Header, Content, Sider } = Layout;

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
        `${envConfig.VITE_API_ENDPOINT}/api/auth/logout`,
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
  return (
    <Layout hasSider className="h-full">
      <Sider
        width={240}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          insetInlineStart: 0,
          scrollbarWidth: "thin",
          scrollbarGutter: "stable",
        }}
      >
        <div className="pt-[25px]">
          <h3 className="text-white px-5 mb-[45px] text-[25px]">Chức năng</h3>
          <Menubar />
        </div>
      </Sider>
      <Layout
        style={{
          marginInlineStart: 240,
        }}
      >
        <Header
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
        </Header>
        <Content
          style={{
            margin: "24px 16px 0",
            overflow: "initial",
            height: "100%",
          }}
        >
          <div
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
            className="px-[30px] py-[35px]"
          >
            <main className="content w-full h-full">
              <Outlet />
            </main>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default LayoutContent;
