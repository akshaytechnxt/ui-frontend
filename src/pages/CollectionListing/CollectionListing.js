import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TabsComp from "../tabs/Tabs";
import mail from "../../assets/image/sms-edit.png";
import call from "../../assets/image/PhoneCall.png";
import todo from "../../assets/image/calendar-edit.png";
import axiosRequest from "../../axios-request/API.request";
import Sdloader from "../../components/Loader/FullPageLoader";
import { setLoader } from '../../state/slices/loader'
import dayjs from 'dayjs';
import {
  CalculatorOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Menu,
  Pagination,
  Row,
} from "antd";
import moreOptions from "../../assets/image/kebab menu.svg";
import "../reward-corner/ApplicationListing.css";
import "../loanApplication/LoanApplication.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProposalById, fetchProposals, resetProposalState } from "../../state/slices/proposalSlice";
import moment from "moment/moment";
import { nameShorter } from "../../helpers";
import NoRecordsFound from "../tabs/NoRecordsFound";
import { resetProposalAllState } from "../../state/slices/getAllProposalSlice";

// Mock data for development
const mockCollections = [
  {
    id: "COL001",
    proposalId: "PROP001",
    customerName: "John Doe",
    emiAmount: 25000,
    dueIn: "2024-03-15",
    dueDate: 15,
    status: "active",
    type: "EMI",
    frequency: "Monthly",
    lastPaymentDate: "2024-02-15",
    nextPaymentDate: "2024-03-15",
    totalAmount: 300000,
    paidAmount: 50000,
    remainingAmount: 250000,
    contactNumber: "+91 9876543210",
    email: "john.doe@example.com",
    loanDetails: {
      loanType: { value: "Personal Loan" },
      purpose: "Home Renovation"
    }
  },
  {
    id: "COL002",
    proposalId: "PROP002",
    customerName: "Jane Smith",
    emiAmount: 75000,
    dueIn: "2024-03-20",
    dueDate: 20,
    status: "upcoming",
    type: "Quarterly",
    frequency: "Quarterly",
    lastPaymentDate: "2023-12-20",
    nextPaymentDate: "2024-03-20",
    totalAmount: 1000000,
    paidAmount: 225000,
    remainingAmount: 775000,
    contactNumber: "+91 9876543211",
    email: "jane.smith@example.com",
    loanDetails: {
      loanType: { value: "Business Loan" },
      purpose: "Business Expansion"
    }
  },
  {
    id: "COL003",
    proposalId: "PROP003",
    customerName: "Robert Johnson",
    emiAmount: 50000,
    dueIn: "2024-03-25",
    dueDate: 25,
    status: "overdue",
    type: "Final",
    frequency: "One-time",
    lastPaymentDate: "2024-02-25",
    nextPaymentDate: "2024-03-25",
    totalAmount: 500000,
    paidAmount: 450000,
    remainingAmount: 50000,
    contactNumber: "+91 9876543212",
    email: "robert.johnson@example.com",
    loanDetails: {
      loanType: { value: "Home Loan" },
      purpose: "Property Purchase"
    }
  },
  {
    id: "COL004",
    proposalId: "PROP004",
    customerName: "Sarah Williams",
    emiAmount: 35000,
    dueIn: "2024-03-10",
    dueDate: 10,
    status: "active",
    type: "EMI",
    frequency: "Monthly",
    lastPaymentDate: "2024-02-10",
    nextPaymentDate: "2024-03-10",
    totalAmount: 420000,
    paidAmount: 70000,
    remainingAmount: 350000,
    contactNumber: "+91 9876543213",
    email: "sarah.williams@example.com",
    loanDetails: {
      loanType: { value: "Education Loan" },
      purpose: "Higher Education"
    }
  },
  {
    id: "COL005",
    proposalId: "PROP005",
    customerName: "Michael Brown",
    emiAmount: 100000,
    dueIn: "2024-03-30",
    dueDate: 30,
    status: "upcoming",
    type: "Quarterly",
    frequency: "Quarterly",
    lastPaymentDate: "2023-12-30",
    nextPaymentDate: "2024-03-30",
    totalAmount: 1200000,
    paidAmount: 300000,
    remainingAmount: 900000,
    contactNumber: "+91 9876543214",
    email: "michael.brown@example.com",
    loanDetails: {
      loanType: { value: "Vehicle Loan" },
      purpose: "Car Purchase"
    }
  }
];

