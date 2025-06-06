import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button } from "antd";
import Self from "./LeftSide-Activity/Self/Self";
// import EventCreate from './LeftSide-Activity/EventCreate/EventCreate'
import Team from "./LeftSide-Activity/Team/Team";
import Todo from "./RightSide-Todo/Todo";
import person_black from "./icons/person_black.png";
import person_white from "./icons/person_white.png";
import group_white from "./icons/group_white.png";
import group_black from "./icons/group_black.png";
import "./ActivityCalender.css";
import Tabs from "../../components/Tab/Tab";
import { checkAgent } from "../../helpers";
import { DownloadOutlined } from "@ant-design/icons";
import axiosRequest from "../../axios-request/request.methods";
import { useSelector } from "react-redux";

const useWidowsSize = () => {
  const [size, setSize] = useState([window.Width, window.height]);

  useEffect(() => {
    const handleChangeSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", handleChangeSize);
  }, []);
  return size;
};
const tabMenu = [
  {
    id: "calendar",
    value: "Calendar",
  },
  {
    id: "todo",
    value: "To Do",
  },
];

const App = () => {
  const [TeamSelf, setTeamSelf] = useState(true);
  // const [width, height] = useWidowsSize();
  const [windowWidth, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  const loginUserId = useSelector((state) => state?.login?.user?.id);

  const exportReport = async () => {
    // &team=yes
    let _isTeam = TeamSelf ? "no" : "yes";
    let data = await axiosRequest.get(
      `admin/export-event-dump?userId=${loginUserId}&team=${_isTeam}`
    );
    console.log("data -------??????", data);
  };

  return (
    <div className="ActivityCalender-container">
      {windowWidth < breakpoint && (
        <Tabs tabMenu={tabMenu} header="Calendar" activeKey="calendar" />
      )}
      <Row style={{ color: "#f7f7f7", marginTop: "20px" }} justify="center">
        <Col xl={14} md={14} sm={23} xs={23} className="Activity-Right">
          <Card bordered={false} className="Activity-Right-Card">
            {/* {checkAgent() === false && ( */}
            <div
              className="CardBody"
              style={{ display: "flex", flexDirection: "row" }}
            >
              {checkAgent() === false && (
                <button
                  style={{
                    width: 95,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className={TeamSelf ? "activate" : " "}
                  onClick={(e) => {
                    setTeamSelf(true);
                  }}
                >
                  <img
                    src={TeamSelf ? person_white : person_black}
                    className="person"
                    alt="person_png"
                  />
                  Self
                </button>
              )}
              {checkAgent() === false && (
                <button
                  style={{
                    width: 95,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 15,
                  }}
                  className={!TeamSelf ? "activate" : ""}
                  onClick={(e) => {
                    setTeamSelf(false);
                  }}
                >
                  <img
                    src={TeamSelf ? group_black : group_white}
                    className="person"
                    alt="group_png"
                  />
                  Team
                </button>
              )}
              {/* {TeamSelf && */}
              <div style={{ marginLeft: 15 }}>
                <Button
                  onClick={exportReport}
                  style={{ backgroundColor: "#3c3d3d", color: "#fff" }}
                  className="d-flex justify-content-center align-items-center w-100"
                >
                  <DownloadOutlined /> Export
                </Button>
              </div>
              {/* } */}
            </div>
            {/* // )} */}
            {TeamSelf ? <Self /> : <Team />}
          </Card>
        </Col>
        {windowWidth > breakpoint && (
          <Col xl={7} md={8} className="ActivityCalender-container-TodoCard">
            <Card>
              <Todo />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};
export default App;
