
import { Breadcrumb, Tabs, Row, Col, Modal, message, Spin } from "antd";
import { ShareAltOutlined, EyeOutlined } from '@ant-design/icons';
import "../../components/Todo/ActivityCalendar.css"
import "../loanApplication/LoanApplication.css";
import axiosRequest from "../../axios-request/API.request.js";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

function ViewDetails() {
  const location = useLocation()
  const [loanDetails, setLoadDetails] = useState("");
  const [loading, setLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState("");
  const [iframeterms, setIframeTerms] = useState(false)
  const [showDownload, setShowDownload] = useState(false)
  const [documentId, setDocumentId] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const handleIFrameOk1 = () => {
    setIframeTerms(false);
  };

  const handleIFrameCancel1 = () => {
    setIframeTerms(false);
  };

  const fetchData = async () => {
    try {
      const response = await axiosRequest.get(`proposal/get-sanctioned-details?proposalId=${location?.state}`);
      setLoadDetails(response.data.data)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const downloadAgreement = async () => {
    setLoading(true)
    try {
      const response = await axiosRequest.get(`proposal/collection/get_installment_table?proposalId=${location?.state}&shareWithApplicant=false&getPdf=true`);
      const byteCharacters = atob(response?.data?.data?.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setIframeTerms(true)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching agreement:', error);
    }
  };

  const downloadAgreement1 = async () => {
    setLoading(true)
    try {
      const response = await axiosRequest.get(`service/karza/esign/get_document?documentId=${documentId}`);
      const byteCharacters = atob(response?.data?.resp?.result?.file);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setIframeTerms(true)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching agreement:', error);
    }
  };



  const shareAgreement = async () => {
    setLoading(true)
    try {
      const response = await axiosRequest.get(`proposal/collection/get_installment_table?proposalId=${location?.state}&shareWithApplicant=true`)
      message.success(response?.data?.msg)
      setLoading(false)
    }
    catch (error) {
      console.error('Error fetching agreement:', error);
    }
  }


  const shareAgreement1 = async () => {
    setLoading(true)
    const form = {
      proposalId: location?.state
    }
    try {
      const response = await axiosRequest.post(`service/karza/esign/session`, form)
      if (response.resCode === -1) {
        message.success(response?.data?.statusMsg)
        setShowDownload(true)
        setDocumentId(response?.data?.resp?.result?.documentId)
        setLoading(false)
      }
    }
    catch (error) {
      console.error('Error fetching agreement:', error);
    }
  }


  const onChange = (key) => {
    console.log(key);
  }

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
      <Spin size="large" spinning={loading}>
        <div className="main_div">
          <div className="top_div" style={{ paddingTop: '15px', paddingBottom: '25px', paddingLeft: 25 }}>
            <Breadcrumb style={{ color: "white" }} separator=">" className="breadcrumb">
              <Breadcrumb.Item href="/dashboard"><div className='todo-text'>Dashboard</div></Breadcrumb.Item>
              <Breadcrumb.Item href="/Application-Listing"><div className='todo-text'>Application Listing</div></Breadcrumb.Item>
              <Breadcrumb.Item href=""><div className='todo-text'>Application</div></Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="div_row">
            <div style={{ marginTop: 20 }} className="left_div">Application</div>
          </div>
        </div>
        <div style={{ margin: "3% 3%" }}>
          <Tabs className='tab-query' type="card" onChange={onChange}>
            <Tabs.TabPane tab="Loan Disbursed" key="Loan Sanctioned">
              <div className="loandetailstitle" style={{ padding: '15px' }}>Loan Disbursed Details</div>
              <Row style={{ padding: '15px' }}>
                <Col xl={12} sm={24} md={12} lg={12} xs={24}>
                  <div style={{ marginBottom: 15, color: "#28B1FF", fontWeight: 500, fontSize: 16 }}>Merchant Details</div>
                  <Row style={{ minHeight: 260, lineHeight: 2.2, border: "1px solid #D2E1FF", padding: "1%", borderRadius: 10, marginRight: 8 }}>
                    <Col style={{ color: "#82888e", fontSize: 13 }} xl={10} sm={10} md={10} lg={10} xs={10}>
                      Loan Type
                    </Col>
                    <Col style={{ fontSize: 14, fontWeight: 500, textTransform: "uppercase" }} xl={14} sm={14} md={14} lg={14} xs={14}>
                      {loanDetails?.loanDetails?.loanType?.value || "--"}
                    </Col>
                    <Col style={{ color: "#82888e", fontSize: 13 }} xl={10} sm={10} md={10} lg={10} xs={10}>
                      Loan Amount Requested
                    </Col>
                    <Col style={{ fontSize: 14, fontWeight: 500 }} xl={14} sm={14} md={14} lg={14} xs={14}>
                      {formatNumberWithCommas(loanDetails?.loanDetails?.loanAmountRequested) || "--"}
                    </Col>
                    <Col style={{ color: "#82888e", fontSize: 13 }} xl={10} sm={10} md={10} lg={10} xs={10}>
                      Loan Amount Apporved
                    </Col>
                    <Col style={{ fontSize: 14, fontWeight: 500 }} xl={14} sm={14} md={14} lg={14} xs={14}>
                      {formatNumberWithCommas(loanDetails?.loanDetails?.loanAmountApproved) || "--"}
                    </Col>
                    <Col style={{ color: "#82888e", fontSize: 13 }} xl={10} sm={10} md={10} lg={10} xs={10}>
                      Annual Interest Rate
                    </Col>
                    <Col style={{ fontSize: 14, fontWeight: 500 }} xl={14} sm={14} md={14} lg={14} xs={14}>
                      {loanDetails?.loanDetails?.annualInterestRate || "--"} %
                    </Col>
                    <Col style={{ color: "#82888e", fontSize: 13 }} xl={10} sm={10} md={10} lg={10} xs={10}>
                      Loan Disbursement Rate
                    </Col>
                    <Col style={{ fontSize: 14, fontWeight: 500 }} xl={14} sm={14} md={14} lg={14} xs={14}>
                      {dayjs(loanDetails?.loanDetails?.loanDisbursmentDate).format("DD-MM-YYYY")}
                    </Col>
                    <Col style={{ color: "#82888e", fontSize: 13 }} xl={10} sm={10} md={10} lg={10} xs={10}>
                      Loan Disbursement Amount
                    </Col>
                    <Col style={{ fontSize: 14, fontWeight: 500 }} xl={14} sm={14} md={14} lg={14} xs={14}>
                      {formatNumberWithCommas(loanDetails?.loanDetails?.loanDisbursmentAmount) || "--"}
                    </Col>
                    <Col style={{ color: "#82888e", fontSize: 13 }} xl={10} sm={10} md={10} lg={10} xs={10}>
                      Agreement Document
                    </Col>
                    <Col onClick={shareAgreement1} style={{ color: "#003399", fontWeight: 500, fontSize: 15, cursor: "pointer" }} xl={7} sm={7} md={7} lg={7} xs={7}>
                      <ShareAltOutlined />Share With Customer
                    </Col>

                    {showDownload === true ? <>
                      <Col onClick={downloadAgreement1} style={{ color: "#003399", fontWeight: 500, fontSize: 15, cursor: "pointer" }} xl={7} sm={7} md={7} lg={7} xs={7}>
                        <EyeOutlined />View and Download
                      </Col>
                    </> : ""}
                  </Row>
                </Col>
                <Col xl={12} sm={24} md={12} lg={12} xs={24}>
                  <div style={{ marginBottom: 15, color: "#28B1FF", fontWeight: 500, fontSize: 16 }}>Emi Details</div>
                  <Row style={{ minHeight: 260, border: "1px solid #D2E1FF", padding: "1%", borderRadius: 10 }}>
                    <Col style={{ color: "#82888e", fontSize: 13 }} xl={10} sm={10} md={10} lg={10} xs={10}>
                      EMI
                    </Col>
                    <Col style={{ fontSize: 14, fontWeight: 500 }} xl={14} sm={14} md={14} lg={14} xs={14}>
                      {formatNumberWithCommas(loanDetails?.emiDetails?.emi) || "--"}
                    </Col>
                    <Col style={{ color: "#82888e", fontSize: 13 }} xl={10} sm={10} md={10} lg={10} xs={10}>
                      Loan Tenure(in months)
                    </Col>
                    <Col style={{ fontSize: 14, fontWeight: 500 }} xl={14} sm={14} md={14} lg={14} xs={14}>
                      {loanDetails?.emiDetails?.tenure || "--"} Months
                    </Col>
                    <Col style={{ color: "#82888e", fontSize: 13 }} xl={10} sm={10} md={10} lg={10} xs={10}>
                      Mode Of Payment
                    </Col>
                    <Col style={{ fontSize: 14, fontWeight: 500 }} xl={14} sm={14} md={14} lg={14} xs={14}>
                      --
                    </Col>
                    <Col style={{ color: "#82888e", fontSize: 13 }} xl={10} sm={10} md={10} lg={10} xs={10}>
                      Total Installments
                    </Col>
                    <Col style={{ fontSize: 14, fontWeight: 500 }} xl={14} sm={14} md={14} lg={14} xs={14}>
                      {loanDetails?.emiDetails?.noOfInstallment || "--"} Months
                    </Col>
                    <Col style={{ color: "#82888e", fontSize: 13 }} xl={10} sm={10} md={10} lg={10} xs={10}>
                      Loan Amortisation Document
                    </Col>
                    <Col onClick={shareAgreement} style={{ color: "#003399", fontWeight: 500, fontSize: 15, cursor: "pointer" }} xl={7} sm={7} md={7} lg={7} xs={7}>
                      <ShareAltOutlined />Share With Customer
                    </Col>
                    <Col onClick={downloadAgreement} style={{ color: "#003399", fontWeight: 500, fontSize: 15, cursor: "pointer" }} xl={7} sm={7} md={7} lg={7} xs={7}>
                      <EyeOutlined />  View and Download
                    </Col>
                  </Row>
                </Col>
                <Col xl={24} sm={24} md={24} lg={24} xs={24}>
                  <div style={{ marginBottom: 5, color: "#28B1FF", fontWeight: 500, fontSize: 16, margin: "15px 0px" }}>Repayment Details</div>
                  <Row style={{ lineHeight: 2.5, border: "1px solid #D2E1FF", padding: "1%", borderRadius: 10 }}>
                    <Col xl={24} sm={24} md={24} lg={24} xs={24}>
                      <Row style={{ display: "flex", gap: "5%" }}>
                        <Col xl={3} sm={8} md={3} lg={3} xs={8} style={{ color: "#82888e", fontSize: 13 }}>Last Payment Status</Col>
                        <Col xl={3} sm={8} md={3} lg={3} xs={8} style={{ fontSize: 14, fontWeight: 500, color: "lightgreen" }}>{loanDetails?.repaymentDetails?.lastPaymentStatus || "--"}</Col>
                      </Row>
                    </Col>
                    <Col xl={24} sm={24} md={24} lg={24} xs={24}>
                      <Row style={{ display: "flex", gap: "5%" }}>
                        <Col xl={3} sm={8} md={3} lg={3} xs={8} style={{ color: "#82888e", fontSize: 13 }}>Last Payment Date</Col>
                        <Col xl={3} sm={8} md={3} lg={3} xs={8} style={{ fontSize: 14, fontWeight: 500 }}>{loanDetails?.repaymentDetails?.lastPaymentDate || "--"}</Col>
                      </Row>
                    </Col>
                    <Col xl={24} sm={24} md={24} lg={24} xs={24}>
                      <Row style={{ display: "flex", gap: "5%" }}>
                        <Col xl={3} sm={8} md={3} lg={3} xs={8} style={{ color: "#82888e", fontSize: 13 }}>Next Payment Date</Col>
                        <Col xl={3} sm={8} md={3} lg={3} xs={8} style={{ fontSize: 14, fontWeight: 500, color: "orange" }}>{dayjs(loanDetails?.repaymentDetails?.nextPaymentDate).format("DD-MM-YYYY")}</Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Tabs.TabPane>
            {/* <Tabs.TabPane disabled tab="Application" key="Application">
            <div className="loandetailstitle" style={{ padding: '15px' }}>Application</div>

          </Tabs.TabPane> */}
          </Tabs>
        </div>
      </Spin>
      <Modal
        title="View Agreement"
        visible={iframeterms}
        onOk={handleIFrameOk1}
        onCancel={handleIFrameCancel1}
        width="70%"
        bodyStyle={{ height: "90vh" }}
      >
        <iframe title="EMI Table" width="100%" height="100%" src={pdfUrl} />
      </Modal>
    </>
  )
}

export default ViewDetails