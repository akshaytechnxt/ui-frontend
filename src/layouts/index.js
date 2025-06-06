import React, { useEffect } from "react";
import { Drawer, Layout, Menu } from "antd";
import { FileOutlined, UserOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
const { Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);

    // Return a function from the effect that removes the event listener
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [width]);
  const toggleSidebar = () => {
    setOpen(!open);
  };

  const pathsWithoutHeaderFooter = ["/"];

  // Check if the current path is in the list
  const hideHeaderFooter = pathsWithoutHeaderFooter.includes(currentPath);

  if (hideHeaderFooter) {
    return <>{children}</>;
  }
  

  return (
    <Layout className="layout" style={{minHeight:'100vh'}}>
      <Drawer
        // width={250}
        width={width > 576 ? 300 : "70%"}
        placement="left"
        closable={false}
        open={open}
        style={{ marginTop: 60 }}
        maskStyle={{ background: "none" }}
        maskClosable={true}
        onClose={() => setOpen(false)}
        bodyStyle={{ padding: "16px 0px" }}
      >
        <Sider width={"100%"}>
          <Menu mode="vertical" defaultSelectedKeys={["1"]}>
            <Menu.Item
              key="1"
              icon={<FileOutlined />}
              style={{
                borderBottom: "1px solid #ccc",
                borderRadius: 0,
              }}
            >
              Option Option Option 1
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<UserOutlined />}
              style={{
                borderBottom: "1px solid #ccc",
                borderRadius: 0,
              }}
            >
              Option 2
            </Menu.Item>
          </Menu>
        </Sider>
      </Drawer>
      <Layout>
        <Header
          callback={toggleSidebar}
          style={{ background: "#fff", padding: 0 }}
        />
        <Content id="main_container" className="layout_content_body">
          {children}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default AppLayout;