const CollectionListing = () => {
  const location = useLocation()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("active");
  const [filteredData, setFilteredData] = useState([]);
  const [paginationTotalCount, setPaginationTotalCount] = useState(0)
  const [paginationCurrentPage, setPaginationCurrentPage] = useState(1)
  const [paginationLimit, setPaginationLimit] = useState(10)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(resetProposalState())
    dispatch(resetProposalAllState())
  }, [])

  useEffect(() => {
    if (location?.state) {
      setActiveKey(location?.state)
    }
  }, [])

  useEffect(() => {
    handleTabClick();
  }, [activeKey, paginationCurrentPage, paginationLimit]);

  const handleTabClick = async () => {
    setLoading(true)
    dispatch(setLoader(true))
    
    try {
      // Filter collections based on status
      let filteredCollections = mockCollections;
      if (activeKey !== "all") {
        filteredCollections = mockCollections.filter(
          collection => collection.status.toLowerCase() === activeKey.toLowerCase()
        );
      }

      // Apply pagination
      const startIndex = (paginationCurrentPage - 1) * paginationLimit;
      const endIndex = startIndex + paginationLimit;
      const paginatedCollections = filteredCollections.slice(startIndex, endIndex);

      // Update state
      setPaginationTotalCount(filteredCollections.length);
      setFilteredData(paginatedCollections);
      setLoading(false);
      dispatch(setLoader(false));
    } catch (error) {
      console.error("Error processing collections:", error);
      setLoading(false);
      dispatch(setLoader(false));
    }
  };

  const onShowSizeChange = (page, pageSize) => {
    setPaginationCurrentPage(page)
    setPaginationLimit(pageSize)
  };

  const menu = (
    <>
      <Menu>
        <Menu.Item
          key="1"
          className="listingmenus"
        >
          <img src={mail} />
          Mail
        </Menu.Item>
        <Menu.Item
          key="2"
          className="listingmenus"
        >
          <img src={call} />
          Call
        </Menu.Item>
        <Menu.Item
          key="3"
          className="listingmenus"
        >
          <img src={todo} />
          To Do
        </Menu.Item>
      </Menu>
    </>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return {
          background: "#FF6B0029",
          border: "1px solid #FF6B00",
          boxShadow: "0px 4px 6px 0px #FF6B001F",
          color: "#FF6B00",
        };
      case "InActive":
        return {
          background: "#12B82C29",
          border: "1px solid #12B82C",
          boxShadow: "0px 4px 6px 0px #22BB331F",
          color: "#12B82C",
        };
      case "upcoming":
        return {
          background: "#28B1FF29",
          border: "1px solid #28B1FF",
          boxShadow: "0px 4px 6px 0px #28B1FF1F",
          color: "#28B1FF",
        };
      case "overdue":
        return {
          background: "#E3423429",
          border: "1px solid #E34234",
          boxShadow: "0px 4px 6px 0px #E342341F",
          color: "#E34234",
        };
      default:
        return {
          background: "transparent",
          border: "1px solid transparent",
          boxShadow: "none",
        };
    }
  };

  const handleUpdate = (status, id) => {
    navigate("/Collection-Listing/CollectionView", { state: id });
  };

  const getButtonText = (status) => {
    switch (status) {
      case "sanctioned":
        return "View Details";
      default:
        return "View";
    }
  };

  return (
    <>
      {loading && <Sdloader sdloader={loading} />}
      <TabsComp
        showBreadCrum={true}
        tabMenu={[
          { key: "active", label: "Active" },
          { key: "upcoming", label: "Upcoming" },
          { key: "overdue", label: "Overdue" },
        ]}
        activeKey={activeKey}
        setActiveKey={setActiveKey}
        onTabClick={() => handleTabClick()}
        header="Collection Listing"
      />
      <div className="container top_container">
        {filteredData?.length === 0 ? (
          <NoRecordsFound />
        ) : (
          <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
            {filteredData?.map((el, index) => (
              <Col
                key={index}
                xs={24}
                sm={24}
                md={24}
                lg={12}
                xl={12}
              >
                <div className="loan-app-card savebuttons">
                  <div className="loan-app-card-header">
                    <div className="header-info">
                      <div className="avatar">
                        {el.customerName?.charAt(0)}
                      </div>
                      <div className="name-info">
                        <div className="name">{el.customerName}</div>
                        <div className="id">ID: {el.proposalId}</div>
                      </div>
                    </div>
                    <div className="header-actions">
                      <Dropdown overlay={menu} trigger={["click"]}>
                        <img src={moreOptions} alt="More Options" />
                      </Dropdown>
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
                              ₹{el.emiAmount || "--"}
                            </div>
                            <div className="title2">Emi Amount</div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                        <div className="col1">
                          <div>
                            <div className="title1">
                              {dayjs(el.dueIn).format("DD MMM YYYY") || "--"}
                            </div>
                            <div className="title2">Due In</div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                        <div className="col1">
                          <div>
                            <div className="title1">
                              {`${el.dueDate} Days` || "--"}
                            </div>
                            <div className="title2">Due Date</div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <Button
                    className="button"
                    onClick={() => handleUpdate(el?.status, el?.proposalId)}
                  >
                    {getButtonText(el.status)}
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        )}
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <Pagination
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            defaultCurrent={1}
            total={paginationTotalCount}
            pageSize={paginationLimit}
            current={paginationCurrentPage}
            onChange={(page) => setPaginationCurrentPage(page)}
          />
        </div>
      </div>
    </>
  );
};

export default CollectionListing;
