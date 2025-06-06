import { Typography } from "antd";
import React, { useState, useEffect } from "react";
import LeftButton from "../../icons/leftcalenderarrow.png";
import RightButton from "../../icons/rightcalenderarrow.png";
import EventCreateComponent from "../../../Contests/CalendarEvent";
import Addactivity from "../../icons/Addactivity.png";
// import axios from '../../../../axios-request/request.methods'
import { stoageGetter } from "../../../../helpers";
import axios from "axios";
import "./EventCreate.css";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../store/actions/index";
import { PlusCircleFilled } from "@ant-design/icons";

const EventCreate = ({ monthData, yearData, getFunc, getdata }) => {
  const dispatch = useDispatch();
  dispatch(actions.headerName("Activity Tracker"));
  const MonthContainer = [
    {
      1: "Jan",
      2: "Feb",
      3: "Mar",
      4: "Apr",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Aug",
      9: "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec",
    },
  ];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const [count, setCount] = useState(1 + new Date().getMonth());
  const [month, setMonth] = useState(
    MonthContainer[0][1 + new Date().getMonth()]
  );
  const [year, setYear] = useState(new Date().getFullYear());

  const eventClickBtnDec = () => {
    setCount(count - 1);
    if (count <= 1) {
      setCount(12);
      console.log(setCount(count + 11));
      setYear(year - 1);
    }
    setMonth(MonthContainer[0][count]);
  };
  const eventClickBtnInc = (e, data) => {
    setCount(count + 1);
    if (count > 11) {
      setCount(1);
      setYear(year + 1);
    }
  };
  monthData(count);
  yearData(year);

  //   useEffect(()=>{

  //     // console.log(isModalVisible, 'modal visible changes---> after exit');
  //  },[isModalVisible]);

  // {console.log(count, 'month=========------->')}
  // {console.log(year, 'year=========------->')}

  return (
    <div className="EventCreate-dateChange">
      <div className="EventCreate-Right">
        <img
          src={LeftButton}
          style={{ backgroundSize: "100% 100%", cursor: "pointer" }}
          alt="left-side-button"
          onClick={eventClickBtnDec}
        />
        <p>
          {MonthContainer[0][count]} - {year}
        </p>
        <img
          src={RightButton}
          style={{ backgroundSize: "100% 100%", cursor: "pointer" }}
          alt="right-side-button"
          onClick={eventClickBtnInc}
        />
      </div>
      {isModalVisible == true ? (
        <EventCreateComponent
          click={"data"}
          api={getFunc}
          getdata={getdata}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
      ) : (
        ""
      )}
      <div className="EventCreate-btn">
        {/* <Typography>Create an Event</Typography> */}
        {/* <img src={Addactivity} alt='Addactivity' 
            style={{backgroundSize: '100% 100%',cursor:"pointer"}} 
            onClick={showModal}/> */}
        <PlusCircleFilled
          style={{ marginTop: 5, color: "#3b371e" }}
          onClick={showModal}
        />
      </div>
    </div>
  );
};

export default EventCreate;
