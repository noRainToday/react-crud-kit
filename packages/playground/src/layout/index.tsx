import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router";

import { Button, Layout, Menu, theme } from "antd";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Crud示例",
      url: "/",
    },
    {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: "form表单示例",
      url: "form",
    },
    {
      key: "3",
      icon: <UploadOutlined />,
      label: "文件上传",
      url: "uploadFile",
    },
  ];

  const skip = (e: { key: string }) => {
    const item = menuItems.filter((i) => i.key === e.key)[0];
    if (item) {
      navigate(item.url);
    }
  };
  return (
    <Layout style={{ height: "100vh", width: "100%" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          onClick={(e) => {
            skip(e);
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
