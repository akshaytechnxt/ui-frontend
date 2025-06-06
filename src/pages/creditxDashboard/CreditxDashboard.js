import React, { useState, useEffect } from "react";
import { Row, Col, Form, Image, Spin, FloatButton } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { LeftOutlined, RightOutlined, PlusOutlined, CalculatorOutlined, CalendarOutlined } from "@ant-design/icons";
import SdWidgetCom from "../widget/SdWidgetCom";
import note from "../../assets/image/note.png";
import size from "../../assets/image/size.png";
import questions from "../../assets/image/message-question.png";
import tasksquare from "../../assets/image/task-square.png";
import noteFav from "../../assets/image/note-favorite.png";
import resource from "../../assets/image/task-square.png";
import noData from "../../assets/image/nodataavailable.svg";
import addSquare from "../../assets/image/add-square.png";
import TodoListItem from "../creditxComponents/TodoListItem/TodoListItem";
import { resetProposalState } from "../../state/slices/proposalSlice";
import { resetProposalAllState } from "../../state/slices/getAllProposalSlice";
import { resetDocumentData } from "../../state/slices/applicantDetailsSlice";
import { resetEntityDocumentData } from "../../state/slices/entityDocuments";
import { setLoader } from "../../state/slices/loader";
import NewApplication from "../reward-corner/NewApplication";
import EmiCalculatorModal from "../reward-corner/EmiCalculatorModal";
import Sdloader from "../../components/Loader/FullPageLoader";
import "./creditxDashboard.css";
import "../loanApplication/LoanApplication.css";
import mockUserService from "../../services/mockUserService";

