import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Col,
  Tabs,
} from "antd";
import "./MainTabs.css";
import _ from "lodash";
import BreadCrumbComp from "../breadcrumb/BreadCrumb";
import { useSelector } from "react-redux";
import circleIcon from "../../assets/image/remove_circle_outline.png"
import "../actions/CreateTask.css";

const { TabPane } = Tabs;
const dayjs = require('dayjs');
const TabsComp = ({ tabMenu, header, activeKey, showBreadCrum, setActiveKey }) => {

  const storedata = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [width, setWidth] = useState(window.innerWidth);
  const [isContentVisible, setIsContentVisible] = useState(true);

  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
  };

  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [width]);

  const TabonChange = (key) => {
    switch (key) {
      case "1": {
        return navigate("/my-application");
      }
      case "2": {
        return navigate("/fortoday");
      }
      case "3": {
        return navigate("/open");
      }
      case "4": {
        return navigate("/converted");
      }
      case "5": {
        return navigate("/failed");
      }
      case "all": {
        return setActiveKey("all");
      }
      case "active": {
        return setActiveKey("active");
      }
      case "upcoming": {
        return setActiveKey("upcoming");
      }
      case "overdue": {
        return setActiveKey("overdue");
      }
      // case "active": {
      //   return navigate("/mastercontest/active");
      // }
      case "completed": {
        return navigate("/mastercontest/completed");
      }
      case "overall": {
        return navigate("/mastercontest/overall");
      }
      case "sanctioned": {
        return setActiveKey("sanctioned");
      }
      case "inProgress": {
        return setActiveKey("inProgress");
      }
      case "disbursed": {
        return setActiveKey("disbursed");
      }
      case "rejected": {
        return setActiveKey("rejected");
      }
      case "archieved": {
        return setActiveKey("archieved");
      }
      default:
        return navigate("/Dashboard");
    }
  };

  // ... rest of the component ...

  console.log("active-key=", activeKey);
  let tabPane = [];
  if (tabMenu && !_.isEmpty(tabMenu)) {
    tabPane = _.map(tabMenu, (value) => {
      // console.log("value", value);
      return <TabPane key={value.key} tab={value.label}></TabPane>;
    });
  }

 

  const renderHeader = () => {
    if (location.pathname === "/Application-Listing/Application") {
      // Render specific header for the mentioned route
      return (

        <div className="appinfo" style={{
          width: isContentVisible ? "765px" : "48px",
          display: window.innerWidth < 1024 ? 'none' : 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: isContentVisible ? "44px" : '48px',
        }}>
          {isContentVisible && (
            <><Col className="cells">
              <div className="apptitle"> Applicant Name </div>
              <div className="appdata">{storedata?.applicantId?.fullName}</div>
            </Col><Col className="cells">
                <div className="apptitle"> Application ID </div>
                <div className="appdata">{storedata?.applicationId}</div>
              </Col><Col className="cells">
                <div className="apptitle"> Date of Application </div>
                <div className="appdata">{dayjs(storedata?.applicantId?.createdAt).format('YYYY-MM-DD')}</div>
              </Col><Col className="cells">
                <div className="apptitle"> Loan Type </div>
                <div style={{ textTransform: "uppercase" }} className="appdata">{storedata?.loanDetails?.applicationType?.value === "individual" ? storedata?.loanDetails?.applicationType?.value : storedata?.loanDetails?.loanType?.value}</div>
              </Col><Col className="cells">
                <div className="apptitle"> Current status </div>
                <div style={{ textTransform: "capitalize" }} className="appdata">{storedata?.proposalStatus == "inProgress" ? <div>In Progress</div> : storedata?.proposalStatus}</div>
              </Col></>
          )}
          <Col className="cells">
            <img src={circleIcon} style={{ cursor: 'pointer', height: '100%', width: '100%', objectFit: 'cover' }} onClick={() => toggleContentVisibility()} />
          </Col>

        </div>


      );
    }
  };


  return (
    <>
      {/* {width > breakpoint ? ( */}

      <div className="header-img mainTabsStyle d-md-block">
        <div className="">

          <div className="header-img mainTabsStyle">
            <div className="container top_container">
              <div className="">
                {showBreadCrum ? (
                  <div className="breadcrumbs">
                    <BreadCrumbComp currentPage={header} />
                  </div>
                ) : null}
                <div className="sales-Header">
                  <span>{header}</span>
                  {renderHeader()}
                </div>
                <div className="tab-section">
                  <div className="header_tabs">
                    <Tabs
                      onClick={(e) => {
                        // do not close modal if anything inside modal content is clicked
                        e.stopPropagation();
                      }}
                      // style={{ marginTop: 20 }}
                      showBreadCrum={true}
                      defaultActiveKey={activeKey}
                      onChange={TabonChange}
                      tabBarGutter={20}
                      centered={false}
                      type="card"
                      size="small"
                      activeKey={activeKey}
                      className="main-lead-tabs px-0 tab-listing"
                    >
                      {tabPane}
                    </Tabs>
                    {/* <button key={"allocket"} className="allocate_btn">
                  <div className="allocate_btn_inner">
                    <UserAddOutlined style={{ color: "#fff" }} /> Allocate To
                  </div>
                </button> */}



                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ) : ( */}

          <div
            className="tabsStyleMob d-md-none d-block mb-3"
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: -14,
            }}
          >
            {/* <div className="mb-3"> */}
            {/* <Tabs
          tabBarGutter={20}
          centered={false}
          onChange={TabonChange}
          size="small"
          activeKey={activeKey}
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 5,
          }}
        >
          {tabPane}
        </Tabs> */}
            {/* </div> */}
          </div>

        </div></div>


      {/* )} */}
    </>
  );
};

export default TabsComp;
