import {
  Button,
  Modal,
  TimePicker,
  DatePicker,
  Input,
  Select,
  message,
  AutoComplete,
  Row,Col
} from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import moment from "moment";
import "./Todo-Tab.css";
import axiosRequest from "../../../../axios-request/request.methods";

import { stoageGetter, checkAgent } from "../../../../helpers";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

const { Option } = Select;
const { Search } = Input;

const TodoTab = (props) => {
  // console.log('editData ___TODOO_________',props)
  useEffect(() => {
    // console.warn("PROPSSSSSSS---HEREE-----------", props);
    getCompanyDetails();
    if(props.hasOwnProperty('company_Name') && props.hasOwnProperty('opportunity_Name') ){
      // console.warn("PROPSSSSSSS--------------", props?.company_Name);
      setTodoCompName(props?.company_Name)
      setTodoOpportunityName(props?.opportunity_Name)
      // if(props?.company_Name) changeCompanyName(props?.company_Name,props?.companyID)
    }
  },[props.company_Name])

  const [isHighButtonClick, setIsHighButtonClick] = useState(false);
  const [isMediumButtonClick, setIsMediumButtonClick] = useState(false);
  const [isLowButtonClick, setIsLowButtonClick] = useState(false);
  const [priorityBtn, setPriorityBtn] = useState("medium");
  const [priorityBtnColr, setPriorityBtnColr] = useState("#fb8c00");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderDateString, setReminderDateString] = useState("");
  const [todoDesc, setTodoDesc] = useState("");
  const [selectedTime, setSelectedTime] = useState("select");
  const [buttonName, setButtonName] = useState("");
  const [hierarAgentList, setHierarAgentList] = useState([]);
  const [teamMemberChip, setTeamMemberChip] = useState([]);
  const [ownerCollectn, setOwnerCollectn] = useState([]);
  const [teamMemberData, setTeamMemberData] = useState("");
  const [todoCompName, setTodoCompName] = useState("");
  const [todoOpportunityName, setTodoOpportunityName] = useState("");
  const [todoCompId, setTodoCompId] = useState("");
  const [todoOpporId, settodoOpporId] = useState("");
  const [companyArray, setCompanyArray] = useState([]);
  const [opportunityNameArray, setOpportunityNameArray] = useState([]);

  const _dataStore = useSelector((state) => state?.home?.user_tree);
  const _reportManager = useSelector((state) => state?.login?.reportingManager);
  const login_user = useSelector((state) => state.login.user);
  const minimumDate = moment().format("YYYY-MM-DD");

  // console.log("USER login_user ___DATA__", login_user);

  useEffect(() => {
    // console.log("USER HIERARCHYY ___DATA__", _dataStore);
    let _teamMember = [];
    if (Object.keys(_dataStore).length !== 0) {
      // let _teamMember = [];
      if (checkAgent() === false) {
        _dataStore.reporting_users.map((el) => {
          let sortarray = {
            FullName: el.full_name,
            ShortId: el.employeeCode,
            firstname: el.first_name,
            lastname: el.last_name,
            employecode: el.employeeCode,
            designation: el.hierarchyName,
            _Id: el._id,
            value:
              toCapitalize(el.full_name) + " " + "(" + el.hierarchyName + ")",
          };
          _teamMember.push(sortarray);
          sortarray = {};
        });
        let _finalData = [..._teamMember, _reportManager];
        setHierarAgentList(_finalData);
      } else {
        if (login_user.hasOwnProperty("reportingManager")) {
          // login_user.reportingManager
          let _reporting = login_user.reportingManager;

          let sortarray = {
            FullName: _reporting.full_name,
            ShortId: _reporting.employeeCode,
            firstname: _reporting.first_name,
            lastname: _reporting.last_name,
            employecode: _reporting.employeeCode,
            designation: _reporting.hierarchyName,
            _Id: _reporting._id,
            value:
              toCapitalize(_reporting.full_name) +
              " " +
              "(" +
              _reporting.hierarchyName +
              ")",
          };
          _teamMember.push(sortarray);
          // sortarray = {};
          setHierarAgentList(_teamMember);
        }
      }
    }
  }, []);

  useEffect(() => {
    try {
      // console.log('I AM HEREEEE____CHIPPP',props);
      // changeCompanyName(props?.company_Name,props?.companyID)
      // console.log('Calling func',Object.keys(props.editData));
      if (props.button === "Create" && props.isModalVisible === true) {
        setButtonName(props.button);
        clearData();
      }

      if (props.button === "Update" && props.isModalVisible === true)
        setButtonName(props.button);

      if (
        Object.keys(props.editData).length !== 0 ||
        props.editData !== undefined
      ) {
        // console.log('I AM HEREEEE____CHIPPP',props);
        let _teamMember = props.editData.searchdata.map((el) => {
          return toCapitalize(el.FullName) + " " + "(" + el.designation + ")";
        });
        setTeamMemberChip(_teamMember);
        setOwnerCollectn(props.editData.searchdata);

        let _data = moment(
          moment(props.editData.dateofreminder).format("YYYY-MM-DD"),
          "YYYY-MM-DD"
        );
        if (props.editData.taskPriority === "low") {
          setIsHighButtonClick(false);
          setIsMediumButtonClick(false);
          setIsLowButtonClick(true);
        } else if (props.editData.taskPriority === "high") {
          setIsHighButtonClick(true);
          setIsMediumButtonClick(false);
          setIsLowButtonClick(false);
        } else {
          setIsHighButtonClick(false);
          setIsMediumButtonClick(true);
          setIsLowButtonClick(false);
        }

        setTodoCompName(props?.editData?.companyName)
        setTodoOpportunityName(props?.editData?.opportunityName)

        setPriorityBtn(props.editData.taskPriority);
        setPriorityBtnColr(props.editData.priorityIndicatorColor);
        setReminderDate(_data);
        setReminderDateString(
          moment(props.editData.dateofreminder).format("YYYY-MM-DD")
        );
        setTodoDesc(props.editData.content);
        setSelectedTime(props.editData.stringtimeofreminder);
        setTodoDesc(props.editData.content);
      }
    } catch (err) {}
  }, [props]);

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

  useEffect(() => {
    // getCompanyDetails();
    
  },[])

  const getCompanyDetails = async (lead_id) => {
    let result = await axiosRequest.get(`user/opportunity/distinct/companies`, {
      secure: true,
    });
    // console.warn('__++++++COMPANY++++++++ RESPPPP',result)
    if(result.length > 0){
      let _compArr = [];
      result[0].company_id.map((el) => {
        let _data = { value: el.company_name, label: el.company_name, _id: el._id };
        _compArr.push(_data);
      });
      setCompanyArray(_compArr);
    }
  };

  let timeListText = [
    {
      dispValue: "Select",
      label: "Select",
      value: "select",
    },
    {
      dispValue: "12:00 AM",
      label: "12:00 AM",
      value: "12:00 AM",
    },
    {
      dispValue: "12:30 AM",
      label: "12:30 AM",
      value: "12:30 AM",
    },
    {
      dispValue: "1:00 AM",
      label: "1:00 AM",
      value: "1:00 AM",
    },
    {
      dispValue: "1:30 AM",
      label: "1:30 AM",
      value: "1:30 AM",
    },
    {
      dispValue: "2:00 AM",
      label: "2:00 AM",
      value: "2:00 AM",
    },
    {
      dispValue: "2:30 AM",
      label: "2:30 AM",
      value: "2:30 AM",
    },
    {
      dispValue: "3:00 AM",
      label: "3:00 AM",
      value: "3:00 AM",
    },
    {
      dispValue: "3:30 AM",
      label: "3:30 AM",
      value: "3:30 AM",
    },
    {
      dispValue: "4:00 AM",
      label: "4:00 AM",
      value: "4:00 AM",
    },
    {
      dispValue: "4:30 AM",
      label: "4:30 AM",
      value: "4:30 AM",
    },
    {
      dispValue: "5:00 AM",
      label: "5:00 AM",
      value: "5:00 AM",
    },
    {
      dispValue: "5:30 AM",
      label: "5:30 AM",
      value: "5:30 AM",
    },
    {
      dispValue: "6:00 AM",
      label: "6:00 AM",
      value: "6:00 AM",
    },
    {
      dispValue: "6:30 AM",
      label: "6:30 AM",
      value: "6:30 AM",
    },
    {
      dispValue: "7:00 AM",
      label: "7:00 AM",
      value: "7:00 AM",
    },
    {
      dispValue: "7:30 AM",
      label: "7:30 AM",
      value: "7:30 AM",
    },
    {
      dispValue: "8:00 AM",
      label: "8:00 AM",
      value: "8:00 AM",
    },
    {
      dispValue: "8:30 AM",
      label: "8:30 AM",
      value: "8:30 AM",
    },
    {
      dispValue: "9:00 AM",
      label: "9:00 AM",
      value: "9:00 AM",
    },
    {
      dispValue: "9:30 AM",
      label: "9:30 AM",
      value: "9:30 AM",
    },
    {
      dispValue: "10:00 AM",
      label: "10:00 AM",
      value: "10:00 AM",
    },
    {
      dispValue: "10:30 AM",
      label: "10:30 AM",
      value: "10:30 AM",
    },
    {
      dispValue: "11:00 AM",
      label: "11:00 AM",
      value: "11:00 AM",
    },
    {
      dispValue: "11:30 AM",
      label: "11:30 AM",
      value: "11:30 AM",
    },
    {
      dispValue: "12:00 PM",
      label: "12:00 PM",
      value: "12:00 PM",
    },
    {
      dispValue: "12:30 PM",
      label: "12:30 PM",
      value: "12:30 PM",
    },
    {
      dispValue: "1:00 PM",
      label: "1:00 PM",
      value: "1:00 PM",
    },
    {
      dispValue: "1:30 PM",
      label: "1:30 PM",
      value: "1:30 PM",
    },
    {
      dispValue: "2:00 PM",
      label: "2:00 PM",
      value: "2:00 PM",
    },
    {
      dispValue: "2:30 PM",
      label: "2:30 PM",
      value: "2:30 PM",
    },
    {
      dispValue: "3:00 PM",
      label: "3:00 PM",
      value: "3:00 PM",
    },
    {
      dispValue: "3:30 PM",
      label: "3:30 PM",
      value: "3:30 PM",
    },
    {
      dispValue: "4:00 PM",
      label: "4:00 PM",
      value: "4:00 PM",
    },
    {
      dispValue: "4:30 PM",
      label: "4:30 PM",
      value: "4:30 PM",
    },
    {
      dispValue: "5:00 PM",
      label: "5:00 PM",
      value: "5:00 PM",
    },
    {
      dispValue: "5:30 PM",
      label: "5:30 PM",
      value: "5:30 PM",
    },
    {
      dispValue: "6:00 PM",
      label: "6:00 PM",
      value: "6:00 PM",
    },
    {
      dispValue: "6:30 PM",
      label: "6:30 PM",
      value: "6:30 PM",
    },
    {
      dispValue: "7:00 PM",
      label: "7:00 PM",
      value: "7:00 PM",
    },
    {
      dispValue: "7:30 PM",
      label: "7:30 PM",
      value: "7:30 PM",
    },
    {
      dispValue: "8:00 PM",
      label: "8:00 PM",
      value: "8:00 PM",
    },
    {
      dispValue: "8:30 PM",
      label: "8:30 PM",
      value: "8:30 PM",
    },
    {
      dispValue: "9:00 PM",
      label: "9:00 PM",
      value: "9:00 PM",
    },
    {
      dispValue: "9:30 PM",
      label: "9:30 PM",
      value: "9:30 PM",
    },
    {
      dispValue: "10:00 PM",
      label: "10:00 PM",
      value: "10:00 PM",
    },
    {
      dispValue: "10:30 PM",
      label: "10:30 PM",
      value: "10:30 PM",
    },
    {
      dispValue: "11:00 PM",
      label: "11:00 PM",
      value: "11:00 PM",
    },
    {
      dispValue: "11:30 PM",
      label: "11:30 PM",
      value: "11:30 PM",
    },
  ];

  const handleOk = () => {
    props.setIsModalVisible(false);
    // clearData()
  };

  const handleCancel = () => {
    props.setIsModalVisible(false);
    // clearData()
  };

  const [windowWidth, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  const onChangeDatePick = (date, dateString) => {
    // console.log(date);
    // console.log(dateString);
    setReminderDateString(dateString);
    setReminderDate(date);
  };
  const submitTodoData = async () => {
    // console.log('priorityBtn____',priorityBtn)
    const { id } = stoageGetter("user");
    // console.log('USER___IDDDD',id)
    // return
    if (buttonName === "Create") {
      if (todoDesc === "") {
        message.warning("Please Add Task Name");
        return;
      }
      if (priorityBtn === "") {
        message.warning("Please select priority");
        return;
      }
      if (reminderDate === "") {
        message.warning("Please select due date");
        return;
      }
      if (selectedTime === "" || selectedTime === "select") {
        message.warning("Please select time");
        return;
      }

      let allocationdata = [];
      if (
        ownerCollectn === null ||
        ownerCollectn === undefined ||
        ownerCollectn === ""
      ) {
        allocationdata.push(id);
      } else {
        ownerCollectn.map((x) => {
          allocationdata.push(x._Id);
        });
        allocationdata.push(id);
      }

      // console.warn('ownerCollectn________',ownerCollectn)
      console.warn("selectedTime ________", selectedTime);
      let _ownerCollectn = _.uniqBy(ownerCollectn, "ShortId");
      allocationdata = [...new Set(allocationdata)];

      let formData = {
        dateOfReminder: reminderDateString,
        description: todoDesc,
        owernersCollectionDetails: _ownerCollectn.map((el) => {
          return {
            FullName: el.FullName,
            ShortId: el.ShortId,
            designation: el.designation,
            _Id: el._Id,
          };
        }),
        priorityIndicatorColor: priorityBtnColr,
        taskOwner: id,
        taskOwners: allocationdata,
        taskPriority: priorityBtn,
        timeOfReminder: selectedTime,
        userId: id,
      };
      // console.log('CHECK PROPPPPSSS ____________', props)
      if(props.hasOwnProperty('companyID') && props.hasOwnProperty('leadID') ){
        // if(!props.companyID && props.leadID !== '-'){}
        formData["company_id"] = props.companyID;
        // formData["leadId"] = props.leadID;
      }else{
        formData["company_id"] = todoCompId;
        // formData["leadId"] = todoOpporId;
      }
      
      let _resp = await axiosRequest.post(`user/todo_task`, formData, {
        secure: true,
      });
      console.log("TODO__RESPPPP", _resp);
      // setIsModalVisible(false);
      if (_resp.length !== 0) {
        handleCancel();
        props.getTodoData();
      }
    } else {
      let allocationdata = [];
      if (
        ownerCollectn === null ||
        ownerCollectn === undefined ||
        ownerCollectn === ""
      ) {
        allocationdata.push(id);
      } else {
        ownerCollectn.map((x) => {
          allocationdata.push(x._Id);
        });
        allocationdata.push(id);
      }
      let _ownerCollectn = _.uniqBy(ownerCollectn, "ShortId");
      allocationdata = [...new Set(allocationdata)];
      let formData = {
        dateOfReminder: reminderDateString,
        description: todoDesc,
        owernersCollectionDetails: _ownerCollectn.map((el) => {
          return {
            FullName: el.FullName,
            ShortId: el.ShortId,
            designation: el.designation,
            _Id: el._Id,
          };
        }),
        priorityIndicatorColor: priorityBtnColr,
        taskOwner: id,
        taskOwners: allocationdata,
        taskPriority: priorityBtn,
        timeOfReminder: selectedTime,
        taskId: props.editData.todoid,
        userId: id,
      };
      // return

      let _resp = await axiosRequest.put(`user/update_task_status`, formData, {
        secure: true,
      });

      console.log("TODO__RESPPPP", _resp);
      // setIsModalVisible(false);
      if (_resp.length !== 0) {
        handleCancel();
        props.getTodoData();
      }
    }
  };

  const clearData = () => {
    setPriorityBtn("medium");
    setPriorityBtnColr("#fb8c00");
    setIsHighButtonClick(false);
    setIsMediumButtonClick(true);
    setIsLowButtonClick(false);
    // setPriorityBtn('')
    // setPriorityBtnColr('')
    setReminderDate("");
    setTodoDesc("");
    setSelectedTime("select");
    setOwnerCollectn([]);
    setTeamMemberChip([]);
    if(!props.hasOwnProperty('companyID') && !props.hasOwnProperty('leadID')){
      setTodoCompName('')
      setTodoOpportunityName('')
    }
    
  };
  const handleTimeChange = (value) => {
    setSelectedTime(value);
    console.log(`selected ${value}`);
  };

  const onChangeTeam = (text, data) => {
    setTeamMemberData(text);
    // console.log('onSelect___text', text);
    // console.log('onSelect___data', data);
    setOwnerCollectn([...ownerCollectn, data]);
  };

  const onSelectTeam = (value) => {
    // console.log('ON SELECTION ______________', value);
    setTeamMemberData("");
    let _data = [...new Set([...teamMemberChip, value])];
    setTeamMemberChip(_data);
  };

  const removeTeamMember = (data, ind) => {
    let _arrayOwner = ownerCollectn.filter(
      (item, index) => item.value !== data
    );
    setOwnerCollectn(_arrayOwner);
    let _array = teamMemberChip.filter((item, index) => index !== ind);
    setTeamMemberChip(_array);
  };

  const changeOpportunityName = (value,data) => {
    settodoOpporId(value)
    setTodoOpportunityName(data.label)
    
  }

  const changeCompanyName = async(value,compId) => {
    // console.log("COMPANY NAMEE --------------", value);
    // console.log("opportunityNameArray IDDD --------------", opportunityNameArray);
    setTodoCompName(value)
    setTodoCompId(compId)
    // setOpportunityNameArray([])

    let _opportunityAPI = await axiosRequest.get(`user/opportunity/distinct/opportunity_names?company_id=${compId}`, {
      secure: true,
    });
    // console.warn('__++++++OPPORTUNITYYYYY++++++++ RESPPPP',_opportunityAPI)
    let _opporArr = [];
    _opportunityAPI.map((el) => {
      let _data = { label: el.opportunity_name,value:  el._id, _id: el._id };
      _opporArr.push(_data);
    });
    setOpportunityNameArray(_opporArr);
  }

  return (
    <>
      <Modal
        title="Add To Do"
        visible={props.isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="todo-popup-container-width todo-header-style"
      >
        <div className="Todo-Create-Container">
          <div className="" style={{backgroundColor:'#fff'}}>
            <Row style={{marginBottom:10}}>
              <Col style={{flex:1}}>
                <p style={{ marginBottom: 5 }}> Company Name </p>
                <Select
                  placeholder="Select"
                  style={{width: '100%'}}
                  options={companyArray}
                  value={todoCompName || undefined}
                  disabled={props.hasOwnProperty('companyID') && props.hasOwnProperty('leadID') ? true : false}
                  onChange={(val,data) => changeCompanyName(val,data._id)}
                ></Select>
              </Col>
              
              {/* <Col style={{flex:1,marginLeft:10}}>
                <p style={{ marginBottom: 5 }}> Client Name </p>

                <AutoComplete
                  placeholder="Select"
                  options={opportunityNameArray}
                  style={{width: '100%'}}
                  value={todoOpportunityName}
                  disabled={props.hasOwnProperty('companyID') && props.hasOwnProperty('leadID') ? true : false}
                  onChange={(val, data) => changeOpportunityName(val, data)}
                  // onSelect={(val, data) => onSelectCompany(val, data)}
                  filterOption={(inputValue, option) =>
                    option.label
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                ></AutoComplete>
              </Col> */}
            </Row>
            <div className="Todo-Create-Header" style={{ marginBottom: 5 }}>
              <p style={{ marginBottom: 0 }}> Add Team Member </p>
            </div>
            <div className="Todo-Create-SearchBox todoSearch">
              <AutoComplete
                value={teamMemberData}
                style={{ width: "100%" }}
                options={hierarAgentList}
                onChange={(text, data) => onChangeTeam(text, data)}
                onSelect={onSelectTeam}
                filterOption={(inputValue, option) =>
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              >
                <Search placeholder="Search by Name" />
              </AutoComplete>
            </div>
            {teamMemberChip.length !== 0 && (
              <div
                style={{
                  display: "flex",
                  flexFlow: "wrap",
                  alignItems: "center",
                }}
              >
                {teamMemberChip.map((item, index) => {
                  return (
                    <div style={{ marginRight: 10, marginTop: 10 }}>
                      <Button
                        size="small"
                        type="primary"
                        style={{
                          backgroundColor: "#00ACC1",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                        }}
                        shape="round"
                      >
                        {item}{" "}
                        <CloseOutlined
                          onClick={() => removeTeamMember(item, index)}
                        />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            <hr
              style={{ margin: "10px 0", color: "#f4f4f4", opacity: "0.2" }}
            />
            <div className="Todo-Create-TextBox">
              <Input
                value={todoDesc}
                onChange={(e) => setTodoDesc(e.target.value)}
                type="text"
                placeholder="What do you need to remember To Do"
              />
            </div>
            <hr
              style={{
                margin: "10px 0",
                color: "#f4f4f4 !important",
                opacity: "0.2",
              }}
            />
            <div className="Todo-Create-Priority">
              <p style={{ marginBottom: 0 }}>Add Priority</p>
              <Button
                style={{ backgroundColor: "#ff5252", color: "#fff" }}
                onClick={() => {
                  setPriorityBtnColr("#ff5252");
                  setPriorityBtn("high");
                  setIsHighButtonClick(true);
                  if (isMediumButtonClick == true) {
                    setIsMediumButtonClick(false);
                  } else if (isLowButtonClick == true) {
                    setIsLowButtonClick(false);
                  }
                }}
                className={isHighButtonClick ? "buttonOpacity" : ""}
              >
                High
              </Button>
              <Button
                style={{ backgroundColor: "#fb8c00", color: "#fff" }}
                onClick={() => {
                  setPriorityBtnColr("#fb8c00");
                  setPriorityBtn("medium");
                  setIsMediumButtonClick(true);
                  if (isHighButtonClick == true) {
                    setIsHighButtonClick(false);
                  } else if (isLowButtonClick == true) {
                    setIsLowButtonClick(false);
                  }
                }}
                className={isMediumButtonClick ? "buttonOpacity" : ""}
              >
                Medium
              </Button>
              <Button
                style={{ backgroundColor: "#4caf50", color: "#fff" }}
                onClick={() => {
                  setPriorityBtnColr("#4caf50");
                  setPriorityBtn("low");
                  setIsLowButtonClick(true);
                  if (isHighButtonClick == true) {
                    setIsHighButtonClick(false);
                  } else if (isMediumButtonClick == true) {
                    setIsMediumButtonClick(false);
                  }
                }}
                className={isLowButtonClick ? "buttonOpacity" : ""}
              >
                Low
              </Button>
            </div>
            <hr
              style={{
                margin: "10px 0",
                color: "#f4f4f4 !important",
                opacity: "0.4",
              }}
            />
            <div
              className={[
                windowWidth < breakpoint
                  ? "Todo-Create-FooterReminder-mob"
                  : "Todo-Create-FooterReminder",
              ]}
              style={{ display: "flex" }}
            >
              <p>Set a Due Reminder</p>
              {/* <input type='date' style={{marginBottom: '10px'}} /> */}
              <DatePicker
                inputReadOnly={true}
                value={reminderDate}
                onChange={onChangeDatePick}
                // disabledDate={(d) => !d || d.isBefore(minimumDate)}
                className="todo-ml10"
                style={{ marginBottom: "10px", flex: 1 }}
              />

              <Select
                value={selectedTime}
                className="todo-mb20 todo-ml10"
                style={{ flex: 1 }}
                onChange={(time) => handleTimeChange(time)}
              >
                {timeListText.map((e, index) => (
                  <Option value={e.value}>{e.label}</Option>
                ))}
              </Select>
              <div className="todo-ml10">
                {/* <Button onClick={()=> submitTodoData()} className='Todo-Create-FooterReminder-Button'>Save</Button> */}
                <div
                  onClick={() => submitTodoData()}
                  className="Todo-Create-FooterReminder-Button todo-mb20"
                  style={{ cursor: "pointer" }}
                >
                  <text>Save</text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TodoTab;
