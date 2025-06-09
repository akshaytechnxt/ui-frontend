import React, { useEffect, useState } from "react";
import "./header.css";
import { Avatar } from "antd";
import axios from "axios";
import "./sideBar.css";
import { useSelector, useDispatch } from "react-redux";
import { BellOutlined, DownOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import logocreditX from "../../src/assets/image/technxt.png";
import all_clear_img from "../assets/notifications_grey_192x192.png";
import Config from "../config/api.config";
import axiosRequest from "../axios-request/API.request";
import { io } from "socket.io-client";
import Modal1 from "../components/Modal1";
import mockUserService from "../services/mockUserService";
const { baseURL } = Config;

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLogo, setShowLogo] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [showLanguageSelector, setshowLanguageSelector] = useState(false);
  const [showbellIcon] = useState(true);
  const [notificationPanel, setNotificationPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleLanguage = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const showModal = () => {
    setSidebar(true);
  };

  const showNotificationModal = () => {
    setNotificationPanel(true);
  };

  const LogOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const notificationView = () => {
    navigate("/notifypage");
    setNotificationPanel(false);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const avatarText = data?.userData?.data?.data?.user ? 
    getInitials(data.userData.data.data.user.firstName, data.userData.data.data.user.lastName) : 
    'U';

  useEffect(() => {
    const fetchUserData = async () => {
      if (process.env.NODE_ENV === 'development') {
        const mockData = await mockUserService.getUserData();
        setData(mockData);
      } else {
        // Use actual API call in production
        // const response = await userService.getUserData();
        // setData(response);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!data?.userData?.data?.data?.jwt) return;
      
      const headers = {
        Authorization: `Bearer ${data.userData.data.data.jwt}`,
      };
      try {
        const response = await axios.get('https://creditx-node-dev.salesdrive.app/notification/logs?type=IN_APP&limit=10&page=1', { headers });
        setNotifications(response.data.data.docs);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchData();
  }, [data]);

  return (
    <>
      <div className="header">
        <div className="header_wrapper">
          <div className="logo_section">
            {showLogo && (
              <Link to="/Dashboard">
                <img
                  className="brand_logo"
                  src={logocreditX}
                  alt="CreditX Logo"
                />
              </Link>
            )}
          </div>
          <div className="profile_wrapper">
            {showLanguageSelector ? (
              <div className="select_language_mode">
                <select
                  defaultValue={selectedLanguage}
                  className="languageSelctor"
                  onChange={handleLanguage}
                >
                  <option value="EN">EN</option>
                  <option value="TH">TH</option>
                </select>
              </div>
            ) : null}
            <div
              className="divider"
              style={{
                width: "1px",
                height: "34px",
              }}
            ></div>
            {showbellIcon ? (
              <div
                className="bell_notification"
                style={{ position: "relative" }}
                to="#"
              >
                <BellOutlined
                  onClick={showNotificationModal}
                  style={{ fontSize: "25px", color: "#68BA7F", cursor: "pointer" }}
                />
                {notifications.length > 0 && (
                  <span className="notification-count">{notifications.length}</span>
                )}
              </div>
            ) : null}
            <div
              className="divider"
              style={{
                width: "1px",
                borderRight: "1px solid #D2E1FF",
                height: "34px",
              }}
            ></div>
            <div
              className="user_profile ms-md-3 d-flex align-items-center"
              to="#"
              onClick={showModal}
            >
              <Avatar size={40}>{avatarText}</Avatar>
              <div className="profile-content d-none d-md-block">
                <div className="content">
                  <div style={{ textTransform: "capitalize" }} className="text-wrapper">
                    {data?.userData?.data?.data?.user?.firstName} {data?.userData?.data?.data?.user?.lastName}
                  </div>
                  <div className="div">Employee ID: {data?.userData?.data?.data?.user?.empId}</div>
                </div>
                <DownOutlined className="chevron-down" style={{ color: "#68BA7F" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal1 shown={sidebar} close={() => setSidebar(false)}>
        <div className="indicationArrowProfile"></div>
        <div className="sideMenu">
          <div className="menuHeader" style={{ marginLeft: 20, marginTop: 10 }}>
            <div className="profileData">
              <p style={{ textTransform: "capitalize", fontWeight: 600 }}>
                Agent Name: {data?.userData?.data?.data?.user?.firstName} {data?.userData?.data?.data?.user?.lastName}
              </p>
              <p><b>Employee ID:</b> {data?.userData?.data?.data?.user?.empId}</p>
              <p><b>Branch:</b> {data?.userData?.data?.data?.user?.address || data?.userData?.data?.data?.user?.branch}</p>
            </div>
          </div>
          <div className="menuBody">
            <div className="logoutContainer">
              <Button onClick={LogOut}>Logout</Button>
            </div>
          </div>
        </div>
      </Modal1>
    </>
  );
};

export default Header;