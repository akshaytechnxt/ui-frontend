import React, { useState, useEffect } from "react";
import { Breadcrumb, Tabs, Row, Col, Button } from "antd";
import UploadComponent from "../loanApplication/UploadComponent";
import "../../components/Todo/ActivityCalendar.css";
import "../loanApplication/LoanApplication.css";
import axiosRequest from "../../axios-request/API.request";
import Sdloader from "../../components/Loader/FullPageLoader";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import NoRecordsFound from "../tabs/NoRecordsFound";
import mockQueriesApprovalsService from "../../services/mockQueriesApprovalsService";

function QueriesApprovals() {
  const [allqueriesList, setAllQueriesList] = useState([]);
  const [pendingQueriesList, setPendingQueriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActivekey] = useState("Pending Queries");

  const onChange = (key) => {
    console.log(key);
    setActivekey(key);
  };

  useEffect(() => {
    fetchPendingQueryListData();
    fetchAllQueryListData();
    if (location?.state) {
      setActivekey(location?.state);
    }
  }, []);

  const fetchPendingQueryListData = async () => {
    setLoading(true);
    try {
      // In development mode, use mock data
      if (process.env.NODE_ENV === 'development') {
        const response = await mockQueriesApprovalsService.getPendingQueries();
        setPendingQueriesList(response.data.data);
        setLoading(false);
        return;
      }

      const response = await axiosRequest.get(`proposal/quality-check/find_queries?page=1&limit=10&status=pending`);
      const data = response?.data?.data || [];
      const dataArray = Array.isArray(data) ? data : [data];
      setPendingQueriesList(dataArray);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllQueryListData = async () => {
    setLoading(true);
    try {
      // In development mode, use mock data
      if (process.env.NODE_ENV === 'development') {
        const response = await mockQueriesApprovalsService.getAllQueries();
        setAllQueriesList(response.data.data);
        setLoading(false);
        return;
      }

      const response = await axiosRequest.get(`proposal/quality-check/find_queries?page=1&limit=10&status=all`);
      const data = response?.data?.data || [];
      const dataArray = Array.isArray(data) ? data : [data];
      setAllQueriesList(dataArray);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Sdloader sdloader={loading} />}
      <div className="main_div">
        <div
          className="top_div"
          style={{ paddingTop: "15px", paddingBottom: "25px", paddingLeft: 25  }}
        >
          <Breadcrumb
            style={{ color: "white" }}
            separator=">"
            className="breadcrumb"
          >
            <Breadcrumb.Item href="/dashboard">
              <div className="todo-text">Dashboard</div>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">
              <div className="todo-text">Queries / Approvals</div>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="div_row">
          <div style={{ marginTop: 20 }} className="left_div">
            Queries & Approvals
          </div>
        </div>
      </div>
      <div style={{ margin: "3% 3%" }}>
        <Tabs
          className="tab-query"
          type="card"
          onChange={onChange}
          activeKey={activeKey}
        >
          <Tabs.TabPane tab="Pending Queries" key="Pending Queries">
            {loading && <Sdloader sdloader={loading} />}
            {pendingQueriesList.length === 0 ? (
              <NoRecordsFound />
            ) : (
              <div className="loandetailstitle" style={{ padding: "15px" }}>
                List of Pending Queries
              </div>
            )}
            {pendingQueriesList?.map((item, index) => {
              return (
                <div
                  key={index}
                  style={{
                    margin: "1%",
                    padding: "1% 1%",
                    border: "1px solid #D2E1FF",
                  }}
                >
                  <Row
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                    gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}
                  >
                    <Col xs={8} sm={8} md={3} lg={2} xl={2} className="">
                      <div style={{ color: "#737373", fontSize: 12 }}>
                        Application ID
                      </div>
                      <div
                        style={{
                          color: "black",
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                      >
                        {item?.applicationId}
                      </div>
                    </Col>
                    <Col xs={8} sm={8} md={2} lg={2} xl={2}>
                      <div style={{ color: "#737373", fontSize: 12 }}>
                        Case ID
                      </div>
                      <div
                        style={{
                          color: "black",
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                      >
                        {item?.caseId}
                      </div>
                    </Col>
                    <Col xs={8} sm={8} md={3} lg={4} xl={4}>
                      <div style={{ color: "#737373", fontSize: 12 }}>
                        Date & Time
                      </div>
                      <div
                        style={{
                          color: "black",
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                      >
                        {moment(item?.dateTime).format("DD MMMM YYYY, h:mm A")}
                      </div>
                    </Col>
                    <Col xs={8} sm={8} md={10} lg={10} xl={10}>
                      <div style={{ color: "#737373", fontSize: 12 }}>
                        Query Description
                      </div>
                      <div
                        style={{
                          color: "black",
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                      >
                        {item?.description}
                      </div>
                    </Col>
                    <Col xs={8} sm={8} md={3} lg={3} xl={3}>
                      <div style={{ color: "#737373", fontSize: 12 }}>
                        Status
                      </div>
                      <div
                        style={{
                          color: "orange",
                          fontSize: 14,
                          fontWeight: "500",
                        }}
                      >
                        {item?.status}
                      </div>
                    </Col>
                    <Col xs={8} sm={8} md={3} lg={3} xl={3}>
                      <div
                        style={{ color: "#68BA7F", cursor: "pointer" }}
                        onClick={() =>
                          navigate("/Application-Listing/Application", {
                            state: {
                              isPendingQueryList: true,
                              proposalId: item?.proposalId,
                            },
                          })
                        }
                      >
                        View
                      </div>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </Tabs.TabPane>
          <Tabs.TabPane tab="All Queries" key="Pending Approvals">
            {allqueriesList.length === 0 ? (
              <NoRecordsFound />
            ) : (
              <div className="loandetailstitle" style={{ padding: "15px" }}>
                List of Pending Queries
              </div>
            )}
            {allqueriesList.map((item, index) => (

              <div
                key={index}
                style={{
                  margin: "1%",
                  padding: "1% 1%",
                  border: "1px solid #D2E1FF",
                }}
              >
                <Row
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                  gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}
                >
                  <Col xs={8} sm={8} md={3} lg={2} xl={2} className="">
                    <div style={{ color: "#737373", fontSize: 12 }}>
                      Application ID
                    </div>
                    <div
                      style={{
                        color: "black",
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      {item?.applicationId}
                    </div>
                  </Col>
                  <Col xs={8} sm={8} md={2} lg={2} xl={2}>
                    <div style={{ color: "#737373", fontSize: 12 }}>
                      Case ID
                    </div>
                    <div
                      style={{
                        color: "black",
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      {item?.caseId}
                    </div>
                  </Col>
                  <Col xs={8} sm={8} md={3} lg={4} xl={4}>
                    <div style={{ color: "#737373", fontSize: 12 }}>
                      Date & Time
                    </div>
                    <div
                      style={{
                        color: "black",
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      {moment(item?.dateTime).format("DD MMMM YYYY, h:mm A")}
                    </div>
                  </Col>
                  <Col xs={8} sm={8} md={10} lg={10} xl={10}>
                    <div style={{ color: "#737373", fontSize: 12 }}>
                      Query Description
                    </div>
                    <div
                      style={{
                        color: "black",
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      {item?.description}
                    </div>
                  </Col>
                  <Col xs={8} sm={8} md={3} lg={3} xl={3}>
                    <div style={{ color: "#737373", fontSize: 12 }}>
                      Status
                    </div>
                    <div
                      style={{
                        color: "orange",
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      {item?.status}
                    </div>
                  </Col>
                  {item?.status === "resolved" ? <></> :
                    <Col xs={8} sm={8} md={3} lg={3} xl={3}>
                      <div
                        style={{ color: "#68BA7F", cursor: "pointer" }}
                        onClick={() =>
                          navigate("/Application-Listing/Application", {
                            state: {
                              isPendingQueryList: true,
                              proposalId: item?.proposalId,
                            },
                          })
                        }
                      >
                        View
                      </div>
                    </Col>}
                </Row>
              </div>
            ))}
          </Tabs.TabPane>
        </Tabs>
      </div >
    </>
  );
}

export default QueriesApprovals;
