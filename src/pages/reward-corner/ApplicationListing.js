import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TabsComp from "../tabs/Tabs";
import mail from "../../assets/image/sms-edit.png";
import call from "../../assets/image/PhoneCall.png";
import todo from "../../assets/image/calendar-edit.png";
import axiosRequest from "../../axios-request/API.request";
import Sdloader from "../../components/Loader/FullPageLoader";
import { setLoader } from '../../state/slices/loader'
import {
  CalculatorOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  message,
  Menu,
  Pagination,
  Row,
} from "antd";
import moreOptions from "../../assets/image/kebab menu.svg";
import "./ApplicationListing.css";
import "../loanApplication/LoanApplication.css";
import EmiCalculatorModal from "./EmiCalculatorModal";
import { useDispatch } from "react-redux";
import { fetchProposalById, resetProposalState } from "../../state/slices/proposalSlice";
import { fetchAllProposalById } from "../../state/slices/getAllProposalSlice";
import moment from "moment/moment";
import { nameShorter } from "../../helpers";
import NoRecordsFound from "../tabs/NoRecordsFound";
import { resetProposalAllState } from "../../state/slices/getAllProposalSlice";
import { resetState } from "../../state/slices/ProposalApplicationSlice"
import { setDocumentReset } from "../../state/slices/documentSlice";
import { mockApplicationData } from "./mockData";
 
