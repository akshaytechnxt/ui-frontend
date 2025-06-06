import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Button, Input } from "antd";
import TodoTab from "../TodoCreate-Tab/Todo-Tab";
import TodoClock from "../../icons/todoclock.png";
import hamburger from "../../icons/hamburger8@2x.png";
import TodoData from "../../JSON/TodoData";
import Pagenation from "../../Pagenation/Pagenation";
import { FormOutlined, ShopOutlined } from "@ant-design/icons";
import "../Todo&Archive-Css/TodoCards.css";
import checkboxoutline from "../../icons/checkboxoutline.png";
import truecheckbox from "../../icons/truecheckbox.png";
import { Card, Col, Collapse, Pagination } from "antd";
import axiosRequest from "../../../../axios-request/request.methods";
import moment from "moment";
import { stoageGetter } from "../../../../helpers";
import "../../../Activitity Tracker/Pagenation/Pagenation.css";
import noDataIcon from "../../../../assets/078e54aa9d@2x.png";

const TodoCards = forwardRef((props, ref) => {
  // console.log(TodoData.length);
  const { id } = stoageGetter("user");
  let loginUserID = id;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showData, setShowData] = useState(false);
  const [getTodoDataArray, setGetTodoDataArray] = useState([]);
  const [updateData, setUpdateData] = useState({});
  const [totolDataCount, setTotolDataCount] = useState(0);
  const [buttonName, setButtonName] = useState("");

  const [totalPage, setTotalPage] = useState(0);
  const [current, setCurrent] = useState(1);
  const [skipVal, setSkipVal] = useState(0);
  const [fval, setFval] = useState(0);
  const [sval, setSval] = useState(0);
  //   const [swap_final_count, setSwap_final_count] = useState(false);
  const [remarkDataEnt, setRemarkDataEnt] = useState("");
  let swap_final_count = false;

  const showModal = (event, ind) => {
    // console.log('TODO__CARDD___DATA__',event)
    // setButtonName('Update')
    getTodoDataArray[ind].showarchiedpopup = false;
    setUpdateData(event);
    setIsModalVisible(true);
  };

  useImperativeHandle(ref, () => ({
    getTodoData: () => {
      getTodoData(0);
    },
  }));

  const [isEditModalIndex, setisEditModalIndex] = useState();
  // const EditModal=(index)=>{
  //     // console.log(index);
  //     setisEditModalIndex(index)
  // }
  useEffect(() => {
    getTodoData(0);
  }, []);

  let getTodoData = async (skip) => {
    // console.warn("TODO___PROPSSSS", props);
    try {
      const { id } = stoageGetter("user");
      let arrData = [];
      let _api = props.leadID
        ? `user/fetch_todo_list?user_id=${id}&filter=all&skip=${skip}&lead_id=${props.leadID}`
        : `user/fetch_todo_list?user_id=${id}&filter=all&skip=${skip}`;
      let _resp = await axiosRequest.get(_api, { secure: true });
      //   console.log("TODO__GETTTT___RESPPPP", _resp);
      let respData = _resp[0];

      setTotalPage(_resp[1][0].count / 5);

      setTotolDataCount(_resp[1][0].count);
      var less_enough = _resp[1][0].count;
      var checkless_init = false;
      less_enough < 5 ? (checkless_init = false) : (checkless_init = true);

      // if less than 15 we have second value same as total value as no pagination will occur
      if (checkless_init) {
        // checkinit is true means the final count is more than 15
        var traverse = skip + 5;
        // var traverse = _resp[0].length < 5 ? totolDataCount : skip + 5;
        setFval(traverse - 4);
        swap_final_count ? setSval(totolDataCount) : setSval(traverse);
      } else {
        setFval(1);
        setSval(totolDataCount);
      }

      //   console.warn("((((((sval))))))", sval);

      for (let _data of respData) {
        // console.log("DATATATATA", _data);
        let _icon = "";
        let _remark = "";
        // let _enableRemark = null
        // let _disableSubmit = null
        let _textOverline = {};
        if (_data.taskOwner._id !== id) {
          _textOverline =
            _data?.owernersCollectionDetails[0]?.taskDone === false
              ? { textDecorationLine: "", opacity: "0" }
              : { textDecorationLine: "line-through", opacity: "0" };
          _icon =
            _data?.owernersCollectionDetails[0]?.taskDone === false
              ? checkboxoutline
              : truecheckbox;
        } else {
          _textOverline =
            _data?.taskDone === false
              ? { textDecorationLine: "", opacity: "0" }
              : { textDecorationLine: "line-through", opacity: "0" };
          _icon = _data?.taskDone === false ? checkboxoutline : truecheckbox;
        }
        // console.log("*********************** _data ****************",_data.taskId);
        if (_data.owernersCollectionDetails.length > 0) {
          _data?.owernersCollectionDetails.forEach((event) => {
            // console.log("*********************** owernersCollectionDetails ****************",event.remarkText);
            if (event.remarkText !== "") {
              event.remarkData = event.remarkText;
              event.disableSubmit = true;
            } else {
              event.remarkData = event.remarkText;
              event.disableSubmit = false;
            }
          });
        }

        // console.log("*********************** _data ****************",_data?.owernersCollectionDetails);

        let objstrct = {
          content: _data?.description,
          removeBtn: _data?.taskDone,
          icon: _icon,
          createddate: _data?.createdDate,
          dateofreminder: moment(_data?.dateOfReminder).format("L"),
          timeofreminder: parseInt(_data?.timeOfReminder),
          todoid: _data?._id,
          stringtimeofreminder: _data?._stringVersionTimeOfReminder,
          ownername:
            _data?.taskOwner?.first_name + " " + _data?.taskOwner?.last_name,
          status: setTodoStatus(
            _data?.dateOfReminder,
            parseInt(_data?.timeOfReminder)
          ),
          searchdata: _data?.owernersCollectionDetails,
          taskOwner_id: _data?.taskOwner._id,
          taskPriority: _data?.taskPriority,
          priorityIndicatorColor: _data?.priorityIndicatorColor,
          showMemberRemark: false,
          showMemText: "Show More",
          sooncolor: "#E46A25",
          overduecolor: "#F44336",
          showarchiedpopup: false,
          remarkData: _remark,
          textOverLine: _textOverline,
          companyName: _data?.company_id?.raw_company_name,
          opportunityName: _data?.leadId?.opportunity_name,
          wholeData: _data,
        };
        // console.warn('((((((((((((((objstrct------>>>))))))))))))))',objstrct)
        arrData.push(objstrct);
      }
      // console.warn('((((((((((((((arrData------>>>))))))))))))))',arrData)
      setGetTodoDataArray(arrData);
      // console.warn("getTodoDataArray____DATAA", getTodoDataArray);
      setShowData(true);
    } catch (err) {}
  };

  let setTodoStatus = (reminderDate, reminderTime) => {
    try {
      let reminderDay = reminderDate + reminderTime;
      let current_date = Date.now();

      let soon_time_ = reminderDay - 60000 * 60 * 24;
      let start_time = new Date(current_date).setHours(0, 0, 0, 0);
      let end_time = new Date(current_date).setHours(23, 59, 59, 999);

      if (current_date > reminderDay) {
        return "Overdue";
      } else if (start_time < soon_time_ && soon_time_ < end_time) {
        return "Soon";
      } else {
        return "";
      }
    } catch (err) {
      console.log(err, "837270dc-c0d0-4049-b3cf-0ba00b631b8b");
    }
  };

  const archiveData = async (event) => {
    // console.log('TODO__CARDD___DATA__',event)
    //   setIsModalVisible(true);
    const { id } = stoageGetter("user");
    try {
      let formData = {
        // userId:id,
        userId: id,
        taskOwner: event.taskOwner_id,
        taskId: event.todoid,
        archive: true,
      };
      let _resp = await axiosRequest.put(`user/update_task_status`, formData, {
        secure: true,
      });
      console.log("DATA Update:: Archived", _resp);
      setGetTodoDataArray([]);
      getTodoData(0);
    } catch (err) {
      // console.log(err , 'ce7372e5-ba6c-4ce9-8bdf-c59899feddf5');
    }
  };

  // const [isCompleted,setIscompleted]=useState();
  const Uncheck = (index) => {
    // setIscompleted(
    getTodoDataArray.map((item) => {
      if (item.taskOwner_id === index) {
        item.Completed === true
          ? (item.Completed = false)
          : (item.Completed = true);
      }
      return item;
    });
    // )
  };

  const removListFromToDo = (data, rowIndex) => {
    // console.warn('((((((((Check box data))))))))------->>>',data.removeBtn);
    // console.warn('((((((((Check box data___rowIndex))))))))------->>>',rowIndex);
    const { id } = stoageGetter("user");

    let _teamMembers = [];
    // let newData = getTodoDataArray;

    if (data.removeBtn === false) {
      let _data = getTodoDataArray.map((ev, index) => {
        if (rowIndex === index) {
          ev.removeBtn = true;
          ev.icon = truecheckbox;
          ev.textOverLine.textDecorationLine = "line-through";
        }
        return ev;
      });
      setGetTodoDataArray(_data);

      if (_data[rowIndex].taskOwner_id !== id) {
        let object = {
          FullName: _data[rowIndex].searchdata[0].FullName,
          designation: _data[rowIndex].searchdata[0].designation,
          _Id: _data[rowIndex].searchdata[0]._Id,
          ShortId: _data[rowIndex].searchdata[0].ShortId,
          remarkText: _data[rowIndex].searchdata[0].remarkText,
          taskDone: true,
          inAppNotification: _data[rowIndex].searchdata[0].inAppNotification,
          remarkNotification: _data[rowIndex].searchdata[0].remarkNotification,
        };
        _teamMembers.push(object);

        let formdata = {
          userId: id,
          taskOwner: _data[rowIndex].taskOwner_id,
          taskId: _data[rowIndex].todoid,
          owernersCollectionDetails: _teamMembers,
        };
        // console.warn('((((((((______ formdata REMOVEE___FALSEE _____))))))))------->>>',formdata);
        updateTODOTaskApi(formdata);
      } else {
        let formdata = {
          userId: id,
          taskOwner: _data[rowIndex].taskOwner_id,
          taskId: data.todoid,
          taskDone: true,
        };
        updateTODOTaskApi(formdata);
      }
    } else {
      //   let _data = getTodoDataArray.map((ev, index) => {
      //     if (rowIndex === index) {
      //       ev.removeBtn = false;
      //       ev.icon = checkboxoutline;
      //       ev.textOverLine.textDecorationLine = "";
      //     }
      //     return ev;
      //   });
      //   setGetTodoDataArray(_data);
      //   if (_data[rowIndex].taskOwner_id !== id) {
      //     let object = {
      //       FullName: _data[rowIndex].searchdata[0].FullName,
      //       designation: _data[rowIndex].searchdata[0].designation,
      //       _Id: _data[rowIndex].searchdata[0]._Id,
      //       ShortId: _data[rowIndex].searchdata[0].ShortId,
      //       remarkText: _data[rowIndex].searchdata[0].remarkText,
      //       taskDone: false,
      //       inAppNotification: _data[rowIndex].searchdata[0].inAppNotification,
      //       remarkNotification: _data[rowIndex].searchdata[0].remarkNotification,
      //     };
      //     _teamMembers.push(object);
      //     let formdata = {
      //       userId: id,
      //       taskOwner: _data[rowIndex].taskOwner_id,
      //       taskId: _data[rowIndex].todoid,
      //       owernersCollectionDetails: _teamMembers,
      //     };
      //     updateTODOTaskApi(formdata);
      //   } else {
      //     let formdata = {
      //       userId: id,
      //       taskOwner: _data[rowIndex].taskOwner_id,
      //       taskId: data.todoid,
      //       taskDone: false,
      //     };
      //     updateTODOTaskApi(formdata);
      //   }
    }
  };

  const updateTODOTaskApi = async (data) => {
    setGetTodoDataArray([]);
    let _resp = await axiosRequest.put(`user/update_task_status`, data, {
      secure: true,
    });
    // console.log('UPDATE___RESPPP__',_resp)
    getTodoData(0);
  };

  const [ShowMore, setShowMore] = useState(false);
  const [isShowMoreIndex, setIsShowMoreIndex] = useState();
  const showMoreIndex = (index) => {
    setIsShowMoreIndex(index);
  };
  // console.log(isShowMoreIndex);

  const onChangePagination = (page) => {
    // console.log(page);
    let _decrement = 0;
    let _increment = 0;

    let _total = totalPage.toString();
    var _res = _total.includes(".")
      ? parseInt(_total.split(".")[0]) + 1
      : _total;

    _res === page ? (swap_final_count = true) : (swap_final_count = false);

    _decrement = (page - 1) * 5;
    // setSkipVal(_decrement);
    getTodoData(_decrement);

    // if (current > page) {
    //     _decrement = (page - 1) * 5;
    //     // setSkipVal(_decrement);
    //     getTodoData(_decrement);
    // } else if (current < page) {
    //     _increment = (page - 1) * 5;
    //     // setSkipVal(_increment);
    //     getTodoData(_increment);
    // }
    setCurrent(page);
  };

  const Showpopuptodo = (ind, data) => {
    let _data = getTodoDataArray.map((ev, index) => {
      ind === index
        ? ev.showarchiedpopup === true
          ? (ev.showarchiedpopup = false)
          : (ev.showarchiedpopup = true)
        : (ev.showarchiedpopup = false);
      return ev;
    });
    setGetTodoDataArray(_data);
  };

  const memberRemarks = (ind) => {
    // console.warn('______getTodoDataArray ____',getTodoDataArray[ind])
    let _data = getTodoDataArray.map((ev, index) => {
      if (ind === index) {
        if (ev.showMemberRemark === false) {
          ev.showMemberRemark = true;
          ev.showMemText = "Show Less";
        } else if (ev.showMemberRemark === true) {
          ev.showMemberRemark = false;
          ev.showMemText = "Show More";
        }
      }
      return ev;
    });
    setGetTodoDataArray(_data);
  };

  const submitRemark = (ind, remark, userId) => {
    let _teamMembers = [];
    let _data = {};
    getTodoDataArray[ind].searchdata.map((ev) => {
      // console.log('MAPPPPPPP ______REMMMsUBMIT_______***>>',ev)
      // if (userId == ev._Id) {
      // ev.remarkData = remark;
      _data = {
        FullName: ev.FullName,
        designation: ev.designation,
        _Id: ev._Id,
        ShortId: ev.ShortId,
        remarkText: userId === ev._Id ? remark : ev.remarkText,
        taskDone: ev.taskDone,
        inAppNotification: ev.inAppNotification,
        remarkNotification: ev.remarkNotification,
      };
      _teamMembers.push(_data);
      // }
    });
    // console.log('_teamMembers _____________***>>',_teamMembers)

    let formdata = {
      userId: loginUserID,
      taskOwner: getTodoDataArray[ind].taskOwner_id,
      taskId: getTodoDataArray[ind].todoid,
      owernersCollectionDetails: _teamMembers,
    };
    // console.log('formdata ------->>>',formdata)
    // return
    // console.log('ownerCollectn----@@@@--->>>',ownerCollectn)
    updateTODOTaskApi(formdata);
  };

  let fetchTodo = () => {
    return getTodoDataArray.map((element, index) => {
      //   console.log('DATATATATA____',element)
      return (
        <div className="TodoCard-Container" key={index}>
          <div
            className="TodoCards-Top"
            style={{ borderBottom: "1px solid #e6e9eb" }}
          >
            <div className="TodoCards-TimedateArchive" sm>
              <Col className="TodoCards-TopClock">
                <div className="todoCard-mr15">
                  <img src={TodoClock} alt="alarm" />
                </div>
                <div>
                  <text
                    style={{
                      color:
                        element.status === "Soon"
                          ? element.sooncolor
                          : element.status === "Overdue"
                          ? element.overduecolor
                          : "#000",
                    }}
                  >
                    {element.status}{!element.status ? "" :  " : "}
                  </text>
                </div>
                <div style={{ marginLeft: 5 }}>
                  <text
                    style={{
                      color:
                        element.status === "Soon"
                          ? element.sooncolor
                          : element.status === "Overdue"
                          ? element.overduecolor
                          : "#000",
                    }}
                  >
                    {element.dateofreminder} : {element.stringtimeofreminder}
                  </text>
                </div>
              </Col>

              {element.taskOwner_id === loginUserID && (
                <div style={{ paddingLeft: 10, paddingRight: 5 }}>
                  <img
                    alt=""
                    src={hamburger}
                    style={{ height: 15, width: 3, cursor: "pointer" }}
                    onClick={(e) => {
                      Showpopuptodo(index, element);
                    }}
                  />
                </div>
              )}
              <div className="Hamburger-Edit">
                {element.showarchiedpopup === true && (
                  <div className="TodoCard-Container-Hamburger">
                    <Card className="Hamburger-Card Hamburger-box">
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => showModal(element, index)}
                      >
                        <FormOutlined
                          style={{ marginRight: "10px", marginLeft: 10 }}
                        />
                        Edit
                      </div>
                      <div
                        style={{
                          backgroundColor: "#e6e9eb",
                          opacity: "0.3",
                          height: 1,
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      ></div>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => archiveData(element)}
                      >
                        <ShopOutlined
                          style={{ marginRight: "10px", marginLeft: 10 }}
                        />
                        Archive
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="TodoCards-Body flex-wrap py-1">
            <p className="w-50 value">
              {!element.companyName ? "-" : element.companyName}
            </p>
            <p className="w-50 value">
              {!element.opportunityName ? "-" : element.opportunityName}
            </p>
            <p className="w-50 term">Client Name</p>
            <p className="w-50 term">Company Name</p>
          </div>
          <div className="TodoCards-Body">
            <div
              className="TodoCard-Body-CheckBox todoCard-mr15"
              onClick={() => removListFromToDo(element, index)}
            >
              <img
                src={element.icon}
                className="archive-trueCheckBox"
                alt="trueCheckBox"
              />
            </div>
            <p
              style={{
                textDecorationLine: element.textOverLine.textDecorationLine,
              }}
            >
              {element.content}
            </p>
          </div>
          <div className="Todo-Footer">
            <p style={{ textTransform: "capitalize", fontWeight: "bolder" }}>
              {element.ownername}
            </p>
            <button
              style={{
                textTransform: "capitalize",
                backgroundColor: element.priorityIndicatorColor,
              }}
            >
              {element.taskPriority}
            </button>
            {element.searchdata.length !== 0 && (
              <p
                style={{ color: "#00acc1" }}
                onClick={() => memberRemarks(index)}
              >
                {element.showMemText}
              </p>
            )}
          </div>
          <div style={{ backgroundColor: "#C1C8CC", height: 1 }}></div>
          {element.showMemberRemark === true && (
            <>
              {element.searchdata.map((data, ind) => {
                return (
                  <div>
                    {element.taskOwner_id === loginUserID ? (
                      <div className="TodoCard-Footer">
                        <div className="TodoCard-Footer-Main">
                          <span style={{ marginBottom: 10 }}>
                            Submited by :
                            <p
                              style={{
                                color: "#5ea5c0",
                                marginBottom: 0,
                                marginLeft: 5,
                              }}
                            >
                              {data.FullName}
                            </p>
                          </span>
                          <div>
                            <Input
                              disabled={true}
                              value={data.remarkText}
                              type="text"
                              placeholder="Enter Remark"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="TodoCard-Footer">
                        {data._Id == loginUserID && (
                          <div className="TodoCard-Footer-Main">
                            <div>
                              <p style={{ marginBottom: 3, fontSize: 13 }}>
                                Please enter the remark before ticking the
                                checkbox
                              </p>
                            </div>
                            <div>
                              {data.remarkData == "" ? (
                                <Input
                                  type="text"
                                  placeholder="Enter Remark"
                                  onChange={(e) =>
                                    setRemarkDataEnt(e.target.value)
                                  }
                                />
                              ) : (
                                <div
                                  style={{
                                    border: "1px solid #C1C8CC",
                                    padding: 4,
                                  }}
                                >
                                  <p
                                    style={{
                                      color: "grey",
                                      fontSize: 12,
                                      marginBottom: 0,
                                    }}
                                  >
                                    {!data.remarkData ? "-" : data.remarkData}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: 10,
                              }}
                            >
                              <Button
                                disabled={data.disableSubmit}
                                // size="small"
                                onClick={() =>
                                  submitRemark(index, remarkDataEnt, data._Id)
                                }
                                type="primary"
                                style={{
                                  backgroundColor: "#E46A25",
                                  borderRadius: 3,
                                  border: "none",
                                }}
                              >
                                Submit
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      );
    });
  };
  return (
    <div className="site-card-border-less-wrapper">
      {showData === true && (
        <div>
          <div>{fetchTodo()}</div>

          <div className="TodoCard-Pagenation">
            <div className="Pagenation-Content">
              <p className="Pagenation-RecordsData">
                Showing {fval} to {sval}
              </p>
              <p className="Pagenation-OutOfData">
                Out of {totolDataCount} records
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Pagination
                showSizeChanger={false}
                pageSize={5}
                current={current}
                total={totolDataCount}
                // showTotal={(total,range) => onChangeTotal(total,range)}
                onChange={onChangePagination}
              />
            </div>
          </div>
        </div>
      )}

      {showData === false && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 50,
          }}
        >
          <img src={noDataIcon} style={{ height: 150, width: 100 }} />
          <div style={{ marginTop: 10 }}>
            <text style={{ textAlign: "center", fontSize: 14 }}>
              {" "}
              No records found{" "}
            </text>
          </div>
        </div>
      )}
      <TodoTab
        getTodoData={getTodoData}
        button={"Update"}
        editData={updateData}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </div>
  );
});

export default TodoCards;
