import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import { MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import "./index.css";
import commentIcon from "../../icons/comment.png";
import EventCreateButton from "../EventCreateButton/EventCreateButton";
import "../DataField/DataField.css";
import { Col, Row } from "antd";
import { FormOutlined, MessageOutlined } from "@ant-design/icons";

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

const Index = ({
  Remove,
  CurentOrPast,
  pastData,
  teamPast,
  pastDataln,
  teampastData,
}) => {
  const [Self, setSelf] = useState(true);
  const [Teamdata, setTeamData] = useState(true);
  const [Team, setTeam] = useState(true);
  CurentOrPast(Self);
  const [timeList, setTimeList] = useState([
    {
      dispValue: "8:00 AM",
      value: "28800000",
    },
    {
      dispValue: "8:30 AM",
      value: "30600000",
    },
    {
      dispValue: "9:00 AM",
      value: "32400000",
    },
    {
      dispValue: "9:30 AM",
      value: "34200000",
    },
    {
      dispValue: "10:00 AM",
      value: "36000000",
    },
    {
      dispValue: "10:30 AM",
      value: "37800000",
    },
    {
      dispValue: "11:00 AM",
      value: "39600000",
    },
    {
      dispValue: "11:30 AM",
      value: "41400000",
    },
    {
      dispValue: "12:00 PM",
      value: "43200000",
    },
    {
      dispValue: "12:30 PM",
      value: "45000000",
    },
    {
      dispValue: "1:00 PM",
      value: "46800000",
    },
    {
      dispValue: "1:30 PM",
      value: "48600000",
    },
    {
      dispValue: "2:00 PM",
      value: "50400000",
    },
    {
      dispValue: "2:30 PM",
      value: "52200000",
    },
    {
      dispValue: "3:00 PM",
      value: "54000000",
    },
    {
      dispValue: "3:30 PM",
      value: "55800000",
    },
    {
      dispValue: "4:00 PM",
      value: "57600000",
    },
    {
      dispValue: "4:30 PM",
      value: "59400000",
    },
    {
      dispValue: "5:00 PM",
      value: "61200000",
    },
    {
      dispValue: "5:30 PM",
      value: "63000000",
    },
    {
      dispValue: "6:00 PM",
      value: "64800000",
    },
    {
      dispValue: "6:30 PM",
      value: "66600000",
    },
    {
      dispValue: "7:00 PM",
      value: "68400000",
    },
    {
      dispValue: "7:30 PM",
      value: "70200000",
    },
    {
      dispValue: "8:00 PM",
      value: "72000000",
    },
    {
      dispValue: "8:30 PM",
      value: "73800000",
    },
    {
      dispValue: "9:00 PM",
      value: "75600000",
    },
    {
      dispValue: "9:30 PM",
      value: "77400000",
    },
  ]);

  const showModal = (e) => {
    setIsModalVisible(true);
    setEditData(e);
    // setIsModalVisible({
    //   check:true,
    //   Data:e
    // });
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editData, setEditData] = useState({});

  const [windowWidth, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;

  useEffect(() => {
    console.log(Remove, "remove----->");
    if (Remove == false) {
      setTeam(false);
    }
  }, [Remove]);
  useEffect(() => {
    console.log(pastDataln, "cur data for past<<<<<<<");
  }, []);

  const dateFun = (time) => {
    // var dt = new Date(time);
    // var hours = dt.getUTCHours() ; // gives the value in 24 hours format
    // var AmOrPm = hours >= 12 ? 'PM' : 'AM';
    // hours = (hours % 12) || 12;
    // var minutes = dt.getUTCMinutes() ;
    // var finalTime = hours + ":" + (minutes == 0 ?"00":"00")+ "  "+AmOrPm;
    // console.log(time, 'time------->entry-->')
    let finalTimeobj = timeList.filter((item) => {
      return item.value == time;
    });
    // console.log(finalTimeobj, 'obj time---->')
    let finalTime = finalTimeobj[0].dispValue;
    // console.log(finalTime, 'val time---->')
    return finalTime;
  };

  const historyEvent = "Hide all past events for the month";
  return (
    <div>
      <div className="PastFuture">
        {Self ? (
          <div className="pastEvent">
            <span style={{ padding: "0px" }}>
              AM
              {/* {pastData?.length == 0 ? '0' : teampastData?.length == 0 ? '0' : pastDataln ? pastDataln : teamPast } */}
              <span className="pastEventChange">(Till 11:59 am)</span>
            </span>
          </div>
        ) : (
          <Typography>{historyEvent}</Typography>
        )}

        {/* {console.log(pastData?.length, ' circle plus-->')} */}
        {/* {pastData?.length == 0 || teampastData?.length == 0 ?  "" : (Team ?
        Self ? (
          <PlusCircleFilled
            style={{ fontSize: "20px", marginRight: "7px", marginTop : 5 }}
            onClick={(e) => {
              setSelf(false);
            }}
          />
        ) : (
          <MinusCircleFilled
            style={{ fontSize: "20px", marginRight: "7px", marginTop : 5 }}
            onClick={(e) => {
              // console.log(e);
              setSelf(true);
            }}
          />
        ): (
          ""
        )
      ) 
      } */}

        {/* {pastData?.length == 0 || teampastData?.length == 0 ?  "" : (Team == false ? (
        Teamdata ? (
          <PlusCircleFilled
            style={{ fontSize: "20px", marginRight: "7px",marginTop : 5 }}
            onClick={(e) => {
              setTeamData(false);
            }}
          />
        ) : (
          <MinusCircleFilled
            style={{ fontSize: "20px", marginRight: "7px",marginTop : 5 }}
            onClick={(e) => {
              // console.log(e);
              setTeamData(true);
            }}
          />
        )
      ) : (
        ""
      )
      )
    } */}
      </div>
      <div>
        {Self == false ? (
          <div className="dataField">
            {windowWidth > breakpoint && pastData?.length > 0 ? (
              pastData?.map((element, index) => {
                return (
                  <div className="dataField-Card" key={index}>
                    {/* {
            ((1 + new Date(element.start_time_MS).getDate()) >= (1 + new Date().getDate())) 
            && element== pastData?.filter((element,index,arr)=>((new Date(element?.start_time_MS).getDate()+1) >=(1 + new Date().getDate()) 
            && (1+ new Date(element?.start_time_MS).getMonth()) >= (1+new Date().getMonth())))[0]
            ?
              <div className='head-cad-text'>
                <p>UPCOMING</p>
              </div>:""
            } */}
                    <div className="dataContainer">
                      <div className="bodyData">
                        <div className="bodyData-Date">
                          <p>
                            {new Date(element.start_time_MS).getDate() == 1 ||
                            new Date(element.start_time_MS).getDate() == 21 ||
                            new Date(element.start_time_MS).getDate() == 31
                              ? new Date(element.start_time_MS).getDate() + "st"
                              : new Date(element.start_time_MS).getDate() ==
                                  2 ||
                                new Date(element.start_time_MS).getDate() == 22
                              ? new Date(element.start_time_MS).getDate() + "nd"
                              : new Date(element.start_time_MS).getDate() ==
                                  3 ||
                                new Date(element.start_time_MS).getDate() == 23
                              ? new Date(element.start_time_MS).getDate() + "rd"
                              : new Date(element.start_time_MS).getDate() +
                                "th"}
                            <span>
                              {
                                [
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
                                ][0][
                                  1 + new Date(element.start_date).getMonth()
                                ]
                              }
                            </span>
                          </p>

                          <p>
                            {
                              [
                                {
                                  1: "Sun",
                                  2: "Mon",
                                  3: "Tue",
                                  4: "Wed",
                                  5: "Thu",
                                  6: "Fri",
                                  7: "Sat",
                                },
                              ][0][1 + new Date(element.start_time_MS).getDay()]
                            }
                          </p>
                        </div>
                        <div
                          className="TimeToEnd"
                          style={{ fontWeight: "bold" }}
                        >
                          <Typography>{dateFun(element.start_time)}</Typography>
                          <Typography style={{ padding: "5px 0" }}>
                            To
                          </Typography>
                          <Typography>{dateFun(element.end_time)}</Typography>
                        </div>
                        <div className="bodyData-centerContent">
                          <div className="Event-CenterBody">
                            <div className="Event-Type-Name">
                              <div className="EventType">
                                <Typography>Event Type</Typography>
                                <Typography>{element.event_type}</Typography>
                              </div>
                              <div className="EventName-Description">
                                <Typography>Event Name</Typography>
                                <Typography>
                                  {element.event_description}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bodyData-side">
                          <Typography
                            className={`closeOpen ${
                              element.statusType == "open" ? "Open" : "Close"
                            }`}
                          >
                            {element.statusType}
                          </Typography>
                          <FormOutlined onClick={() => showModal(element)} />
                        </div>
                      </div>
                      <div className="footer">
                        {element.remarkHistory?.length > 0 ? (
                          <Typography>
                            <img src={commentIcon} className="footerPng" />
                            {element.remarkHistory.map((element) => {
                              return element.remark;
                            })}
                          </Typography>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : windowWidth < breakpoint && pastData?.length > 0 ? (
              pastData?.map((element, index) => {
                return (
                  <div className="dataField-Card-mbl" key={index}>
                    {/* {
                ((1 + new Date(element.start_time_MS).getDate()) >= (1 + new Date().getDate())) 
                && element== pastData?.filter((element,index,arr)=>((new Date(element?.start_time_MS).getDate()+1) >=(1 + new Date().getDate()) 
                && (1+ new Date(element?.start_time_MS).getMonth()) >= (1+new Date().getMonth())))[0]
                ?
                  <div className='head-cad-text'>
                    <p>UPCOMING</p>
                  </div>:""
                } */}
                    <Row>
                      <Col sm={22} xs={22} md={22}>
                        <div className="TimeToEnd-mbl">
                          <Row>
                            <Typography style={{ fontWeight: "bold" }}>
                              {dateFun(element.start_time_MS)} To{" "}
                              {dateFun(element.end_time_MS)}
                            </Typography>
                          </Row>
                        </div>
                      </Col>
                      <Col sm={2} xs={2} md={2}>
                        <FormOutlined onClick={() => showModal(element)} />
                      </Col>
                    </Row>
                    {/* <Row>
                                <Col sm={24} md={24} xs={24}>
                                <Typography className='Event-CenterBody-BranchName'>
                                  {element.branchCodeId?.branchName} ({element.branchCodeId?.branchCode})
                                </Typography>
                                </Col>
                              </Row> */}

                    <Row>
                      <Col sm={7} xs={7} md={7}>
                        <div
                          className="bodyData-Date"
                          style={{ paddingTop: 15, paddingBottom: 15 }}
                        >
                          <p>
                            {new Date(element.start_time_MS).getDate() == 1 ||
                            new Date(element.start_time_MS).getDate() == 21 ||
                            new Date(element.start_time_MS).getDate() == 31
                              ? new Date(element.start_time_MS).getDate() + "st"
                              : new Date(element.start_time_MS).getDate() ==
                                  2 ||
                                new Date(element.start_time_MS).getDate() == 22
                              ? new Date(element.start_time_MS).getDate() + "nd"
                              : new Date(element.start_time_MS).getDate() ==
                                  3 ||
                                new Date(element.start_time_MS).getDate() == 23
                              ? new Date(element.start_time_MS).getDate() + "rd"
                              : new Date(element.start_time_MS).getDate() +
                                "th"}
                            <span>
                              {
                                [
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
                                ][0][
                                  1 + new Date(element.start_date).getMonth()
                                ]
                              }
                            </span>
                          </p>
                          <p>
                            {
                              [
                                {
                                  1: "Sun",
                                  2: "Mon",
                                  3: "Tue",
                                  4: "Wed",
                                  5: "Thu",
                                  6: "Fri",
                                  7: "Sat",
                                },
                              ][0][1 + new Date(element.start_time_MS).getDay()]
                            }
                          </p>
                        </div>
                      </Col>
                      <Col sm={17} xs={17} md={17}>
                        <Row>
                          <Col sm={15} xs={15} md={15}>
                            <Typography
                              style={{ fontSize: "12px", fontWeight: "bold" }}
                            >
                              Event Type
                            </Typography>
                            <Typography
                              style={{
                                fontSize: "12px",
                                color: "rgb(150, 153, 153)",
                              }}
                            >
                              {element.event_type}
                            </Typography>
                          </Col>
                          <Col sm={9} xs={9} md={9}>
                            <div className="bodyData-side">
                              <Typography
                                style={{ fontSize: 12, fontWeight: "bold" }}
                                className={`closeOpen ${
                                  element.statusType == "open"
                                    ? "Open"
                                    : "Close"
                                }`}
                              >
                                {element.statusType}
                              </Typography>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Typography
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          >
                            Event Name
                          </Typography>
                          <Typography
                            style={{
                              color: "rgb(150, 153, 153)",
                              fontSize: "12px",
                            }}
                          >
                            {element.event_description}
                          </Typography>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <div className="footer">
                        {element.remarkHistory?.length > 0 ? (
                          <Typography>
                            <img src={commentIcon} className="footerPng" />
                            {element.remarkHistory.map((element) => {
                              return element.remark;
                            })}
                          </Typography>
                        ) : (
                          ""
                        )}
                      </div>
                    </Row>
                    <hr style={{ marginTop: 10, marginBottom: 10 }} />
                  </div>
                );
              })
            ) : (
              <EventCreateButton api={"getFunc"} />
            )}
          </div>
        ) : (
          ""
        )}

        {Teamdata == false ? (
          <div className="dataField">
            {windowWidth > breakpoint && teampastData?.length > 0 ? (
              teampastData?.map((element, index) => {
                return (
                  <div className="dataField-Card" key={index}>
                    {/* {
            ((1 + new Date(element.start_time_MS).getDate()) >= (1 + new Date().getDate())) 
            && element== teampastData?.filter((element,index,arr)=>((new Date(element?.start_time_MS).getDate()+1) >=(1 + new Date().getDate()) 
            && (1+ new Date(element?.start_time_MS).getMonth()) >= (1+new Date().getMonth())))[0]
            ?
              <div className='head-cad-text'>
                <p>UPCOMING</p>
              </div>:""
            } */}
                    <div className="dataContainer">
                      <div className="bodyData">
                        <div className="bodyData-Date">
                          <p>
                            {new Date(element.start_time_MS).getDate() == 1 ||
                            new Date(element.start_time_MS).getDate() == 21 ||
                            new Date(element.start_time_MS).getDate() == 31
                              ? new Date(element.start_time_MS).getDate() + "st"
                              : new Date(element.start_time_MS).getDate() ==
                                  2 ||
                                new Date(element.start_time_MS).getDate() == 22
                              ? new Date(element.start_time_MS).getDate() + "nd"
                              : new Date(element.start_time_MS).getDate() ==
                                  3 ||
                                new Date(element.start_time_MS).getDate() == 23
                              ? new Date(element.start_time_MS).getDate() + "rd"
                              : new Date(element.start_time_MS).getDate() +
                                "th"}
                            <span>
                              {
                                [
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
                                ][0][
                                  1 + new Date(element.start_date).getMonth()
                                ]
                              }
                            </span>
                          </p>

                          <p>
                            {
                              [
                                {
                                  1: "Sun",
                                  2: "Mon",
                                  3: "Tue",
                                  4: "Wed",
                                  5: "Thu",
                                  6: "Fri",
                                  7: "Sat",
                                },
                              ][0][1 + new Date(element.start_time_MS).getDay()]
                            }
                          </p>
                        </div>
                        <div
                          className="TimeToEnd"
                          style={{ fontWeight: "bold" }}
                        >
                          <Typography>{dateFun(element.start_time)}</Typography>
                          <Typography style={{ padding: "5px 0" }}>
                            To
                          </Typography>
                          <Typography>{dateFun(element.end_time)}</Typography>
                        </div>
                        <div className="bodyData-centerContent">
                          <div className="Event-CenterBody">
                            <div className="Event-Type-Name">
                              <div className="EventType">
                                <Typography>Event Type</Typography>
                                <Typography>{element.event_type}</Typography>
                              </div>
                              <div className="EventName-Description">
                                <Typography>Event Name</Typography>
                                <Typography>
                                  {element.event_description}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bodyData-side">
                          <Typography
                            className={`closeOpen ${
                              element.statusType == "open" ? "Open" : "Close"
                            }`}
                          >
                            {element.statusType}
                          </Typography>
                          <FormOutlined onClick={() => showModal(element)} />
                        </div>
                      </div>
                      <div className="footer">
                        {element.remarkHistory?.length > 0 ? (
                          <Typography>
                            <img src={commentIcon} className="footerPng" />
                            {element.remarkHistory.map((element) => {
                              return element.remark;
                            })}
                          </Typography>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : windowWidth < breakpoint && teampastData?.length > 0 ? (
              teampastData?.map((element, index) => {
                return (
                  <div className="dataField-Card-mbl" key={index}>
                    {/* {
                ((1 + new Date(element.start_time_MS).getDate()) >= (1 + new Date().getDate())) 
                && element== teampastData?.filter((element,index,arr)=>((new Date(element?.start_time_MS).getDate()+1) >=(1 + new Date().getDate()) 
                && (1+ new Date(element?.start_time_MS).getMonth()) >= (1+new Date().getMonth())))[0]
                ?
                  <div className='head-cad-text'>
                    <p>UPCOMING</p>
                  </div>:""
                } */}
                    <Row>
                      <Col sm={22} xs={22} md={22}>
                        <div className="TimeToEnd-mbl">
                          <Row>
                            <Typography style={{ fontWeight: "bold" }}>
                              {dateFun(element.start_time_MS)} To{" "}
                              {dateFun(element.end_time_MS)}
                            </Typography>
                          </Row>
                        </div>
                      </Col>
                      <Col sm={2} xs={2} md={2}>
                        <FormOutlined onClick={() => showModal(element)} />
                      </Col>
                    </Row>
                    {/* <Row>
                                <Col sm={24} md={24} xs={24}>
                                <Typography className='Event-CenterBody-BranchName'>
                                  {element.branchCodeId?.branchName} ({element.branchCodeId?.branchCode})
                                </Typography>
                                </Col>
                              </Row> */}

                    <Row>
                      <Col sm={7} xs={7} md={7}>
                        <div
                          className="bodyData-Date"
                          style={{ paddingTop: 15, paddingBottom: 15 }}
                        >
                          <p>
                            {new Date(element.start_time_MS).getDate() == 1 ||
                            new Date(element.start_time_MS).getDate() == 21 ||
                            new Date(element.start_time_MS).getDate() == 31
                              ? new Date(element.start_time_MS).getDate() + "st"
                              : new Date(element.start_time_MS).getDate() ==
                                  2 ||
                                new Date(element.start_time_MS).getDate() == 22
                              ? new Date(element.start_time_MS).getDate() + "nd"
                              : new Date(element.start_time_MS).getDate() ==
                                  3 ||
                                new Date(element.start_time_MS).getDate() == 23
                              ? new Date(element.start_time_MS).getDate() + "rd"
                              : new Date(element.start_time_MS).getDate() +
                                "th"}
                            <span>
                              {
                                [
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
                                ][0][
                                  1 + new Date(element.start_date).getMonth()
                                ]
                              }
                            </span>
                          </p>
                          <p>
                            {
                              [
                                {
                                  1: "Sun",
                                  2: "Mon",
                                  3: "Tue",
                                  4: "Wed",
                                  5: "Thu",
                                  6: "Fri",
                                  7: "Sat",
                                },
                              ][0][1 + new Date(element.start_time_MS).getDay()]
                            }
                          </p>
                        </div>
                      </Col>
                      <Col sm={17} xs={17} md={17}>
                        <Row>
                          <Col sm={15} xs={15} md={15}>
                            <Typography
                              style={{ fontSize: "12px", fontWeight: "bold" }}
                            >
                              Event Type
                            </Typography>
                            <Typography
                              style={{
                                fontSize: "12px",
                                color: "rgb(150, 153, 153)",
                              }}
                            >
                              {element.event_type}
                            </Typography>
                          </Col>
                          <Col sm={9} xs={9} md={9}>
                            <div className="bodyData-side">
                              <Typography
                                style={{ fontSize: 12, fontWeight: "bold" }}
                                className={`closeOpen ${
                                  element.statusType == "open"
                                    ? "Open"
                                    : "Close"
                                }`}
                              >
                                {element.statusType}
                              </Typography>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Typography
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          >
                            Event Name
                          </Typography>
                          <Typography
                            style={{
                              color: "rgb(150, 153, 153)",
                              fontSize: "12px",
                            }}
                          >
                            {element.event_description}
                          </Typography>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <div className="footer">
                        {element.remarkHistory?.length > 0 ? (
                          <Typography>
                            <img src={commentIcon} className="footerPng" />
                            {element.remarkHistory.map((element) => {
                              return element.remark;
                            })}
                          </Typography>
                        ) : (
                          ""
                        )}
                      </div>
                    </Row>
                    <hr style={{ marginTop: 10, marginBottom: 10 }} />
                  </div>
                );
              })
            ) : (
              <EventCreateButton api={"getFunc"} />
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Index;
