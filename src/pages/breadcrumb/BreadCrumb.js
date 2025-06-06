import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { RightOutlined } from "@ant-design/icons";

const BreadCrumbComp = ({currentPage}) => {
  const location = useLocation();

  const BreadCrumbView = () => {
    const { pathname } = location;
    const pathnames = pathname.split("/").filter((item) => item);
    return (
      <div className="" >
        <Breadcrumb separator={<RightOutlined />}>
          {pathnames.length > 0 ? (
            <Breadcrumb.Item>
              <Link to="/dashboard">Dashboard</Link>
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          )}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join(">")}`;
            const isLast = index === pathnames.length - 1;
            return isLast ? (
              <Breadcrumb.Item key={index}>{name}</Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item key={index}>
                <Link to={routeTo}>{name}</Link>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </div>
    );
  };

  return <BreadCrumbView />;
};

export default BreadCrumbComp;
