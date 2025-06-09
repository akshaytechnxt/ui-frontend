import React, { useState, useEffect } from "react";
import { 
  Row, 
  Col, 
  Form, 
  Image, 
  Spin, 
  FloatButton, 
  Card, 
  Typography, 
  Tag, 
  Statistic, 
  Progress, 
  List, 
  Avatar, 
  Checkbox, 
  Button, 
  Tabs,
  Calendar,
  Badge,
  Tooltip,
  Divider,
  Select
} from "antd";
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";
import { 
  LeftOutlined, 
  RightOutlined, 
  PlusOutlined, 
  CalculatorOutlined, 
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserOutlined,
  DollarOutlined,
  ApartmentOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BarsOutlined,
  CheckOutlined,
  FileSearchOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MailOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import note from "../../assets/image/note.png";
import size from "../../assets/image/size.png";
import questions from "../../assets/image/message-question.png";
import tasksquare from "../../assets/image/task-square.png";
import noteFav from "../../assets/image/note-favorite.png";
import resource from "../../assets/image/task-square.png";
import noData from "../../assets/image/nodataavailable.svg";
import addSquare from "../../assets/image/add-square.png";
import TodoListItem from "../lwsComponents/TodoListItem/TodoListItem";
import { resetProposalState } from "../../state/slices/proposalSlice";
import { resetProposalAllState } from "../../state/slices/getAllProposalSlice";
import { resetDocumentData } from "../../state/slices/applicantDetailsSlice";
import { resetEntityDocumentData } from "../../state/slices/entityDocuments";
import { setLoader } from "../../state/slices/loader";
import NewApplication from "../reward-corner/NewApplication";
import EmiCalculatorModal from "../reward-corner/EmiCalculatorModal";
import Sdloader from "../../components/Loader/FullPageLoader";
import "./lmsDashboard.css";
import "../loanApplication/LoanApplication.css";
import mockUserService from "../../services/mockUserService";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CreditxDashboard = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState(0);
  const [date, setDate] = useState("");
  const [logintime, setLogintime] = useState("");
  
  // Lead counts data
  const [leadCounts, setLeadCounts] = useState({
    newLeads: 15,
    inProgress: 8,
    approved: 6,
    disbursed: 5,
    rejected: 3,
    sanctioned: 4,
    pending: 9,
    closed: 7
  });
  
  // Collection counts data
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
  
  // Queries and approvals data
  const [queriesList, setQueriesList] = useState([
    {
      id: "Q001",
      proposalId: "PROP004",
      description: "Additional documents required for income proof",
      status: "Pending",
      date: "2024-03-10",
      priority: "High"
    },
    {
      id: "Q002",
      proposalId: "PROP005",
      description: "Bank statement verification pending",
      status: "Pending",
      date: "2024-03-11",
      priority: "Medium"
    },
    {
      id: "Q003",
      proposalId: "PROP006",
      description: "Property documents need verification",
      status: "Pending",
      date: "2024-03-12",
      priority: "Low"
    }
  ]);
  
  const [approvalsList, setApprovalsList] = useState([
    {
      id: "A001",
      proposalId: "PROP007",
      description: "Loan application #L123456 needs final approval",
      status: "Pending",
      date: "2024-03-13",
      customer: "John Doe"
    },
    {
      id: "A002",
      proposalId: "PROP008",
      description: "Credit line increase for customer John Doe",
      status: "Pending",
      date: "2024-03-14",
      customer: "Sarah Smith"
    },
    {
      id: "A003",
      proposalId: "PROP009",
      description: "EMI restructuring for customer Sarah Smith",
      status: "Pending",
      date: "2024-03-15",
      customer: "Michael Johnson"
    }
  ]);
  
  // Activity tracker data
  const [activities, setActivities] = useState([
    {
      id: 1,
      agenda: "Loan Disbursement Meeting",
      meetingStartTime: "10:00 AM",
      meetingEndTime: "11:00 AM",
      date: "2024-03-20",
      mode: "Online",
      location: "Virtual",
      meetingLocation: "Zoom"
    },
    {
      id: 2,
      agenda: "Document Verification",
      meetingStartTime: "02:00 PM",
      meetingEndTime: "03:00 PM",
      date: "2024-03-20",
      mode: "Offline",
      location: "Branch",
      meetingLocation: "Main Branch"
    },
    {
      id: 3,
      agenda: "Client Meeting - XYZ Corp",
      meetingStartTime: "11:00 AM",
      meetingEndTime: "12:00 PM",
      date: "2024-03-21",
      mode: "Online",
      location: "Virtual",
      meetingLocation: "Google Meet"
    }
  ]);
  
  // Todo tasks data
  const [todoTasks, setTodoTasks] = useState([
    {
      id: 1,
      description: "Follow up with John Doe regarding loan application",
      priority: "High",
      targetDate: "2024-03-20",
      completed: false
    },
    {
      id: 2,
      description: "Review credit report for Jane Smith",
      priority: "Medium",
      targetDate: "2024-03-21",
      completed: false
    },
    {
      id: 3,
      description: "Prepare proposal for corporate client XYZ Ltd",
      priority: "High",
      targetDate: "2024-03-22",
      completed: false
    },
    {
      id: 4,
      description: "Update customer database with new information",
      priority: "Low",
      targetDate: "2024-03-23",
      completed: false
    }
  ]);
  
  // Product list data
  const [productList, setProductList] = useState([
    {
      id: 1,
      name: "Personal Loan",
      interestRate: "10.5%",
      maxAmount: "₹10,00,000",
      tenure: "Up to 5 years",
      icon: <UserOutlined />
    },
    {
      id: 2,
      name: "Business Loan",
      interestRate: "12.0%",
      maxAmount: "₹50,00,000",
      tenure: "Up to 7 years",
      icon: <ApartmentOutlined />
    },
    {
      id: 3,
      name: "Home Loan",
      interestRate: "8.5%",
      maxAmount: "₹1,00,00,000",
      tenure: "Up to 20 years",
      icon: <HomeOutlined />
    }
  ]);
  
  // Performance metrics data
  const [performanceMetrics, setPerformanceMetrics] = useState({
    conversionRate: 68,
    processingTime: 3.2,
    monthlyTarget: 84,
    satisfaction: 4.7,
    history: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      conversionRate: [55, 60, 62, 65, 67, 68],
      processingTime: [4.8, 4.5, 4.0, 3.6, 3.4, 3.2],
      monthlyTarget: [60, 65, 70, 75, 80, 84],
      satisfaction: [4.2, 4.3, 4.4, 4.5, 4.6, 4.7]
    }
  });

  const [selectedDate, setSelectedDate] = useState(moment());
  const [activityLoader, setActivityLoader] = useState(false);
  const [isEmiModalVisible, setIsEmiModalVisible] = useState(false);
  const [isNewApplicationModalVisible, setIsNewApplicationModalVisible] = useState(false);
  const [value, setValue] = useState(1);
  const [checkingEligible, setCheckingEligible] = useState("");
  const [contentTrue, setContentTrue] = useState(true);
  const [checkEligibility, setCheckEligibility] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [selectedChart, setSelectedChart] = useState('conversion');

  useEffect(() => {
    dispatch(resetProposalState());
    dispatch(resetProposalAllState());
    dispatch(resetDocumentData());
    dispatch(resetEntityDocumentData());
  }, []);

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

  const handleCalendarSelect = (date) => {
    setSelectedDate(date);
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

  const handleTodoCheckboxChange = (id) => {
    setTodoTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#E34234';
      case 'Medium': return '#FF8A00';
      case 'Low': return '#68BA7F';
      default: return '#68BA7F';
    }
  };

  // Calendar dateCellRender function to show activities on calendar dates
  const dateCellRender = (value) => {
    const date = value.format('YYYY-MM-DD');
    const dateActivities = activities.filter(activity => 
      moment(activity.date).format('YYYY-MM-DD') === date
    );

    return (
      <ul className="calendar-event-list">
        {dateActivities.map(activity => (
          <li key={activity.id}>
            <Badge color="#68BA7F" text={activity.agenda} />
          </li>
        ))}
      </ul>
    );
  };

  // Get today's activities for the activity tracker
  const getTodayActivities = () => {
    const today = selectedDate.format('YYYY-MM-DD');
    return activities.filter(activity => 
      moment(activity.date).format('YYYY-MM-DD') === today
    );
  };

  const handleNewLeadsClick = () => {
    navigate("/Application-Listing", { state: "inProgress" });
  };
  
  const handleInProgressClick = () => {
    navigate("/Application-Listing", { state: "inProgress" });
  };
  
  const handleApprovedClick = () => {
    navigate("/Application-Listing", { state: "sanctioned" });
  };
  
  const handleDisbursedClick = () => {
    navigate("/Application-Listing", { state: "disbursed" });
  };

  return (
    <>
      {loading && <Sdloader sdloader={loading} />}
      
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <div className="greeting">{getGreeting(currentTimeInSeconds)}</div>
              <div className="user-name">
                <span>{data?.userData?.data?.data?.user?.firstName}</span>&nbsp;
                <span>{data?.userData?.data?.data?.user?.lastName}</span>
              </div>
              <div className="login-details">
                Last Login: {date} | {logintime}
              </div>
            </div>
            <div className="header-right">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                size="middle"
                onClick={handleNewApplicationClick}
                className="new-application-btn"
              >
                New Application
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="container">
          {/* FIRST ROW - Lead Count Cards */}
          <Row gutter={[16, 16]} className="dashboard-row">
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Card className="stat-card new-leads-card" bordered={false} onClick={handleNewLeadsClick}>
                <div className="stat-card-content">
                  <div className="stat-card-icon">
                    <FileTextOutlined />
                  </div>
                  <div className="stat-card-info">
                    <Text className="stat-card-title">New Leads</Text>
                    <Title level={2} className="stat-card-value">{leadCounts.newLeads}</Title>
                    <Tag color="#68BA7F" className="stat-card-tag">
                      <ArrowUpOutlined /> 18% this week
                    </Tag>
                  </div>
                </div>
                <div className="stat-card-footer">
                  <div className="stat-footer-info">
                    <div className="footer-label">Last 24h</div>
                    <div className="footer-value">+3</div>
                  </div>
                  <Progress percent={75} showInfo={false} strokeWidth={4} strokeColor="#68BA7F" />
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Card className="stat-card in-progress-card" bordered={false} onClick={handleInProgressClick}>
                <div className="stat-card-content">
                  <div className="stat-card-icon">
                    <ClockCircleOutlined />
                  </div>
                  <div className="stat-card-info">
                    <Text className="stat-card-title">In Progress</Text>
                    <Title level={2} className="stat-card-value">{leadCounts.inProgress}</Title>
                    <Tag color="#28B1FF" className="stat-card-tag">
                      <ArrowUpOutlined /> 5% this week
                    </Tag>
                  </div>
                </div>
                <div className="stat-card-footer">
                  <div className="stat-footer-info">
                    <div className="footer-label">Most in step</div>
                    <div className="footer-value">Verification</div>
                  </div>
                  <Progress percent={45} showInfo={false} strokeWidth={4} strokeColor="#28B1FF" />
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Card className="stat-card approved-card" bordered={false} onClick={handleApprovedClick}>
                <div className="stat-card-content">
                  <div className="stat-card-icon">
                    <CheckCircleOutlined />
                  </div>
                  <div className="stat-card-info">
                    <Text className="stat-card-title">Approved</Text>
                    <Title level={2} className="stat-card-value">{leadCounts.approved}</Title>
                    <Tag color="#FF8A00" className="stat-card-tag">
                      <ArrowUpOutlined /> 12% this week
                    </Tag>
                  </div>
                </div>
                <div className="stat-card-footer">
                  <div className="stat-footer-info">
                    <div className="footer-label">Avg. amount</div>
                    <div className="footer-value">₹5.2L</div>
                  </div>
                  <Progress percent={65} showInfo={false} strokeWidth={4} strokeColor="#FF8A00" />
                </div>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6} xl={6}>
              <Card className="stat-card disbursed-card" bordered={false} onClick={handleDisbursedClick}>
                <div className="stat-card-content">
                  <div className="stat-card-icon">
                    <DollarOutlined />
                  </div>
                  <div className="stat-card-info">
                    <Text className="stat-card-title">Disbursed</Text>
                    <Title level={2} className="stat-card-value">{leadCounts.disbursed}</Title>
                    <Tag color="#E34234" className="stat-card-tag">
                      <ArrowUpOutlined /> 8% this week
                    </Tag>
                  </div>
                </div>
                <div className="stat-card-footer">
                  <div className="stat-footer-info">
                    <div className="footer-label">Total amount</div>
                    <div className="footer-value">₹24.5L</div>
                  </div>
                  <Progress percent={40} showInfo={false} strokeWidth={4} strokeColor="#E34234" />
                </div>
              </Card>
            </Col>
          </Row>

          {/* SECOND ROW - Performance and Activity Tracker */}
          <Row gutter={[16, 16]} className="dashboard-row">
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card 
                title={
                  <div className="card-title">
                    <BarChartOutlined className="card-title-icon" />
                    <span>Performance Dashboard</span>
                  </div>
                } 
                extra={
                  <Select 
                    defaultValue="conversion" 
                    size="small" 
                    style={{ width: 140 }}
                    onChange={(value) => setSelectedChart(value)}
                  >
                    <Select.Option value="conversion">Conversion Rate</Select.Option>
                    <Select.Option value="processing">Processing Time</Select.Option>
                    <Select.Option value="target">Monthly Target</Select.Option>
                    <Select.Option value="satisfaction">Satisfaction</Select.Option>
                  </Select>
                }
                className="dashboard-card performance-card"
              >
                <div className="performance-charts">
                  {selectedChart === 'conversion' && (
                    <div className="chart-container">
                      <div className="chart-metrics">
                        <div className="chart-metric-value">{performanceMetrics.conversionRate}%</div>
                        <div className="chart-metric-trend">
                          <ArrowUpOutlined style={{ color: '#68BA7F' }} />
                          <span>+5.2% from last month</span>
                        </div>
                      </div>
                      <LineChart
                        height={230}
                        series={[
                          {
                            data: performanceMetrics.history.conversionRate,
                            color: '#68BA7F',
                            label: 'Conversion Rate (%)',
                            showMark: true,
                            area: true,
                            curve: "monotoneX",
                          },
                        ]}
                        xAxis={[{
                          data: performanceMetrics.history.months,
                          scaleType: 'band',
                        }]}
                        sx={{
                          '.MuiLineElement-root': {
                            strokeWidth: 2,
                          },
                          '.MuiMarkElement-root': {
                            stroke: '#fff',
                            scale: '0.6',
                            fill: '#68BA7F',
                            strokeWidth: 2,
                          },
                        }}
                        margin={{ top: 10, bottom: 30, left: 20, right: 10 }}
                      />
                    </div>
                  )}
                  
                  {selectedChart === 'processing' && (
                    <div className="chart-container">
                      <div className="chart-metrics">
                        <div className="chart-metric-value">{performanceMetrics.processingTime} days</div>
                        <div className="chart-metric-trend">
                          <ArrowDownOutlined style={{ color: '#68BA7F' }} />
                          <span>-0.5 days from last month</span>
                        </div>
                      </div>
                      <LineChart
                        height={230}
                        series={[
                          {
                            data: performanceMetrics.history.processingTime,
                            color: '#28B1FF',
                            label: 'Processing Time (days)',
                            showMark: true,
                            area: true,
                            curve: "monotoneX",
                          },
                        ]}
                        xAxis={[{
                          data: performanceMetrics.history.months,
                          scaleType: 'band',
                        }]}
                        sx={{
                          '.MuiLineElement-root': {
                            strokeWidth: 2,
                          },
                          '.MuiMarkElement-root': {
                            stroke: '#fff',
                            scale: '0.6',
                            fill: '#28B1FF',
                            strokeWidth: 2,
                          },
                        }}
                        margin={{ top: 10, bottom: 30, left: 20, right: 10 }}
                      />
                    </div>
                  )}
                  
                  {selectedChart === 'target' && (
                    <div className="chart-container">
                      <div className="chart-metrics">
                        <div className="chart-metric-value">{performanceMetrics.monthlyTarget}%</div>
                        <div className="chart-metric-trend">
                          <ArrowUpOutlined style={{ color: '#68BA7F' }} />
                          <span>+12% progress</span>
                        </div>
                      </div>
                      <BarChart
                        height={230}
                        series={[
                          {
                            data: performanceMetrics.history.monthlyTarget,
                            color: '#FF8A00',
                            label: 'Monthly Target (%)',
                            valueFormatter: (value) => `${value}%`,
                          },
                        ]}
                        xAxis={[{
                          data: performanceMetrics.history.months,
                          scaleType: 'band',
                        }]}
                        sx={{
                          '.MuiBarElement-root': {
                            borderRadius: 4,
                          }
                        }}
                        margin={{ top: 10, bottom: 30, left: 20, right: 10 }}
                      />
                    </div>
                  )}
                  
                  {selectedChart === 'satisfaction' && (
                    <div className="chart-container">
                      <div className="chart-metrics">
                        <div className="chart-metric-value">{performanceMetrics.satisfaction}/5</div>
                        <div className="chart-metric-trend">
                          <ArrowUpOutlined style={{ color: '#68BA7F' }} />
                          <span>+0.2 from last month</span>
                        </div>
                      </div>
                      <LineChart
                        height={230}
                        series={[
                          {
                            data: performanceMetrics.history.satisfaction,
                            color: '#8E44AD',
                            label: 'Satisfaction (out of 5)',
                            showMark: true,
                            area: true,
                            curve: "monotoneX",
                          },
                        ]}
                        xAxis={[{
                          data: performanceMetrics.history.months,
                          scaleType: 'band',
                        }]}
                        sx={{
                          '.MuiLineElement-root': {
                            strokeWidth: 2,
                          },
                          '.MuiMarkElement-root': {
                            stroke: '#fff',
                            scale: '0.6',
                            fill: '#8E44AD',
                            strokeWidth: 2,
                          },
                        }}
                        margin={{ top: 10, bottom: 30, left: 20, right: 10 }}
                      />
                    </div>
                  )}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="custom-activity-tracker">
                <div className="tracker-header">
                  <span className="section-title" style={{ margin: 0, paddingLeft: 0 }}>Activity Tracker</span>
                  <div className="date-navigator">
                    <div className="nav-button" onClick={() => setSelectedDate(moment(selectedDate).subtract(1, 'day'))}>
                      <LeftOutlined />
                    </div>
                    <div className="date-display">{selectedDate.format('MMM DD, YYYY')}</div>
                    <div className="nav-button" onClick={() => setSelectedDate(moment(selectedDate).add(1, 'day'))}>
                      <RightOutlined />
                    </div>
                  </div>
                </div>
                
                <div className="time-slots">
                  {[...Array(7)].map((_, index) => {
                    const date = moment().add(index - 3, 'days');
                    const isActive = date.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD');
                    const dayEvents = activities.filter(activity => 
                      moment(activity.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
                    );
                    
                    return (
                      <div 
                        key={index} 
                        className={`time-slot ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="slot-day">{date.format('ddd')}</div>
                        <div className="slot-date">{date.format('DD')}</div>
                        {dayEvents.length > 0 && (
                          <div className="slot-events">{dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <Spin spinning={activityLoader}>
                  <div className="activities-timeline">
                    {getTodayActivities().length > 0 ? (
                      getTodayActivities().map((activity, index) => (
                        <div className="timeline-item" key={activity.id}>
                          <div className="timeline-marker">
                            {activity.mode === 'Online' ? <TeamOutlined /> : <UserOutlined />}
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-title">
                              {activity.agenda}
                              <div className="timeline-time">
                                {activity.meetingStartTime} - {activity.meetingEndTime}
                              </div>
                            </div>
                            <div className="timeline-details">
                              <div className="timeline-detail">
                                <div className="detail-name">Mode</div>
                                <div className="detail-value">{activity.mode}</div>
                              </div>
                              <div className="timeline-detail">
                                <div className="detail-name">Location</div>
                                <div className="detail-value">{activity.location}</div>
                              </div>
                              <div className="timeline-detail">
                                <div className="detail-name">Meeting Location</div>
                                <div className="detail-value">{activity.meetingLocation}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-data-container">
                        <Image preview={false} src={noData} className="no-data-image" />
                      </div>
                    )}
                  </div>
                </Spin>
                
                <div style={{ textAlign: 'center', marginTop: '5px',marginBottom: '15px' }}>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    size="small"
                    onClick={() => navigate("/Calendar")}
                    style={{ 
                      backgroundColor: 'var(--primary-color)', 
                      borderColor: 'var(--primary-color)',
                      boxShadow: '0 3px 8px rgba(104, 186, 127, 0.2)',
                      borderRadius: '6px',
                      fontWeight: 600
                    }}
                  >
                    Add Activity
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* THIRD ROW - Queries and Approvals */}
          <Row gutter={[16, 16]} className="dashboard-row">
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card 
                title={
                  <div className="card-title">
                    <FileSearchOutlined className="card-title-icon" />
                    <span>Pending Queries</span>
                  </div>
                } 
                extra={<a href="#" onClick={() => navigate("/queries-approvals", { state: "Pending Queries" })}>View All</a>}
                className="dashboard-card queries-card"
                bordered={false}
              >
                <div className="card-stats">
                  <div className="card-stat-item">
                    <div className="stat-count">{queriesList.length}</div>
                    <div className="stat-label">Total Queries</div>
                  </div>
                  <div className="card-stat-item">
                    <div className="stat-count" style={{ color: 'var(--primary-color)' }}>
                      {queriesList.filter(q => q.priority === 'High').length}
                    </div>
                    <div className="stat-label">High Priority</div>
                  </div>
                  <div className="card-stat-item">
                    <div className="stat-count" style={{ color: 'var(--accent-color)' }}>2</div>
                    <div className="stat-label">Due Today</div>
                  </div>
                </div>
                <List
                  className="queries-list"
                  itemLayout="horizontal"
                  dataSource={queriesList}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button 
                          type="primary" 
                          size="small"
                          onClick={() => navigate("/Application-Listing/Application", { state: { isPendingQueryList: true, proposalId: item.proposalId } })}
                          className="view-button"
                        >
                          View
                        </Button>
                      ]}
                      className="query-list-item"
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            icon={<FileSearchOutlined />} 
                            style={{ 
                              backgroundColor: getPriorityColor(item.priority),
                              boxShadow: `0 4px 8px ${getPriorityColor(item.priority)}40`
                            }} 
                          />
                        }
                        title={
                          <div className="query-title-container">
                            <span className="query-title">Query ID: {item.proposalId}</span>
                            <Tag color={getPriorityColor(item.priority)} className="priority-tag">
                              {item.priority}
                            </Tag>
                          </div>
                        }
                        description={
                          <div className="query-description">
                            <div className="query-text">{item.description}</div>
                            <div className="query-date">
                              <ClockCircleOutlined /> {item.date}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card 
                title={
                  <div className="card-title">
                    <BarsOutlined className="card-title-icon" />
                    <span>Pending Approvals</span>
                  </div>
                } 
                extra={<a href="#" onClick={() => navigate("/queries-approvals", { state: "Pending Approvals" })}>View All</a>}
                className="dashboard-card approvals-card"
                bordered={false}
              >
                <div className="card-stats">
                  <div className="card-stat-item">
                    <div className="stat-count">{approvalsList.length}</div>
                    <div className="stat-label">Total Approvals</div>
                  </div>
                  <div className="card-stat-item">
                    <div className="stat-count" style={{ color: 'var(--accent-color)' }}>2</div>
                    <div className="stat-label">Senior Level</div>
                  </div>
                  <div className="card-stat-item">
                    <div className="stat-count" style={{ color: 'var(--primary-color)' }}>1</div>
                    <div className="stat-label">Due Today</div>
                  </div>
                </div>
                <List
                  className="approvals-list"
                  itemLayout="horizontal"
                  dataSource={approvalsList}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button 
                          type="primary" 
                          size="small"
                          onClick={() => navigate("/Application-Listing/Application", { state: { isPendingApproval: true, proposalId: item.proposalId } })}
                          className="view-button"
                        >
                          View
                        </Button>
                      ]}
                      className="approval-list-item"
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            icon={<BarsOutlined />} 
                            style={{ 
                              backgroundColor: '#FF8A00',
                              boxShadow: '0 4px 8px rgba(255, 138, 0, 0.25)'
                            }} 
                          />
                        }
                        title={
                          <div className="approval-title-container">
                            <span className="approval-title">Approval ID: {item.proposalId}</span>
                            <div className="customer-name">{item.customer}</div>
                          </div>
                        }
                        description={
                          <div className="approval-description">
                            <div className="approval-text">{item.description}</div>
                            <div className="approval-date">
                              <ClockCircleOutlined /> {item.date}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          {/* FOURTH ROW - Resources and Todo Tasks */}
          <Row gutter={[16, 16]} className="dashboard-row">
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card 
                title={
                  <div className="card-title">
                    <ApartmentOutlined className="card-title-icon" />
                    <span>Resources</span>
                  </div>
                } 
                extra={<a href="#" onClick={() => navigate("/product-catalogue")}>View All</a>}
                className="dashboard-card resources-card"
              >
                <div className="resource-actions">
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <div className="resource-action-item" onClick={handleLoanEligibilityClick}>
                        <CalculatorOutlined className="resource-action-icon" />
                        <div className="resource-action-text">Loan Eligibility</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="resource-action-item" onClick={() => navigate("/product-catalogue")}>
                        <ApartmentOutlined className="resource-action-icon" />
                        <div className="resource-action-text">Product Catalogue</div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className="resource-action-item" onClick={handleEmiCalculatorClick}>
                        <CalculatorOutlined className="resource-action-icon" />
                        <div className="resource-action-text">EMI Calculator</div>
                      </div>
                    </Col>
                  </Row>
                </div>

                <Divider className="resource-divider" />

                <div className="resource-products">
                  <Title level={5} className="section-title">Featured Products</Title>
                  <List
                    className="products-list"
                    itemLayout="horizontal"
                    dataSource={productList}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={item.icon} style={{ backgroundColor: '#68BA7F' }} />}
                          title={<span className="product-name">{item.name}</span>}
                          description={
                            <div className="product-details">
                              <Row gutter={[8, 8]}>
                                <Col span={8}>
                                  <div className="product-detail">
                                    <span className="detail-label">Interest:</span>
                                    <span className="detail-value">{item.interestRate}</span>
                                  </div>
                                </Col>
                                <Col span={8}>
                                  <div className="product-detail">
                                    <span className="detail-label">Max Amount:</span>
                                    <span className="detail-value">{item.maxAmount}</span>
                                  </div>
                                </Col>
                                <Col span={8}>
                                  <div className="product-detail">
                                    <span className="detail-label">Tenure:</span>
                                    <span className="detail-value">{item.tenure}</span>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card 
                title={
                  <div className="card-title">
                    <CheckOutlined className="card-title-icon" />
                    <span>Todo Tasks</span>
                  </div>
                } 
                extra={<a href="#" onClick={() => navigate("/Todo")}>View All</a>}
                className="dashboard-card todo-card"
              >
                <List
                  className="todo-list"
                  itemLayout="horizontal"
                  dataSource={todoTasks}
                  renderItem={item => (
                    <List.Item className="todo-item">
                      <List.Item.Meta
                        avatar={
                          <Checkbox 
                            checked={item.completed} 
                            onChange={() => handleTodoCheckboxChange(item.id)}
                          />
                        }
                        title={
                          <div className="todo-title-container">
                            <span className={`todo-title ${item.completed ? 'completed' : ''}`}>
                              {item.description}
                            </span>
                            <Tag color={getPriorityColor(item.priority)} className="priority-tag">
                              {item.priority}
                            </Tag>
                          </div>
                        }
                        description={
                          <div className="todo-date">
                            <ClockCircleOutlined /> Due: {moment(item.targetDate).format('MMM DD, YYYY')}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
                <div className="add-todo-container">
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => navigate("/Todo")}
                    className="add-todo-button"
                  >
                    Add New Task
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Modals */}
      {isEmiModalVisible && (
        <EmiCalculatorModal
          visible={isEmiModalVisible}
          onCancel={handleEmiModalCancel}
        />
      )}

      {isNewApplicationModalVisible && (
        <NewApplication
          open={isNewApplicationModalVisible}
          checkingEligible={checkingEligible}
          form={form}
          contentTrue={contentTrue}
          setContentTrue={setContentTrue}
          checkEligibility={checkEligibility}
          showSuccessPage={showSuccessPage}
          showErrorPage={showErrorPage}
          value={value}
          handleChange={handleChange}
          onCancel={() => setIsNewApplicationModalVisible(false)}
        />
      )}

      {/* Quick Action Buttons */}
      <FloatButton
        type="primary"
        style={{ right: 24 }}
        icon={<PlusOutlined />}
        tooltip="New Application"
        onClick={handleNewApplicationClick}
      />
    </>
  );
};

// HomeOutlined is missing in imports, adding it inline
function HomeOutlined() {
  return (
    <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
      <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
    </svg>
  );
}

export default CreditxDashboard;
