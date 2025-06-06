import React, { useState, useEffect } from "react";
import { Button, Typography, Row, Col, Select } from "antd";
import {
  CaretDownOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import DataField from "../DataField/DataField";
import "./Team.css";
import EventCreate from "../EventCreate/EventCreate";
import HistoryTab from "../History-showedData/index";
import axios from "axios";
import { stoageGetter } from "../../../../helpers";
import axiosRequest from "../../../../axios-request/request.methods";

import { useDispatch, useSelector } from "react-redux";
const { Option } = Select;
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

const Team = () => {
  const _date = new Date();
  let currentMonth = _date.getMonth();
  let currentyear = _date.getFullYear();

  const [isActive, setActive] = useState(false);
  const [isActive1, setActive1] = useState(false);
  const [finalhierarchy, setFinalHierarchy] = useState();
  const [selected, setSelected] = useState("Select");
  const [selectedvalue, setSelectedValue] = useState("");
  const [selected1, setSelected1] = useState("");
  const [users, setUsers] = useState("");
  const [selectedvalue1, setSelectedValue1] = useState("");
  const [month, setMonth] = useState(currentMonth + 1);
  const [year, setyear] = useState(currentyear);
  const [CurentOrPast, setCurentOrPast] = useState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentpastdata, setCurrentPastData] = useState();
  const [currentpastdataln, setCurrentPastDataLn] = useState();
  const breakpoint = 620;
  //   const options=["All","Zonal Manager","Area Manager","Sales Manager"];
  //   const options2=["Ankit Singh","Rahul Patali","Otter","Sawa"];
  const RemoveData = false;
  const [DataContainer, setDataContainer] = useState();

  const _dataStore = useSelector((state) => state?.home?.user_tree);
  //   console.log(_dataStore, 'datastore before----->')

  let { id } = stoageGetter("user");
  const login_user_data = stoageGetter("user");
  const agent_id = login_user_data.agentId;
  //   const currentpastapi = async ()=>{
  //     // console.log(month,'month----><<<<<');
  //     let data = await axiosRequest.get(`user/fetch_appointments/${id}?teamdata=1&filter=${month}/${year}&category=past&agentCode=${agent_id}`);
  //     // console.log(data, 'curent pastt-------t');
  //     setCurrentPastData(data);
  //     setCurrentPastDataLn(data.length)
  //   }

  useEffect(() => {
    // if( (month == 1+new Date().getMonth() && year == new Date().getFullYear())){
    //     // console.log('yesssss curent past data here----->')
    //     currentpastapi();
    // }
    // console.log(month.toString().length, 'length==================');
    if (month.toString().length > 1) {
      setMonth(month);
    } else {
      let num = month.toString();
      let add = "0" + num;
      setMonth(add);
      console.log("MONTHH=====>>>", add);
    }
  }, []);
  useEffect(() => {
    try {
      _dataStore.reporting_hierarchies.forEach((el) => {
        el.label = el.dispValue;
      });
      _dataStore.reporting_users.forEach((el) => {
        el.label = el.full_name;
        el.value = el._id;
      });
      let _hierarList = [
        { value: "Select", label: "Select" },
        ..._dataStore.reporting_hierarchies,
      ];
      setFinalHierarchy(_hierarList);
      // setSelected(_dataStore.reporting_hierarchies[0].value)
      // setSelectedValue(_dataStore.reporting_hierarchies[0].dispValue)

      // let reportingHierarchies = _dataStore.reporting_hierarchies
      // let hiererchyusers = _dataStore.reporting_users
      // // console.log(reportingHierarchies, 'reporting Hierarchies before----->')
      // if(reportingHierarchies != undefined){
      //     let all = [{value : 'All', dispValue : 'All'}]
      //     let final = [...all,...reportingHierarchies]
      //     setFinalHierarchy(final)
      //     setSelected(final[0].value)
      //     setSelectedValue(final[0].dispValue)
      //     // console.log(reportingHierarchies, 'reporting Hierarchies----->')
      //     setUsers(hiererchyusers)
      //     setSelected1()
      // }else{
      //     let all = [{value : 'All', dispValue : 'All'}]
      //     let final = [...all]
      //     setFinalHierarchy(final)
      //     setSelected(final[0].value)
      //     setSelectedValue(final[0].dispValue)
      //     // console.log(reportingHierarchies, 'reporting Hierarchies----->')
      //     setUsers(hiererchyusers)
      // }
    } catch (err) {
      console.log(err);
    }
  }, []);
  let toCapitalize = (strText) => {
    try {
      if (strText !== "" && strText !== null && typeof strText !== undefined) {
        var _str = strText.toLowerCase();
        var collection = _str.split(" ");
        var modifyStrigs = [];
        _str = "";
        for (var i = 0; i < collection.length; i++) {
          modifyStrigs[i] =
            collection[i].charAt(0).toUpperCase() + collection[i].slice(1);
          _str = _str + modifyStrigs[i] + " ";
        }
        return _str;
      } else {
        return "";
      }
    } catch (err) {}
  };
  const hierarchyOnchange = (element) => {
    // console.log(element)
    setSelected(element);
    // setSelectedValue(element.dispValue)
    setActive(false);
    // let filterdata = _dataStore.reporting_users.filter(((data,index,arr) => data.hierarchy_id == element))
    // console.log(filterdata,'filter data')
    // let all = [{full_name : 'Select' , hierarchy_id : 'Select'}]
    // let final = [...all,...filterdata]
    // setUsers(final)
    // setSelectedValue1('Select')
    // setSelected1('Select')
    console.warn("hierarchyOnchange((((((((((===>>>>>>>>>>", element);

    _dataStore.reporting_users.forEach((el) => {
      el.label = toCapitalize(el.full_name);
      el.value = el._id;
    });
    let _teamData = _dataStore.reporting_users.filter(
      (el) => el.hierarchy_id === element
    );
    console.warn("_teamData((((((((((===>>>>>>>>>>", _teamData);

    let _userList = [{ label: "Select", value: "Select" }, ..._teamData];
    setUsers(_userList);
    setSelectedValue1("Select");
    setSelected1("Select");
  };

  const userOnchange = (element) => {
    // console.log(element)
    setSelected1(element);
   // eventsGetAPI(element);
    // setSelectedValue(element.dispValue)
    setActive1(false);
  };

  // const eventsGetAPI = async (userId) => {
  //   console.log( 'MONTHHH-----dd>>-----t',month.toString().length);
  //   let _month = month.toString().length === 1 ? "0" + month : month;
  //   let data = await axiosRequest.get(
  //     `user/fetch_appointments/${userId}?teamdata=0&filter=${_month}/${year}&category=upcoming`
  //   );
  //   console.log(data, 'pastt-- second second second-----t');
  //   setDataContainer(data);
  // };

  const exportReport = async () => {
    let data = await axiosRequest.get(
      `admin/export-event-dump?userId=${id}&team=yes`
    );
    console.log("data", data);
  };

  return (
    <div className="Team">
      {windowWidth > breakpoint && (
        <Row style={{ marginBottom: 15 }}>
          <Col md={9} lg={9} xl={9}>
            <Typography>Hierarchy</Typography>
            <div style={{ marginTop: 5 }}>
              <Select
                // className="firstdropdown"
                value={selected}
                style={{ width: "100%" }}
                onChange={hierarchyOnchange}
                placeholder="Select Hierarchy"
                options={finalhierarchy}
              ></Select>
            </div>
          </Col>
          <Col md={9} lg={9} xl={9} style={{ marginLeft: 15 }}>
            {selected !== "Select" && selected.length > 1 ? (
              <div>
                <Typography>Team Member</Typography>
                <div style={{ marginTop: 5 }}>
                  <Select
                    // className="firstdropdown"
                    value={selected1}
                    style={{ width: "100%" }}
                    onChange={userOnchange}
                    placeholder="Select "
                    options={users}
                  ></Select>
                </div>
              </div>
            ) : null}
          </Col>
        </Row>
      )}

      {windowWidth < breakpoint && (
        <div>
          <Typography>Hierarchy</Typography>
          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <Select
              // className="firstdropdown"
              value={selected}
              style={{ width: "100%" }}
              onChange={hierarchyOnchange}
              placeholder="Select Hierarchy"
              options={finalhierarchy}
            ></Select>
          </div>

          {selected !== "Select" && selected.length > 1 ? (
            <div style={{ marginTop: 10 }}>
              <Typography>Circle Manager</Typography>
              <div style={{ marginTop: 10, marginBottom: 10 }}>
                <Select
                  // className="firstdropdown"
                  value={selected1}
                  style={{ width: "100%" }}
                  onChange={userOnchange}
                  placeholder="Select Team Member"
                  options={users}
                ></Select>
              </div>
            </div>
          ) : null}

          {/* <div style={{ margin: "10px 0" }}>

            <Button
              onClick={exportReport}
              style={{ backgroundColor: "#3c3d3d", color: "#fff" }}
              className="d-flex justify-content-center align-items-center w-100"
            >
              <DownloadOutlined /> Export
            </Button>
          </div> */}
        </div>
      )}

      {/* <div className="Team-Calender">
        {
        windowWidth >breakpoint &&
            <Row className='Team-Calender-row'>
                <Col span={9} className='Team-Calender-first'>
                    <Typography>From Date</Typography>
                    <input type="date"/>
                </Col>
                <Col span={9} offset={1}className='Team-Calender-second'>
                    <Typography>To Date</Typography>
                    <input type='date'/>
                </Col>
                <Col span={2} offset={1} className='Team-Calender-Export'>
                    <Button> <CloudUploadOutlined /> Export</Button>
                </Col>
            </Row>
        }
          {
        windowWidth < breakpoint &&
        <div>
            <Row className='Team-Calender-row'>
                <Col span={12} className='Team-Calender-first'>
                    <Typography>From Date</Typography>
                    <input type="date"/>
                </Col>
                <Col span={11} offset={1}className='Team-Calender-second'>
                    <Typography>To Date</Typography>
                    <input type='date'/>
                </Col>
            </Row>
            <Row className='Team-Calender-row'>
                <Col span={3} offset={18} className='Team-Calender-Export'>
                    <Button> <CloudUploadOutlined /> Export</Button>
                </Col>
            </Row>
            </div>
        }
        </div> */}
      <EventCreate monthData={setMonth} yearData={setyear} />
      {/* <div className=''>

        </div> */}
      {/* {   
            ((month) == ( 1 + new Date().getMonth()) && (year) == (new Date().getFullYear())) 
            ?
            <HistoryTab Remove={RemoveData} CurentOrPast={setCurentOrPast} teamPast= {currentpastdataln} teampastData = {currentpastdata}/>
            :((month) >= ( 1 + new Date().getMonth()) && (year) >= (new Date().getFullYear())) ||
            (month < (1+ new Date().getMonth()) && year > (new Date().getFullYear()))
            ?
            <Typography className='Team-Past'>UPCOMING</Typography>    
            :
            <Typography className='Team-Past'>PAST</Typography>
        } */}
      <div className="Team-Information">
        <DataField
          TeamData={month + "/" + year}
          TeamHere={
            month == 1 + new Date().getMonth() &&
            year == new Date().getFullYear()
          }
          Dataupdate={DataContainer}
        />
      </div>
    </div>
  );
};

export default Team;
