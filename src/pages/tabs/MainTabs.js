import React from "react";
import BreadCrumbComp from "../breadcrumb/BreadCrumb";
import { Tabs } from "antd";
import _ from "lodash";
import "./MainTabs.css";

const { TabPane } = Tabs;
const MainTabs = ({ Children, title, tabMenu, activeKey, handler }) => {
  console.log("tabMenu======>>>>>>", tabMenu);
  let tabPane = [];
  if (tabMenu && !_.isEmpty(tabMenu)) {
    tabPane = _.map(tabMenu, (value, id) => {
      // console.log("value", value);
      return <TabPane key={value.id} tab={value.value}></TabPane>;
    });
  }
  return (
    <>
      <div className="header-img mainTabsStyle">
        <div className="container">
          <div className="">
            <div className="breadcrumbs">
              <BreadCrumbComp />
            </div>
            <div className="sales-Header">
              <span>{title}</span>
            </div>
          </div>
          <div className="tab-section">
            <Tabs
              tabBarGutter={20}
              centered={false}
              type="card"
              onTabClick={handler}
              size="large"
              activeKey={activeKey}
              //   style={{ marginLeft: "120px" }}
            >
              {tabPane}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainTabs;
