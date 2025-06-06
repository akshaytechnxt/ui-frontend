import React, { useState, useEffect } from "react";
import { Breadcrumb } from "antd";
import "./Notification.css";
import "../Todo/ActivityCalendar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";

const NotificationComp = () => {
  const token = useSelector((state) => state?.user?.userData?.data?.data?.jwt);
  const history = useNavigate();
  const MAX_ITEMS = 7;
  const [isOpen, setIsOpen] = useState(false);
  const [_notify, set_Notify] = useState([]);
  const [isShown, setIsShown] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await axios.get('https://creditx-node-dev.salesdrive.app/notification/logs?limit=10&page=1', { headers });
        set_Notify(response.data.data.docs);
        console.log(response.data.data.docs, "akshaysriram");
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [token]);


  function toggle() {
    setLoading(true);
    setTimeout(() => {
      setIsOpen(!isOpen);
      setIsShown((current) => !current);
      setLoading(false);
    }, 2000);
  }

  function getRenderedItems() {
    if (isOpen) {
      return _notify;
    }
    return _notify.slice(0, MAX_ITEMS);
  }

  return (
    <>
      {/* <div className="header">
            <Row >
                <Col><p className="product-title">Notification</p></Col>
            </Row>
        </div> */}

      {/* Start the node data */}
      <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", padding: "1% 3%" }} className="main_div">
        <div className="top_div">
          <div>
            <Breadcrumb style={{ color: "white" }} separator=">" className="breadcrumb">
              <Breadcrumb.Item href="/dashboard"><div className='todo-text'>Dashboard</div></Breadcrumb.Item>
              <Breadcrumb.Item href=""><div className='todo-text'>Notification</div></Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: "0% 0% 0% 8%", fontSize: 23, marginTop: -20 }}>Notification</div>
          </div>
        </div>
      </div>

      {_notify?.length && _notify?.length > 0 ? (
        <div className="mainTab">
          <div className="stepper d-flex flex-column mt-2 ml-2">
            <div className="d-flex mb-1">
              <div style={{ paddingLeft: "20px" }} className="d-flex flex-column pr-4 align-items-center">
                <div className="startNode"></div>
                <div className="line h-100"></div>
              </div>
              <div>
                <div className="notifyHead">
                  <h4>Alert</h4>
                </div>
              </div>
            </div>

            {Array.isArray(getRenderedItems())
              ? getRenderedItems().map((notify, index) => {
                return (
                  <div key={index} className="d-flex mb-1 ml-4">
                    <div className="d-flex flex-column pr-4 align-items-center">
                      <div className="steps"></div>
                      <div className="line h-100"></div>
                    </div>
                    <div className="responsive_panel">
                      <div className="box-data1">
                        <div className="notification_data1">
                          <div className="list_data1">
                            <h4 onClick={() => {
                            }}>{notify.title}</h4>
                            <p>{notify.body}</p>
                          </div>
                          <div className="date1">
                            <p>
                              {moment(notify.created_date).format(
                                "DD-MM-YYYY"
                              )}{" "}
                              {moment(notify.created_date).format("LT")}
                            </p>
                            {/* <button
                                onClick={() => {
                                  history.push("/calendar");
                                }}
                              >
                                {notify.details
                                  ? notify.details
                                  : "View Details"}
                              </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
              : null}
          </div>

          {/* load more button */}

          <div className="loadMore">
            {loading ? (
              <button>Loading..</button>
            ) : (
              <button
                onClick={toggle}
                style={{
                  display: isShown ? "-webkit-inline-box" : "none",
                  textAlign: "center",
                }}
              >
                {isOpen ? "Load Less" : "Load More"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="no_agent">
          <p>No Notification by Agent</p>
        </div>
      )}
    </>
  );
};

export default NotificationComp;
