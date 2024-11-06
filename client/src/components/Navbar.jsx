import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
function Navbar({ onToggleSidebar, isSidebarCollapsed, handlerLogOut, user }) {
  const { username, role } = user;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openProfileModal = (e) => {
    e.preventDefault();
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <div className="w-full h-full">
      <div className="h-full flex flex-row justify-between items-center mx-[16px]">
        <Button
          type="text"
          icon={
            isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
          }
          onClick={onToggleSidebar}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <Button icon={<UserOutlined />}>{role}</Button>
      </div>
    </div>
  );
}

export default Navbar;
