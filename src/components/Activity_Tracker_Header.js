import React from "react";
import "./Todo/ActivityCalendar.css";
import { AiOutlinePlus } from "react-icons/ai";
import { Breadcrumb,Button } from "antd";
const Header = ({ callback }) => {

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", padding: "1% 3%" }} className="main_div">
        <div className="top_div">
          <div>
            <Breadcrumb style={{ color: "white" }} separator=">" className="breadcrumb">
              <Breadcrumb.Item href="/dashboard"><div className='todo-text'>Dashboard</div></Breadcrumb.Item>
              <Breadcrumb.Item href=""><div className='todo-text'>Activity Tracker</div></Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: "0% 0% 0% 8%", fontSize: 23, marginTop: -20 }}>Activity Calendar</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button style={{ display:"flex",border: "1px solid #28B1FF", borderRadius: '6px', color: '#fff', backgroundColor: "#28B1FF" }}>
            <div className="plus-icon">
              <AiOutlinePlus size={15} />
            </div>
            <div className="btn-content" onClick={callback}>
              Create An Event
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;
