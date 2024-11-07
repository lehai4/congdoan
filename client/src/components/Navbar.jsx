import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Popover, Space } from "antd";
import React from "react";

function Navbar({ onToggleSidebar, isSidebarCollapsed, handlerLogOut, user }) {
  const { role } = user;

  return (
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
      <Popover
        trigger="click"
        placement="bottomLeft"
        content={
          <Space>
            <Button onClick={handlerLogOut}>
              <LogoutOutlined />
              Đăng xuất
            </Button>
          </Space>
        }
      >
        <Button icon={<UserOutlined />} className="font-bold uppercase">
          {role}
        </Button>
      </Popover>
    </div>
  );
}

export default Navbar;
