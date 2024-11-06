import { Menu } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [getItem("Quản lý", "/"), getItem("Thư viện", "/library")];
const Menubar = () => {
  const pathname = useLocation();
  const navigate = useNavigate();
  return (
    <Menu
      mode="inline"
      theme="dark"
      defaultSelectedKeys={[`${pathname.pathname}`]}
      items={items}
      onClick={(e) => {
        navigate(`${e.key}`);
      }}
      style={{
        border: "none",
        fontSize: "16px",
      }}
    />
  );
};

export default Menubar;