const CreditxDashboard = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState(0);
  const [date, setDate] = useState("");
  const [logintime, setLogintime] = useState("");
  
  // Initialize with mock data
  const [countData, setCountData] = useState({
    disbursed: 5,
    inProgress: 8,
    rejected: 3,
    sanctioned: 4,
  });
  
  const [collectionCount, setCollectionCount] = useState({
    count: {
      Active: 12,
      Upcoming: 7,
      Overdue: 3
    },
    data: [
      {
        proposalId: "PROP001",
        message: "Monthly EMI payment due for Loan #L12345",
        amount: "₹25,000",
        dueDate: "2024-03-15"
      },
      {
        proposalId: "PROP002",
        message: "Quarterly payment pending for Loan #L12346",
        amount: "₹75,000",
        dueDate: "2024-03-20"
      },
      {
        proposalId: "PROP003",
        message: "Final payment due for Loan #L12347",
        amount: "₹50,000",
        dueDate: "2024-03-25"
      }
    ]
  });
  
  const [queryCount, setQueryCount] = useState({
    pending: 6,
    resolved: 15
  });

  const [totalCount, setTotalCount] = useState(20);
  const [dropdownData, setDropdownData] = useState("7");
  const [pendingQueriesList, setPendingQueriesList] = useState([
    {
      proposalId: "PROP004",
      description: "Additional documents required for income proof",
      status: "Pending",
      date: "2024-03-10"
    },
    {
      proposalId: "PROP005",
      description: "Bank statement verification pending",
      status: "Pending",
      date: "2024-03-11"
    },
    {
      proposalId: "PROP006",
      description: "Property documents need verification",
      status: "Pending",
      date: "2024-03-12"
    }
  ]);
  const [activityResponse, setActivityResponse] = useState([
    {
      agenda: "Loan Disbursement Meeting",
      meetingStartTime: "10:00 AM",
      meetingEndTime: "11:00 AM",
      mode: "Online",
      location: "Virtual",
      meetingLocation: "Zoom"
    },
    {
      agenda: "Document Verification",
      meetingStartTime: "02:00 PM",
      meetingEndTime: "03:00 PM",
      mode: "Offline",
      location: "Branch",
      meetingLocation: "Main Branch"
    }
  ]);
  const [activityLoader, setActivityLoader] = useState(false);
  const [isEmiModalVisible, setIsEmiModalVisible] = useState(false);
  const [isNewApplicationModalVisible, setIsNewApplicationModalVisible] = useState(false);
  const [value, setValue] = useState(1);
  const [checkingEligible, setCheckingEligible] = useState("");
  const [contentTrue, setContentTrue] = useState(true);
  const [checkEligibility, setCheckEligibility] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showErrorPage, setShowErrorPage] = useState(false);

  const [demoApplication, setDemoApplication] = useState({
    id: "DEMO001",
    name: "John Doe",
    amount: "₹5,00,000",
    purpose: "Home Renovation",
    status: "In Progress",
    currentStep: "Basic Details",
    nextStep: "Loan Details",
    lastUpdated: "2024-03-12"
  });

  useEffect(() => {
    dispatch(resetProposalState());
    dispatch(resetProposalAllState());
    dispatch(resetDocumentData());
    dispatch(resetEntityDocumentData());
  }, []);

  const [startDate, setStartDate] = useState(moment().startOf("week"));
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedNewDate, setSelectedNewDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (process.env.NODE_ENV === 'development') {
        const mockData = await mockUserService.getUserData();
        setData(mockData);
        setLoading(false);
      } else {
        // Use actual API call in production
        // const response = await userService.getUserData();
        // setData(response);
        // setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeInSeconds(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (data?.userData?.data?.data?.user?.lastLogin) {
      const lastLoginDate = new Date(data.userData.data.data.user.lastLogin);
      setDate(lastLoginDate.toLocaleDateString());
      setLogintime(lastLoginDate.toLocaleTimeString());
    }
  }, [data]);

  const handleNextWeek = () => {
    setStartDate(moment(startDate).add(1, "week"));
  };

  const handlePrevWeek = () => {
    setStartDate(moment(startDate).subtract(1, "week"));
  };

  const handleDayClick = (day) => {
    setSelectedDate(day?._d);
    setSelectedNewDate(moment(day?._d).format("YYYY-MM-DD"));
  };

  const handleEmiCalculatorClick = () => {
    setIsEmiModalVisible(true);
  };

  const handleNewApplicationClick = () => {
    setIsNewApplicationModalVisible(true);
  };

  const handleLoanEligibilityClick = () => {
    setCheckEligibility(true);
  };

  const handleEmiModalCancel = () => {
    setIsEmiModalVisible(false);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const getGreeting = (currentTimeInSeconds) => {
    const hour = new Date(currentTimeInSeconds * 1000).getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const day = moment(startDate).startOf("week").add(i, "days");
    daysOfWeek.push(day);
  }

  const handleDemoUpdate = () => {
    const steps = [
      { current: "Basic Details", next: "Loan Details" },
      { current: "Loan Details", next: "Income Details" },
      { current: "Income Details", next: "Employment Details" },
      { current: "Employment Details", next: "Bank Details" },
      { current: "Bank Details", next: "Document Upload" },
      { current: "Document Upload", next: "Review & Submit" }
    ];

    const currentIndex = steps.findIndex(step => step.current === demoApplication.currentStep);
    const nextIndex = (currentIndex + 1) % steps.length;

    setDemoApplication(prev => ({
      ...prev,
      currentStep: steps[nextIndex].current,
      nextStep: steps[nextIndex].next,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  return (
    <>
      {loading && <Sdloader sdloader={loading} />}
      <div className="top_header_dashboard">
        <div className="main_container">
          <div className="wrapper_text">
            <div className="greeting">{getGreeting(currentTimeInSeconds)}</div>
            <div className="user">
              <div>{data?.userData?.data?.data?.user?.firstName}</div>&nbsp;
              <div>{data?.userData?.data?.data?.user?.lastName}</div>
            </div>
            <div style={{ display: "flex" }} className="login_details">
              Last Login : {date} | {logintime}
              <div style={{ marginLeft: 5 }}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="main_content_dashboard">
        <div className="main_container">
          <Row
            className="widget_row"
            gutter={[16, { xs: 16, sm: 16, md: 16, lg: 16 }]}
            justify={"center"}
          >
            <Col className="col_widget">
              <SdWidgetCom
                headeColor={"#003399"}
                backgroundColorToDo={"#fff"}
                title_header="Loan Application"
                count={totalCount}
                headerImgSrc={note}
                toRoute="/Application-Listing"
              >
                <div
                  className="claims_body hScroll "
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "18px",
                  }}
                >
                  <div className="row w-100 text-center text-primary">
                    <div className="claim_count col border-right">
                      <div onClick={() => navigate("/Application-Listing", { state: "inProgress" })} className="number_count">
                        {countData?.inProgress}
                      </div>
                      <div>In Progress</div>
                    </div>
                    <div className="claim_count col">
                      <div onClick={() => navigate("/Application-Listing", { state: "sanctioned" })} className="number_count">
                        {countData?.sanctioned}
                      </div>
                      <div>Sanctioned</div>
                    </div>
                  </div>
                  <div className="row w-100 text-center text-primary">
                    <div className="claim_count col border-right">
                      <div onClick={() => navigate("/Application-Listing", { state: "disbursed" })} className="number_count">
                        {countData?.disbursed}
                      </div>
                      <div>Disbursed</div>
                    </div>
                    <div className="claim_count col">
                      <div onClick={() => navigate("/Application-Listing", { state: "rejected" })} className="number_count">
                        {countData?.rejected}
                      </div>
                      <div>Rejected</div>
                    </div>
                  </div>
                </div>
              </SdWidgetCom>
            </Col>
            <Col className="col_widget">
              <SdWidgetCom
                dropdownData={dropdownData}
                setDropdownData={setDropdownData}
                backgroundColorToDo={"#fff"}
                headeColor={"#003399"}
                title_header="Collection"
                headerImgSrc={size}
                toRoute="/Collection-Listing"
                dropdownValue={true}
              >
                <div
                  className="claims_body hScroll query_card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <Row className="row w-100 text-center text-primary">
                    <Col onClick={() => navigate("/Collection-Listing", { state: "active" })} span={8} className="claim_count border-right">
                      <div className="number_count">{collectionCount?.count?.Active || 0}</div>
                      <div style={{ color: "#003399" }}>Active</div>
                    </Col>
                    <Col onClick={() => navigate("/Collection-Listing", { state: "upcoming" })} span={8} className="claim_count border-right">
                      <div className="number_count1">{collectionCount?.count?.Upcoming || 0}</div>
                      <div style={{ color: "#FF8A00" }}>Upcoming</div>
                    </Col>
                    <Col onClick={() => navigate("/Collection-Listing", { state: "overdue" })} span={8} className="claim_count">
                      <div className="number_count2">{collectionCount?.count?.Overdue || 0}</div>
                      <div style={{ color: "#E34234" }}>Overdue</div>
                    </Col>
                  </Row>
                  <div className="scroll-dash">
                    {collectionCount?.data?.length > 0 ? (
                      collectionCount?.data?.map((item, index) => (
                        <div key={index} className="list_item_wrap">
                          <div className="list_item border-bottom">
                            <div className="list_text">
                              {item?.message}
                            </div>
                            <button onClick={() => navigate("/Collection-Listing/CollectionView", { state: item?.proposalId })} className="view_button">VIEW</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{padding:"20%",display:"flex",justifyContent:"center"}}>
                        <Image preview={false} src={noData}/>
                      </div>
                    )}
                  </div>
                  <div className="view_all">
                    <button onClick={() => navigate("/Collection-Listing")} className="view_all_button">VIEW ALL</button>
                  </div>
                </div>
              </SdWidgetCom>
            </Col>
            <Col className="col_widget">
              <SdWidgetCom
                backgroundColorToDo={"#fff"}
                headeColor={"#003399"}
                title_header={"Queries & Approvals"}
                headerImgSrc={questions}
                toRoute="/queries-approvals"
              >
                <div
                  className="claims_body hScroll query_card"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Row className="row w-100 text-center text-primary">
                    <Col span={12} className="claim_count border-right" onClick={() => navigate("/queries-approvals", { state: "Pending Queries" })}>
                      <div className="number_count">{queryCount?.pending}</div>
                      <div>Pending</div>
                    </Col>
                    <Col span={12} className="claim_count" onClick={() => navigate("/queries-approvals", { state: "Pending Approvals" })}>
                      <div className="number_count">{queryCount?.resolved}</div>
                      <div>Resolved</div>
                    </Col>
                  </Row>
                  <div className="scroll-dash">
                    {pendingQueriesList?.length > 0 ? (
                      pendingQueriesList?.map((item, index) => (
                        <div key={index} className="list_item_wrap">
                          <div className="list_item border-bottom">
                            <div className="list_text">
                              {item?.description}
                            </div>
                            <button onClick={() => navigate("/Application-Listing/Application", { state: { isPendingQueryList: true, proposalId: item?.proposalId } })} className="view_button">VIEW</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{padding:"20%",display:"flex",justifyContent:"center"}}>
                        <Image preview={false} src={noData}/>
                      </div>
                    )}
                  </div>
                  <div className="view_all">
                    <button onClick={() => navigate("/queries-approvals")} className="view_all_button">VIEW ALL</button>
                  </div>
                </div>
              </SdWidgetCom>
            </Col>
            <Col className="col_widget">
              <SdWidgetCom
                backgroundColorToDo={"#fff"}
                headeColor={"#003399"}
                title_header={"To Do"}
                headerImgSrc={tasksquare}
                toRoute="/Todo"
              >
                <div
                  className="claims_body hScroll to_do_card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div className="todo_list_item_wrap">
                    <TodoListItem />
                  </div>
                </div>
              </SdWidgetCom>
            </Col>
            <Col className="col_widget">
              <SdWidgetCom
                backgroundColorToDo={"#fff"}
                headeColor={"#003399"}
                title_header={"Activity Tracker"}
                headerImgSrc={noteFav}
                toRoute="/Calendar"
              >
                <div
                  className="claims_body hScroll activity_tracker_card"
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div className="calendor_wrapper">
                    <div className="week_selector_wrapper d-flex justify-content-between align-items-center">
                      <div
                        onClick={handlePrevWeek}
                        style={{ cursor: "pointer" }}
                      >
                        <LeftOutlined
                          style={{
                            width: 24,
                            height: 24,
                            color: "#003399",
                            fontSize: 24,
                          }}
                        />
                      </div>
                      <div className="weeks">
                        {startDate.format("MMM YY")}
                      </div>
                      <div
                        onClick={handleNextWeek}
                        style={{ cursor: "pointer" }}
                      >
                        <RightOutlined
                          style={{
                            width: 24,
                            height: 24,
                            color: "#003399",
                            fontSize: 24,
                          }}
                        />
                      </div>
                    </div>
                    <div className="weekdays d-flex justify-content-between">
                      {daysOfWeek.map((day) => (
                        <div
                          key={day.format("YYYY-MM-DD")}
                          className={`${selectedDate &&
                            moment(selectedDate).isSame(day, "day")
                            ? "active_day"
                            : "days"
                            }`}
                          onClick={() => handleDayClick(day)}
                        >
                          <div className="day">{day.format("ddd")}</div>
                          <div className="date">{day.format("DD")}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Spin className="spin-width" size="large" spinning={activityLoader}>
                    {activityResponse?.length > 0 ? (
                      <div className="activity_card_list_items">
                        {activityResponse?.map((item, index) => (
                          <div
                            key={index}
                            className="appointment_card_item"
                          >
                            <div className="appointment_card_header">
                              <div className="title">
                                <CalendarOutlined
                                  style={{
                                    color: "#003399",
                                    fontSize: 16,
                                  }}
                                />
                                <span className="title_text">
                                  {item?.agenda}
                                </span>
                              </div>
                              <div className="appointment_time">
                                {item?.meetingStartTime}-
                                {item?.meetingEndTime}
                              </div>
                            </div>
                            <Row style={{ textAlign: "center",width:"100%" }}>
                              <Col xl={8} md={8} lg={8} sm={8} xs={8}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "#003399",
                                    fontWeight: "bolder",
                                  }}
                                >
                                  Mode
                                </div>
                                <div style={{ fontSize: 12 }}>
                                  {item?.mode}
                                </div>
                              </Col>
                              <Col xl={8} md={8} lg={8} sm={8} xs={8}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "#003399",
                                    fontWeight: "bolder",
                                  }}
                                >
                                  Location
                                </div>
                                <div style={{ fontSize: 12 }}>
                                  {item?.location}
                                </div>
                              </Col>
                              <Col xl={8} md={8} lg={8} sm={8} xs={8}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "#003399",
                                    fontWeight: "bolder",
                                  }}
                                >
                                  Meeting Location
                                </div>
                                <div style={{ fontSize: 12 }}>
                                  {item?.meetingLocation}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{padding:"3%",display:"flex",justifyContent:"center"}}>
                        <Image style={{width:"70%",marginLeft:"20%"}} preview={false} src={noData}/>
                      </div>
                    )}
                  </Spin>
                </div>
              </SdWidgetCom>
            </Col>
            <Col className="col_widget">
              <SdWidgetCom
                backgroundColorToDo={"#fff"}
                headeColor={"#003399"}
                title_header={"Resources"}
                headerImgSrc={resource}
              >
                <div
                  className="claims_body hScroll resource_card"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Row className="w-100 text-center text-primary">
                    <Col span={8} className="p-0 border-right">
                      <div className="resource_card_item" onClick={handleLoanEligibilityClick}>
                        <div className="loan_eligibility_icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="30"
                            viewBox="0 0 32 30"
                            fill="none"
                          >
                            <path
                              d="M14.0541 24.8634H7.36213C2.71307 24.8634 1.53442 23.6233 1.53442 18.6769V7.09307C1.53442 2.61173 2.50356 1.17432 6.15733 0.948845C6.52402 0.934753 6.92997 0.920654 7.36213 0.920654H21.9117C26.5608 0.920654 27.7394 2.16077 27.7394 7.10716V13.3219"
                              stroke="#003399"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M30.4979 23.4553C30.4979 24.5122 30.2021 25.5127 29.6809 26.3583C28.709 27.993 26.9201 29.0922 24.8636 29.0922C22.807 29.0922 21.0182 27.993 20.0462 26.3583C19.5251 25.5127 19.2292 24.5122 19.2292 23.4553C19.2292 20.3409 21.7506 17.8184 24.8636 17.8184C27.9765 17.8184 30.4979 20.3409 30.4979 23.4553Z"
                              stroke="#003399"
                              stroke-width="1.5"
                              stroke-miterlimit="10"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M22.6631 23.8009L24.0039 25.5705L26.8888 22.0491"
                              stroke="#003399"
                              stroke-width="1.2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M15.8483 9.53058H8.68484C8.2924 9.53058 7.99741 9.85894 7.99741 10.2627C7.99741 10.6665 8.2924 10.9948 8.68484 10.9948H15.5766C15.1641 11.8135 14.3718 12.3554 13.4577 12.3554H8.68484C8.2924 12.3554 7.99741 12.6837 7.99741 13.0875C7.99741 13.4912 8.2924 13.8196 8.68484 13.8196H11.6843L16.2573 20.4727L16.2573 20.4727L16.2587 20.4746C16.4052 20.6773 16.6 20.7729 16.817 20.7729C16.9692 20.7729 17.0993 20.7251 17.2241 20.6356L17.2241 20.6357L17.2277 20.6328C17.5482 20.3799 17.5869 19.9254 17.3776 19.6101L17.3776 19.6101L17.3767 19.6088L13.4092 13.8393H13.4393C15.1348 13.8393 16.5485 12.6544 17.0388 11.0343H19.4053C19.7978 11.0343 20.0928 10.706 20.0928 10.3022C20.0928 9.9006 19.7998 9.57009 19.4237 9.57009H17.2244C17.1719 8.67591 16.8546 7.84844 16.3501 7.20212H19.4237C19.8161 7.20212 20.1111 6.87377 20.1111 6.47001C20.1111 6.06624 19.8161 5.73789 19.4237 5.73789H8.68484C8.30085 5.73789 7.99741 6.01805 7.99741 6.4305C7.99741 6.83426 8.2924 7.16261 8.68484 7.16261H13.4577C14.7052 7.16261 15.7471 8.20445 15.8483 9.53058Z"
                              fill="#003399"
                              stroke="#003399"
                              stroke-width="0.2"
                            />
                          </svg>
                        </div>
                        <div className="placeholder">Loan Eligibility</div>
                      </div>
                    </Col>
                    <Col span={8} className="p-0 border-right">
                      <div className="resource_card_item">
                        <div className="product_catelog_icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                          >
                            <path
                              d="M22.6667 17.8666V21.8666C22.6667 27.1999 20.5334 29.3333 15.2001 29.3333H10.1334C4.80008 29.3333 2.66675 27.1999 2.66675 21.8666V16.7999C2.66675 11.4666 4.80008 9.33325 10.1334 9.33325H14.1334"
                              stroke="#003399"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M22.6666 17.8666H18.4C15.2 17.8666 14.1333 16.7999 14.1333 13.5999V9.33325L22.6666 17.8666Z"
                              stroke="#003399"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M15.4666 2.66675H20.7999"
                              stroke="#003399"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M9.33325 6.66675C9.33325 4.45341 11.1199 2.66675 13.3333 2.66675H16.8266"
                              stroke="#003399"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M29.3333 10.6667V18.9201C29.3333 20.9867 27.6533 22.6667 25.5867 22.6667"
                              stroke="#003399"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M29.3333 10.6667H25.3333C22.3333 10.6667 21.3333 9.66675 21.3333 6.66675V2.66675L29.3333 10.6667Z"
                              stroke="#003399"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                        <div style={{ cursor: "pointer" }} onClick={() => navigate("/product-catalogue")} className="placeholder">Product Catalogue</div>
                      </div>
                    </Col>
                    <Col style={{ cursor: "pointer" }} onClick={handleEmiCalculatorClick} span={8} className="p-0">
                      <div className="resource_card_item">
                        <div className="emi_calculator_icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="33"
                            height="32"
                            viewBox="0 0 33 32"
                            fill="none"
                          >
                            <rect
                              x="4.08325"
                              y="2.08325"
                              width="25.1667"
                              height="27.8333"
                              rx="4.25"
                              stroke="#003399"
                              stroke-width="1.5"
                            />
                            <path
                              d="M23.6665 9.25V10.75C23.6665 11.98 22.6243 13 21.3332 13H11.9998C10.7243 13 9.6665 11.995 9.6665 10.75V9.25C9.6665 8.02 10.7087 7 11.9998 7H21.3332C22.6243 7 23.6665 8.005 23.6665 9.25Z"
                              stroke="#003399"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <circle
                              cx="11.9165"
                              cy="18.25"
                              r="1.25"
                              fill="#003399"
                            />
                            <circle
                              cx="16.6165"
                              cy="18.25"
                              r="1.25"
                              fill="#003399"
                            />
                            <circle
                              cx="21.4165"
                              cy="18.25"
                              r="1.25"
                              fill="#003399"
                            />
                            <circle
                              cx="11.9165"
                              cy="23.75"
                              r="1.25"
                              fill="#003399"
                            />
                            <circle
                              cx="16.6165"
                              cy="23.75"
                              r="1.25"
                              fill="#003399"
                            />
                            <circle
                              cx="21.4165"
                              cy="23.75"
                              r="1.25"
                              fill="#003399"
                            />
                          </svg>
                        </div>
                        <div className="placeholder">EMI calculator</div>
                      </div>
                    </Col>
                    <Col>
                      <FloatButton
                        shape="circle"
                        trigger="click"
                        style={{ right: 24 }}
                        icon={<PlusOutlined />}
                        tooltip={
                          <div
                            className="d-flex flex-column justify-content-around"
                            style={{ width: "100%", height: "100px" }}
                          >
                            <div
                              className="d-flex p-2"
                              onClick={handleNewApplicationClick}
                              style={{ cursor: "pointer" }}
                            >
                              <img src={addSquare} className="pr-2" />
                              <div className="tooltip-title">
                                Add New Application
                              </div>
                            </div>
                            <div
                              className="d-flex p-2"
                              onClick={handleEmiCalculatorClick}
                              style={{ cursor: "pointer" }}
                            >
                              <div className="tooltip-title">
                                <CalculatorOutlined
                                  className="pr-2"
                                  style={{ fontSize: "20px" }}
                                />
                                EMI Calculator
                              </div>
                            </div>
                          </div>
                        }
                      ></FloatButton>
                      <NewApplication
                        isVisible={isNewApplicationModalVisible}
                        checkEligibility={checkEligibility}
                        setCheckEligibility={setCheckEligibility}
                        showSuccessPage={showSuccessPage}
                        setShowSuccessPage={setShowSuccessPage}
                        showErrorPage={showErrorPage}
                        setShowErrorPage={setShowErrorPage}
                        checkingEligible={checkingEligible}
                        setIsNewApplicationModalVisible={setIsNewApplicationModalVisible}
                      />
                      <EmiCalculatorModal
                        checkEligibility={checkEligibility}
                        setCheckEligibility={setCheckEligibility}
                        showSuccessPage={showSuccessPage}
                        setShowSuccessPage={setShowSuccessPage}
                        showErrorPage={showErrorPage}
                        setShowErrorPage={setShowErrorPage}
                        resetModalVisible={handleEmiModalCancel}
                        contentTrue={contentTrue}
                        setContentTrue={setContentTrue}
                        resetFunction={handleEmiModalCancel}
                        isVisible={isEmiModalVisible}
                        form={form}
                        setIsEmiModalVisible={setIsEmiModalVisible}
                        onCancel={handleEmiModalCancel}
                        onChange={handleChange}
                        value={value}
                        checkingEligible={checkingEligible}
                        setIsNewApplicationModalVisible={setIsNewApplicationModalVisible}
                      />
                    </Col>
                  </Row>
                </div>
              </SdWidgetCom>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default CreditxDashboard;