const MasterContest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState("all");
  const [filteredData, setFilteredData] = useState([]);
  const [paginationTotalCount, setPaginationTotalCount] = useState(0)
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1)
  const [paginationLimit, setPaginationLimit] = useState(10)
  const [value, setValue] = useState(1);
  const [openemiDetails, setOpenEmiDetails] = useState(false);
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    dispatch(resetProposalState())
    dispatch(resetProposalAllState())
    dispatch(resetState())
    dispatch(setDocumentReset())
    if (location?.state) {
      setActiveKey(location?.state)
    }
    else {
      setActiveKey("all")
    }
  }, [])

  useEffect(() => {
    handleTabClick();
  }, [activeKey, paginationCurrentPage, paginationLimit]);

  const handleTabClick = async () => {
    setLoading(true);
    dispatch(setLoader(true));
    if (activeKey === "all") {
      setFilteredData(mockApplicationData);
    } else if (activeKey === "archieved") {
      setFilteredData(mockApplicationData.filter(item => item.proposalStatus === 'archieved'));
    } else {
      setFilteredData(mockApplicationData.filter(item => item.proposalStatus === activeKey));
    }
    setPaginationTotalCount(mockApplicationData.length);
    setLoading(false);
    dispatch(setLoader(false));
  };

  // Initialize listData when component mounts
  // useEffect(() => {
  //   setListData(loanListing);
  // }, []);

  // Update filteredData when activeKey changes
  // useEffect(() => {
  //   filterData(activeKey);
  // }, [activeKey]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleMenuItemClick = (item) => {
    console.log(item, "akshaysriram")
    setIsModalVisible(true);
  };

  const deleteClick = (Item) => {
    console.log(Item, "akshaysriram")
    axiosRequest.delete(`proposal/deleteProposal/${Item._id}`)
      .then((response) => {
        if (response.resCode === -1) {
          message.success("Task Deleted Successfully")
          handleTabClick();
        }
      })
      .catch((error) => {
        console.error("Error fetching proposals:", error);
        throw error;
      }
      )
  }

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleCalculateEmi = () => {
    setOpenEmiDetails(!openemiDetails);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const onShowSizeChange = (page, pageSize) => {
    setPaginationCurrentPage(page)
    setPaginationLimit(pageSize)
  };

  // const formatString = (str) => {
  //   return str?.replace(/([A-Z])/g, ' $1')
  //     ?.replace(/^./, function (str) { return str?.toUpperCase(); });
  // }


  const generateMenu = (item) => (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => handleMenuItemClick(item, 'Mail')}
        className="listingmenus"
      >
        <img src={mail} />
        Mail
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => handleMenuItemClick(item, 'Call')}
        className="listingmenus"
      >
        <img src={call} />
        Call
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => handleMenuItemClick(item, 'To Do')}
        className="listingmenus"
      >
        <img src={todo} />
        To Do
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={() => handleMenuItemClick(item, 'Calculate EMI')}
        className="listingmenus"
      >
        <CalculatorOutlined style={{ fontSize: "20px", color: "#003399" }} />{" "}
        Calculate EMI
      </Menu.Item>
      <Menu.Item
        key="5"
        onClick={() => deleteClick(item)}
        className="listingmenus"
      >
        <DeleteOutlined style={{ fontSize: "20px", color: "#003399" }} />{" "}
        Delete Application
      </Menu.Item>
    </Menu>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "inProgress":
        return {
          background: "#FF6B0029",
          border: "1px solid #FF6B00",
          boxShadow: "0px 4px 6px 0px #FF6B001F",
          color: "#FF6B00",
        };
      case "sanctioned":
        return {
          background: "#12B82C29",
          border: "1px solid #12B82C",
          boxShadow: "0px 4px 6px 0px #22BB331F",
          color: "#12B82C",
        };
      case "disbursed":
        return {
          background: "#28B1FF29",
          border: "1px solid #28B1FF",
          boxShadow: "0px 4px 6px 0px #28B1FF1F",
          color: "#28B1FF",
        };
      case "rejected":
        return {
          background: "#E3423429",
          border: "1px solid #E34234",
          boxShadow: "0px 4px 6px 0px #E342341F",
          color: "#E34234",
        };
      case "archieved":
        return {
          background: "#E3423429",
          border: "1px solid #E34234",
          boxShadow: "0px 4px 6px 0px #E342341F",
          color: "#E34234",
        };
      default:
        return {
          background: "#12B82C29",
          border: "1px solid transparent",
          boxShadow: "0px 4px 6px 0px #22BB331F",
          color: "#12B82C",
        };
    }
  };

  const handleUpdate = (item) => {
    const { proposalStatus, _id, proposalSubStatus } = item;
    if (proposalStatus === "disbursed") {
      navigate("/ViewDetails", { state: _id });
    } else if (proposalStatus === "inProgress" && proposalSubStatus === "draft") {
      navigate("/Application-Listing/Application", { state: { applicantData: item } });
    } else if (proposalStatus === "inProgress") {
      navigate("/disbursement-view", { state: _id });
    } else if (proposalStatus === "sanctioned") {
      navigate("/disbursement-view", { state: _id });
    } else if (proposalStatus === "rejected") {
      navigate("/disbursement-view", { state: _id });
    }
  };

  const getButtonText = (status, proposalSubStatus) => {
    switch (status) {
      case "inProgress":
        if (proposalSubStatus === 'draft') {
          return "Update";
        } else {
          return "View Summary";
        }
      case "disbursed":
        return "View Details";
      case "sanctioned":
        return "View Summary"
      default:
        return "View Summary";
    }
  };

  const formatString = (str) => {
    return str?.replace(/([A-Z])/g, " $1")?.replace(/^./, function (str) {
      return str?.toUpperCase();
    });
  };

  const formatNumberWithCommas = (value) => {
    if (value == null) return ""; // Handle undefined or null values

    const number = Number(value); // Convert value to a number
    if (isNaN(number)) return ""; // Check if value is not a valid number

    const formattedNumber = number.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    }); // Format number with commas
    return `₹ ${formattedNumber}`;
  };
  return (
    <>
      {loading && <Sdloader sdloader={loading} />}
      {/* {activeKey === "1" ? ( */}
      <TabsComp
        showBreadCrum={true}
        tabMenu={[
          { key: "all", label: "All" },
          { key: "inProgress", label: "In Progress" },
          { key: "sanctioned", label: "Sanctioned" },
          { key: "disbursed", label: "Disbursed" },
          { key: "rejected", label: "Rejected" },
          { key: "archieved", label: "Archieved" }
        ]}
        activeKey={activeKey}
        setActiveKey={setActiveKey}
        onTabClick={() => handleTabClick()}
        header="Loan Application"
      />
      <div className="container top_container">
        {filteredData?.length === 0 ? (
          <NoRecordsFound />
        ) : (
          <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
            {filteredData?.map((el, index) => (
              <Col
                key={index}
                // className="m-auto"
                xs={24}
                sm={24}
                md={24}
                lg={12}
                xl={12}
              // className="col-12 col-sm-12 col-md-6 col-lg-6 mb-4"
              >
                <div className="loan-app-card savebuttons">
                  <div className="loan-app-card-header">
                    <div className="header-info">
                      <div className="avatar">
                        {nameShorter(
                          el?.applicantId?.fullName
                        )}
                      </div>
                      <div className="userinfo">
                        <div className="username">
                          {el?.applicantId?.fullName}
                        </div>
                        <div className="userid">
                          {el.applicationId}
                        </div>
                      </div>
                    </div>
                    <div className="header-actions">
                      <Button
                        style={{
                          background: getStatusColor(el.proposalStatus)
                            .background,
                          border: getStatusColor(el.proposalStatus).border,
                          boxShadow: getStatusColor(el.proposalStatus)
                            .boxShadow,
                          color: getStatusColor(el.proposalStatus).color,

                          fontSize: "12px",
                          fontWeight: "600",
                          lineHeight: "16px",
                          letterSpacing: "0em",
                          textAlign: "left",
                        }}
                        className="document-pending"
                      >
                        {el.proposalStatus == "inProgress" ? <div>in Progress</div> : el.proposalStatus == "inActive" ? <div>Archieved</div> : el.proposalStatus}
                      </Button>
                      <Dropdown overlay={() => generateMenu(el)} placement="bottomRight">
                        <img
                          src={moreOptions}
                          alt="More Options"
                          className="more-options-icon"
                        />
                      </Dropdown>
                      <EmiCalculatorModal
                        isVisible={isModalVisible}
                        onCancel={handleModalCancel}
                        onCalculateEmi={handleCalculateEmi}
                        onChange={handleChange}
                        value={value}
                        openemiDetails={openemiDetails}
                      />
                    </div>
                  </div>
                  <div className="application-info">
                    <Row
                      gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}
                      style={{ width: "100%" }}
                    >
                      <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                        <div className="col1">
                          <div>
                            <div className="title1">
                              {formatNumberWithCommas(el.loanDetails?.amount) || "--"}
                            </div>
                            <div className="title2">Loan Amount</div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                        <div className="col1">
                          <div>
                            <div className="title1">
                              {`${el.loanDetails?.tenure} Months` || "--"}
                            </div>
                            <div className="title2">Tenure</div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                        <div className="col1">
                          <div>
                            <div className="title1">
                              {formatString(el.loanDetails?.purpose?.value) || "--"}
                            </div>
                            <div className="title2">Purpose of Loan</div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                        <div>
                          <div className="title1">
                            {formatNumberWithCommas(el?.EMIDetails?.amount) || "--"}
                          </div>
                          <div className="title2">EMI</div>
                        </div>
                      </Col>

                      <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                        <div>
                          <div className="title1">
                            {el.loanDetails?.applicationType?.value || "--"}
                          </div>
                          <div className="title2">Applicant Type</div>
                        </div>
                      </Col>

                      <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                        <div>
                          <div className="title1">
                            {moment(el.createdAt).format(
                              "DD/MM/YYYY"
                            )}
                          </div>
                          <div className="title2">Application Date</div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <Button
                    className="button"
                    onClick={() => handleUpdate(el)}
                  // disabled={el?.proposalStatus === 'rejected' || el?.proposalStatus === 'approved' ? true : false}
                  >
                    {getButtonText(el?.proposalStatus, el?.proposalSubStatus)}
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        )}
        <div className="pagination">
          <span><b><span style={{ color: '#E46A25' }}>
            {paginationCurrentPage === 1
              ? '1'
              : (paginationCurrentPage - 1) * paginationLimit + 1}{' '}
            to{' '}
            {paginationCurrentPage === 1
              ? Math.min(paginationTotalCount, paginationLimit)
              : Math.min(paginationCurrentPage * paginationLimit, paginationTotalCount)}{' '}
            out of {paginationTotalCount} records
          </span>
          </b></span>
          <Pagination className="pages"
            showSizeChanger
            onChange={onShowSizeChange}
            total={paginationTotalCount}
          // itemRender={itemRender} 
          />
        </div>
      </div>
    </>
  );
};

export default MasterContest;
