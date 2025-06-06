import React, { useEffect, useState } from 'react'
import { Row, Col, Checkbox, Modal, Breadcrumb, message, Spin, Button, Upload } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { EyeOutlined, InboxOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import axiosRequest from "../../axios-request/API.request"
import Config from "../../config/api.config";
import axios from 'axios'
import "../../components/Todo/ActivityCalendar.css"
import "../loanApplication/LoanApplication.css";
import { useSelector } from "react-redux";
import mockDisbursementService from "../../services/mockDisbursementService";

const { baseURL } = Config;
const { Dragger } = Upload;

const DisbursmentView = () => {
    const token = useSelector((state) => state?.user?.userData?.data?.data?.jwt);
    const location = useLocation()
    const navigate = useNavigate()
    const [keyDocument, setKeyDocument] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [iframeModal, setIframeModal] = useState(false);
    const [iframeModal1, setIframeModal1] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [files, setFiles] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [bankDocument, setBankDocument] = useState("")
    const [DocumentType, setDocumentType] = useState("")
    const [employmentDocument, setEmploymentDocument] = useState("")
    const [activityLoader, setActivityLoader] = useState(false);
    const [kycdetail, setKycDetail] = useState("")
    const [entityDocument, setEntityDocument] = useState("")
    const [applicantDcument, setApplicantDocument] = useState("")
    const [storeGetServiceResp, setStoreGetServiceResp] = useState(null);
    const [store, setStore] = useState("entity");
    const [loading, setLoading] = useState(false);
    const fetchAllDocuments = useSelector((state) => state?.fetchAllProposal?.proposal?.data);

    const formatNumberWithCommas = (value) => {
        if (value == null) return "";
        const number = Number(value);
        if (isNaN(number)) return "";
        const formattedNumber = number.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        });
        return `₹ ${formattedNumber}`;
    };

    useEffect(() => {
        setActivityLoader(true);
        if (storeGetServiceResp?._id !== undefined) {
            var id = storeGetServiceResp?._id
        }
        else {
            var id = location?.state
        }
        const getVideoKycdetail = async () => {
            try {
                const response = await axiosRequest.get(`service/karza/getVideoKycDetail/${id}`);
                setKycDetail(response?.data[0]);
                setActivityLoader(false);
            } catch (error) {
                message.error('Error fetching user data');
            }
        }
        getVideoKycdetail()
    }, [])

    useEffect(() => {
        fetchDisbursementDetails();
    }, []);

    const fetchDisbursementDetails = async () => {
        setLoading(true);
        try {
            // In development mode, use mock data
            if (process.env.NODE_ENV === 'development') {
                const response = await mockDisbursementService.getDisbursementDetails();
                setStoreGetServiceResp(response.data.data);
                setLoading(false);
                return;
            }

            // Original API call code here
            // const response = await axiosRequest.get(`proposal/get-proposal-details?proposalId=${location?.state}`);
            // setStoreGetServiceResp(response.data?.data);
        } catch (error) {
            console.error('Error fetching disbursement details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClickToView = (key, link) => {
        setDocumentType(key)
        setKeyDocument(link);
        setIframeModal(true);
    };

    const modalOpen = () => {
        setIframeModal1(true)
    }

    const handleUpload = async (info) => {
        const { file } = info;
        if (!file) {
            message.error("Please upload a file.");
            return;
        }
        const isPdfOrPng =
            file.type === "application/pdf" ||
            file.type === "image/jpeg" ||
            file.type === "image/png";
        if (!isPdfOrPng) {
            message.error("Only .pdf, .jpg, and .png files are allowed.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            message.error("Max size of file is 5 MB.");
            return;
        }
        setFiles(file);
        setImageUrl(URL.createObjectURL(file));
        try {
            const formData = new FormData();
            formData.append('proposalId', "6694d976a438064abeb2e4dd");
            formData.append('imgFile', file);
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };
            const axiosConfig = `${baseURL}service/enach/uploadTripMandate`;
            const response = await axios.post(axiosConfig, formData, { headers });
            if (response) {
                setIframeModal1(false)
                setFiles(null);
                setImageUrl(null);
                setFileList([]);
            }
        } catch (error) {
            console.error("API Error:", error);
            message.error("Error uploading file. Please try again later.");
        }
    };

    const props = {
        fileList,
        beforeUpload: file => {
            setFileList([file]);
            return false;
        },
        onRemove: () => {
            setFileList([]);
        },
        customRequest: handleUpload
    };

    const handleIFrameOk = () => {
        setIframeModal(false);
    };

    const handleIFrameCancel = () => {
        setIframeModal(false);
    };

    const handleIFrameOk1 = () => {
        setIframeModal1(false);
    };

    const handleIFrameCancel1 = () => {
        setIframeModal1(false);
    };

    const formatString = (str) => {
        return str?.replace(/([A-Z])/g, " $1")?.replace(/^./, function (str) {
            return str?.toUpperCase();
        });
    };

    useEffect(() => {
        if (fetchAllDocuments) {
            let bankDocument = fetchAllDocuments.filter(document => document.section === "bank");
            setBankDocument(bankDocument);
            let employmentDocument = fetchAllDocuments.filter(document => document.section === "employment");
            setEmploymentDocument(employmentDocument)
            let applicantDcument = fetchAllDocuments.filter(document => document.section === "applicant")
            setApplicantDocument(applicantDcument)
            let entityDocument = fetchAllDocuments.filter(document => document.section === "entity" || document.section === "Individual")
            setEntityDocument(entityDocument)
        }
    }, [fetchAllDocuments]);

    return (
        <>
            <Spin className="spin-width" size="large" spinning={activityLoader}>
                <div>
                    <div className="main_div">
                        <div className="top_div" style={{ paddingTop: '15px', paddingBottom: '25px', paddingLeft: 25 }}>
                            <Breadcrumb style={{ color: "white" }} separator=">" className="breadcrumb">
                                <Breadcrumb.Item href="/dashboard"><div className='todo-text'>Dashboard</div></Breadcrumb.Item>
                                <Breadcrumb.Item href="/Application-Listing"><div className='todo-text'>Application Listing</div></Breadcrumb.Item>
                                <Breadcrumb.Item href=""><div className='todo-text'>Application</div></Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div style={{ padding: "0px 25px" }} className="div_row">
                            <div className="left_div1">Loan Application</div>
                            <Button onClick={modalOpen} style={{ marginRight: 50 }}>Physical Mandate</Button>
                        </div>
                    </div>
                    <div>
                        <Row
                            className="row-loan-summary"
                            style={{ display: "flex", columnGap: 2, justifyContent: "center", marginTop: 20 }}
                        >
                            <Col
                                style={{ border: "1px solid lightgray", borderRadius: 6 }}
                                xl={14}
                                sm={24}
                                lg={14}
                                xs={24}
                                md={14}
                            >
                                <div className="heading-collection">Loan Details</div>
                                <div className="loantitle pl-2 pt-2 pb-0">Loan Details</div>
                                <Row style={{ padding: "1%" }}>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Loan Application for</div>
                                        <div className="collection-content">
                                            {formatString(storeGetServiceResp?.loanDetails?.applicationType?.value) || "--"}
                                        </div>
                                    </Col>
                                    {storeGetServiceResp?.loanDetails?.applicationType?.value === 'entity' ?
                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <>
                                                <div className="collection-title">Type Of Loan</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.loanDetails?.loanType?.value === "sme" ? "SME" : formatString(storeGetServiceResp?.loanDetails?.loanType?.value) || "--"}
                                                </div>
                                            </>
                                        </Col>
                                        : ""}
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Loan Amount</div>
                                        <div className="collection-content">
                                            {formatNumberWithCommas(storeGetServiceResp?.loanDetails?.amount) || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Tenure</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.loanDetails?.tenure ? `${storeGetServiceResp.loanDetails.tenure} Months` : "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Purpose Of Loan</div>
                                        <div className="collection-content">
                                            {formatString(storeGetServiceResp?.loanDetails?.purpose?.value) ||
                                                "--"}
                                        </div>
                                    </Col>
                                </Row>

                                <div className="loantitle pl-2 pt-2 pb-0">EMI Details</div>
                                <Row style={{ padding: "1%" }}>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">EMI Amount</div>
                                        <div className="collection-content">
                                            {formatNumberWithCommas(storeGetServiceResp?.EMIDetails?.amount) || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Processing Fee</div>
                                        <div className="collection-content">
                                            {formatNumberWithCommas(storeGetServiceResp?.EMIDetails?.processingFees) || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Rate Of Interest(%)</div>
                                        <div className="collection-content">
                                            {`${storeGetServiceResp?.EMIDetails?.rateOfInterest} % ` || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Any Other Charges</div>
                                        <div className="collection-content">
                                            {formatNumberWithCommas(storeGetServiceResp?.EMIDetails?.otherCharges) || "--"}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xl={4}
                                sm={4}
                                lg={4}
                                xs={4}
                                md={4}>
                                <img style={{ width: 200, display: "flex", float: "right", height: "100%", border: "2px solid black" }} src={kycdetail?.videoThumbnailS3File} />
                            </Col>
                            <Col
                                style={{
                                    border: "1px solid lightgray",
                                    borderRadius: 6,
                                    marginTop: 10,
                                }}
                                xl={18}
                                sm={24}
                                lg={18}
                                xs={24}
                                md={18}
                            >
                                <div className="heading-collection">Application Details</div>
                                <div className="loantitle pl-2 pt-2 pb-0">Basic Details</div>
                                <Row style={{ padding: "1%" }}>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Applicant's Full Name</div>
                                        <div className="collection-content">
                                            {formatString(storeGetServiceResp?.applicantId?.fullName) || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">
                                            Applicant's Mobile Number
                                        </div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.primaryMobile || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Applicant Email ID</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.primaryEmail || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Date Of Birth</div>
                                        <div className="collection-content">
                                            {dayjs(storeGetServiceResp?.applicantId?.dob).format("DD-MM-YYYY") || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Gender</div>
                                        <div className="collection-content">
                                            {formatString(storeGetServiceResp?.applicantId?.gender?.value) || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">KYC Verification Document</div>
                                        <div className="collection-content">
                                            {formatString(storeGetServiceResp?.applicantId?.kycVerification?.value) || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">{formatString(storeGetServiceResp?.applicantId?.kycVerification?.value)} Number</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.kycId
                                                ? storeGetServiceResp.applicantId.kycId.match(/.{1,4}/g).join(' ')
                                                : "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">{formatString(storeGetServiceResp?.applicantId?.kycVerification?.value)} Front</div>
                                        <div style={{ display: "flex", color: "green" }}>
                                            <EyeOutlined />
                                            <a
                                                style={{ paddingLeft: "5px", color: "green" }}
                                                onClick={() =>
                                                    handleClickToView(fetchAllDocuments[0]?.metadata?.type, fetchAllDocuments[0]?.link)
                                                }
                                            >
                                                CLICK TO VIEW
                                            </a>
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">{formatString(storeGetServiceResp?.applicantId?.kycVerification?.value)} Back</div>
                                        <div style={{ display: "flex", color: "green" }}>
                                            <EyeOutlined />
                                            <a
                                                onClick={() =>
                                                    handleClickToView(fetchAllDocuments[1]?.metadata?.type, fetchAllDocuments[1]?.link)
                                                }
                                                style={{ paddingLeft: "5px", color: "green" }}
                                            >
                                                CLICK TO VIEW
                                            </a>
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">PAN Number</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.pancardId || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">PAN Card</div>
                                        <div style={{ display: "flex", color: "green" }}>
                                            <EyeOutlined />
                                            <a
                                                onClick={() =>
                                                    handleClickToView(fetchAllDocuments[2]?.metadata?.type, fetchAllDocuments[2]?.link)
                                                }
                                                style={{ paddingLeft: "5px", color: "green" }}
                                            >
                                                CLICK TO VIEW
                                            </a>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="loantitle pl-2 pt-2 pb-0">
                                    Permanent Address Details
                                </div>
                                <Row style={{ padding: "1%" }}>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">
                                            Permanent Address Line 1
                                        </div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.permanentAddress
                                                ?.addressLine1 || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">
                                            Permanent Address Line 2
                                        </div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.permanentAddress
                                                ?.addressLine2 || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Area</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.permanentAddress?.area ||
                                                "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">City/Village</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.permanentAddress?.city ||
                                                "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">State</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.permanentAddress
                                                ?.state || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Country</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.permanentAddress
                                                ?.country || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Pincode</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.permanentAddress
                                                ?.pincode || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Latitude</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.permanentAddress
                                                ?.latitude || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Longitude</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.applicantId?.permanentAddress
                                                ?.longitude || "--"}
                                        </div>
                                    </Col>
                                </Row>
                                {storeGetServiceResp?.applicantId?.isCurrentAddressSameAsPermenantAddress ? (
                                    <Checkbox
                                        name="isCurrentAddressSameAsPermenantAddress"
                                        checked={storeGetServiceResp?.applicantId?.isCurrentAddressSameAsPermenantAddress}
                                        className="p-2"
                                    >
                                        Is Current address same as Permanent address
                                    </Checkbox>
                                ) : (
                                    <><div className="loantitle pl-2 pt-2 pb-0">
                                        Current Address Details
                                    </div><Row style={{ padding: "1%" }}>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    Current Address Line 1
                                                </div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.applicantId?.currentAddress
                                                        ?.addressLine1 || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    Current Address Line 2
                                                </div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.applicantId?.currentAddress
                                                        ?.addressLine2 || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Area</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.applicantId?.currentAddress?.area ||
                                                        "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">City/Village</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.applicantId?.currentAddress?.city ||
                                                        "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">State</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.applicantId?.currentAddress
                                                        ?.state || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Country</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.applicantId?.currentAddress
                                                        ?.country || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Pincode</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.applicantId?.currentAddress
                                                        ?.pincode || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Latitude</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.applicantId?.currentAddress
                                                        ?.latitude || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Longitude</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.applicantId?.currentAddress
                                                        ?.longitude || "--"}
                                                </div>
                                            </Col>
                                        </Row></>)}

                                <div className="loantitle pl-2 pt-2 pb-0">
                                    Co-Applicant Details
                                </div>
                                <Row style={{ padding: 10 }}>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Full Name</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.fullName || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Primary Email</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.primaryEmail || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">primary Mobile</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.primaryMobile || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">date of birth</div>
                                        <div className="collection-content">
                                            {dayjs(storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.dob).format("DD-MM-YYYY") || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Gender</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.gender.value || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Relationship</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.relationShip || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Kyc Verification</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.kycVerification?.value || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">pancard Id</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.pancardId || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">address Line1</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.addressLine1 || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">address Line2</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.addressLine2 || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">area</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.area || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">state</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.state || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">city</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.city || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">country</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.country || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">pincode</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.pincode || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">latitude</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.latitude || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">longitude</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.longitude || "--"}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>

                            <Col
                                style={{
                                    border: "1px solid lightgray",
                                    borderRadius: 6,
                                    marginTop: 10,
                                }}
                                xl={18}
                                sm={24}
                                lg={18}
                                xs={24}
                                md={18}
                            >
                                <div className="heading-collection">Existing Loan Details</div>
                                <div className="loantitle pl-2 pt-2 pb-0">
                                    Credit Bureau Details
                                </div>
                                <Row style={{ padding: "1%" }}>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Date & time</div>
                                        <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.Date || "--"} & {storeGetServiceResp?.equifaxDetail?.Time || "--"}</div>
                                    </Col>

                                    {store === "entity" ? <>
                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Commercial Score</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.commercialBureauResp?.CommercialScore || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">CF Count</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.commercialBureauResp?.year_wise_detail?.['2024-2025']?.CF_Count || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">OpenCF Count</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.commercialBureauResp?.year_wise_detail?.['2024-2025']?.OpenCF_Count || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Lenders Count</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.commercialBureauResp?.year_wise_detail?.['2024-2025']?.Lenders_Count || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Sanctioned Amt OpenCF Sum</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.commercialBureauResp?.year_wise_detail?.['2024-2025']?.SanctionedAmtOpenCF_Sum || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Current Balance OpenCF Sum</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.commercialBureauResp?.year_wise_detail?.['2024-2025']?.CurrentBalanceOpenCF_Sum || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">OpenCF Count</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.commercialBureauResp?.year_wise_detail?.['2024-2025']?.OpenCF_Count || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Overdue Amount Sum</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.commercialBureauResp?.year_wise_detail?.['2024-2025']?.CF_Count || "--"}</div>
                                        </Col>
                                    </> : <>
                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">MFI Score</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.micro_finance?.score[0]?.Value || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={12}
                                            sm={24}
                                            xs={24}
                                            lg={12}
                                            md={12}
                                        >
                                            <div className="collection-title">Retail Score</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.retail?.score[0]?.Value || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <div style={{ fontSize: "18px", fontWeight: "bold" }}>Retail</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">No Of Accounts</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.retail?.detail?.NoOfAccounts || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">No Of Active Accounts</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.retail?.detail?.NoOfActiveAccounts || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Total PastDue</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.retail?.detail?.TotalPastDue || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">No Of PastDue Accounts</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.retail?.detail?.NoOfPastDueAccounts || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Total Balance Amount</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.retail?.detail?.TotalBalanceAmount || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Total Sanction Amount</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.retail?.detail?.TotalSanctionAmount || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Total Credit Limit</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.retail?.detail?.TotalCreditLimit || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Total Monthly Payment Amount</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.retail?.detail?.TotalMonthlyPaymentAmount || "--"}</div>
                                        </Col>


                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <div style={{ fontSize: "18px", fontWeight: "bold" }}>Micro Finance</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">No Of Active Accounts</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.micro_finance?.detail?.NoOfActiveAccounts || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Total Past Due</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.micro_finance?.detail?.TotalPastDue || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">No Of PastDue Accounts</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.micro_finance?.detail?.NoOfPastDueAccounts || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Total Balance Amount</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.micro_finance?.detail?.TotalBalanceAmount || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Total Monthly Payment Amount</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.micro_finance?.detail?.TotalMonthlyPaymentAmount || "--"}</div>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={6}
                                            sm={24}
                                            xs={24}
                                            lg={6}
                                            md={6}
                                        >
                                            <div className="collection-title">Total Written OffAmount</div>
                                            <div className="collection-content">{storeGetServiceResp?.equifaxDetail?.micro_finance?.detail?.TotalWrittenOffAmount || "--"}</div>
                                        </Col>
                                    </>}
                                </Row>

                                {storeGetServiceResp?.existingLoanDetails?.length > 0 &&
                                    storeGetServiceResp?.existingLoanDetails?.map((item, index) => {
                                        return (
                                            <>
                                                <div className="loantitle pl-2 pt-2 pb-0">
                                                    Existing Loan Details {index + 1} - {item?.bankName}
                                                </div>
                                                <Row style={{ padding: "1%" }}>
                                                    <Col
                                                        className="column-collection"
                                                        xl={6}
                                                        sm={24}
                                                        xs={24}
                                                        lg={6}
                                                        md={6}
                                                    >
                                                        <div className="collection-title">Bank Name</div>
                                                        <div className="collection-content">
                                                            {item?.bankName || "--"}
                                                        </div>
                                                    </Col>
                                                    <Col
                                                        className="column-collection"
                                                        xl={6}
                                                        sm={24}
                                                        xs={24}
                                                        lg={6}
                                                        md={6}
                                                    >
                                                        <div className="collection-title">
                                                            Nature of facility
                                                        </div>
                                                        <div className="collection-content">
                                                            {formatString(item?.numberOfFacility?.value) || "--"}
                                                        </div>
                                                    </Col>
                                                    <Col
                                                        className="column-collection"
                                                        xl={6}
                                                        sm={24}
                                                        xs={24}
                                                        lg={6}
                                                        md={6}
                                                    >
                                                        <div className="collection-title">
                                                            Sanctioned Amount
                                                        </div>
                                                        <div className="collection-content">
                                                            {formatNumberWithCommas(item?.sanctionedAmount) || "--"}
                                                        </div>
                                                    </Col>
                                                    <Col
                                                        className="column-collection"
                                                        xl={6}
                                                        sm={24}
                                                        xs={24}
                                                        lg={6}
                                                        md={6}
                                                    >
                                                        <div className="collection-title">
                                                            Present Outstanding
                                                        </div>
                                                        <div className="collection-content">
                                                            {formatNumberWithCommas(item?.presentOutstanding) || "--"}
                                                        </div>
                                                    </Col>
                                                    <Col
                                                        className="column-collection"
                                                        xl={6}
                                                        sm={24}
                                                        xs={24}
                                                        lg={6}
                                                        md={6}
                                                    >
                                                        <div className="collection-title">
                                                            Security offered{" "}
                                                        </div>
                                                        <div className="collection-content">
                                                            {item?.securityOffered?.value || "--"}
                                                        </div>
                                                    </Col>
                                                    <Col
                                                        className="column-collection"
                                                        xl={6}
                                                        sm={24}
                                                        xs={24}
                                                        lg={6}
                                                        md={6}
                                                    >
                                                        <div className="collection-title">
                                                            Active Monthly EMI
                                                        </div>
                                                        <div className="collection-content">
                                                            {formatNumberWithCommas(item?.activeMontlyEMI) || "--"}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </>
                                        );
                                    })}
                            </Col>

                            <Col
                                style={{
                                    border: "1px solid lightgray",
                                    borderRadius: 6,
                                    marginTop: 10,
                                }}
                                xl={18}
                                sm={24}
                                lg={18}
                                xs={24}
                                md={18}
                            >
                                {store === "entity" ? (
                                    <>
                                        <div className="heading-collection">Entity Details</div>
                                        <div className="loantitle pl-2 pt-2 pb-0">
                                            Business Details
                                        </div>
                                        <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]} style={{ padding: "1%" }}>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={8}
                                                md={8}
                                            >
                                                <div className="collection-title">Entity Name</div>
                                                <div className="collection-content">
                                                    {formatString(storeGetServiceResp?.entityDetails?.businessDetails
                                                        ?.entityName) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={8}
                                                md={8}
                                            >
                                                <div className="collection-title">Type Of Company</div>
                                                <div className="collection-content">
                                                    {formatString(storeGetServiceResp?.entityDetails?.businessDetails
                                                        ?.typeOfCompany?.value) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={8}
                                                md={6}
                                            >
                                                <div className="collection-title">Monthly Sales</div>
                                                <div className="collection-content">
                                                    {formatNumberWithCommas(storeGetServiceResp?.entityDetails?.businessDetails
                                                        ?.monthlySales) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={24}
                                                md={24}
                                            >
                                                <div className="collection-title">Business PAN Number</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.entityDetails?.businessDetails
                                                        ?.pancardId || "--"}
                                                </div>
                                            </Col>

                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Business PAN Card</div>
                                                <div style={{ display: "flex", color: "green" }}>
                                                    <EyeOutlined />
                                                    <a
                                                        onClick={() =>
                                                            handleClickToView(fetchAllDocuments[3]?.metadata?.type, fetchAllDocuments[3]?.link)
                                                        }
                                                        style={{ paddingLeft: "5px", color: "green" }}
                                                    >
                                                        CLICK TO VIEW
                                                    </a>
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Business Document </div>
                                                <div className="collection-content">
                                                    {formatString(storeGetServiceResp?.entityDetails?.businessDetails
                                                        ?.businessDocName?.value) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    Date of Incoporation
                                                </div>
                                                <div className="collection-content">
                                                    {dayjs(storeGetServiceResp?.entityDetails?.businessDetails
                                                        ?.dateOfIncoporation).format("DD-MM-YYYY") || "--"}
                                                </div>
                                            </Col>

                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Company Premise</div>
                                                <div className="collection-content">
                                                    {formatString(storeGetServiceResp?.entityDetails?.businessDetails
                                                        ?.companyPremise?.value) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    % Shares in Business or Partnership?
                                                </div>
                                                <div className="collection-content">
                                                    {`${storeGetServiceResp?.entityDetails?.businessDetails
                                                        ?.shareInBusinessOrPartnership} %` || "--"}
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="loantitle pl-2 pt-2 pb-0">
                                            Address Details
                                        </div>
                                        <Row style={{ padding: "1%" }}>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    Permanent Address Line 1
                                                </div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.entityDetails?.address
                                                        ?.addressLine1 || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    Permanent Address Line 2
                                                </div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.entityDetails?.address
                                                        ?.addressLine2 || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Area</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.entityDetails?.address?.area ||
                                                        "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">City</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.entityDetails?.address?.city ||
                                                        "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">State</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.entityDetails?.address?.state ||
                                                        "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Country</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.entityDetails?.address?.country ||
                                                        "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Pincode</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.entityDetails?.address?.pincode ||
                                                        "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Latitude</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.entityDetails?.address
                                                        ?.latitude || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Longitude</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.entityDetails?.address
                                                        ?.longitude || "--"}
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="loantitle pl-2 pt-2 pb-0">
                                            Financial Details
                                        </div>
                                        <Row style={{ padding: "1%" }}>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    Monthly net sales income
                                                </div>
                                                <div className="collection-content">
                                                    {formatNumberWithCommas(storeGetServiceResp?.entityDetails?.financialDetails
                                                        ?.montlyNetSaleIncome) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    Cash balance of the company
                                                </div>
                                                <div className="collection-content">
                                                    {formatNumberWithCommas(storeGetServiceResp?.entityDetails?.financialDetails
                                                        ?.cashBalanceOfTheCompany) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Net worth</div>
                                                <div className="collection-content">
                                                    {formatNumberWithCommas(storeGetServiceResp?.entityDetails?.financialDetails
                                                        ?.netWorth) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">No. of employees</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.entityDetails?.financialDetails
                                                        ?.noOfEmployees || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    Sales projection for next two years
                                                </div>
                                                <div className="collection-content">
                                                    {formatNumberWithCommas(storeGetServiceResp?.entityDetails?.financialDetails
                                                        ?.salesProjectionForNextTwoYears) || "--"}
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                ) : (
                                    <>
                                        <div className="heading-collection">Individual Details</div>
                                        <div className="loantitle pl-2 pt-2 pb-0">
                                            Individual Details
                                        </div>
                                        <Row style={{ padding: "1%" }}>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    Individual Documents
                                                </div>
                                                <div style={{ display: "flex", color: "green" }}>
                                                    <EyeOutlined />
                                                    <a
                                                        onClick={() => handleClickToView(employmentDocument[0]?.metadata?.type, employmentDocument[0]?.link)}
                                                        style={{ paddingLeft: "5px", color: "green" }}
                                                    >
                                                        CLICK TO VIEW
                                                    </a>
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Employer's Name</div>
                                                <div className="collection-content">
                                                    {formatString(storeGetServiceResp?.employmentDetails?.details
                                                        ?.employeeName) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Occupation</div>
                                                <div className="collection-content">
                                                    {formatString(storeGetServiceResp?.employmentDetails?.details
                                                        ?.occupation?.value) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    Nature of Employment
                                                </div>
                                                <div className="collection-content">
                                                    {formatString(storeGetServiceResp?.employmentDetails?.details
                                                        ?.natureOfEmployment?.value) || "--"}
                                                </div>
                                            </Col>

                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    Years of Experience
                                                </div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.employmentDetails?.details
                                                        ?.yrsOfExp || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Education</div>
                                                <div className="collection-content">
                                                    {formatString(storeGetServiceResp?.employmentDetails?.details
                                                        ?.education?.value) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Marital status</div>
                                                <div className="collection-content">
                                                    {formatString(storeGetServiceResp?.employmentDetails?.details
                                                        ?.maritalStatus?.value) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Residential Status</div>
                                                <div className="collection-content">
                                                    {formatString(storeGetServiceResp?.employmentDetails?.details
                                                        ?.residentialStatus?.value) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">
                                                    No of years in the current Residence
                                                </div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.employmentDetails?.details
                                                        ?.noOfYrsInCurrentResidence || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Residence</div>
                                                <div className="collection-content">
                                                    {formatString(storeGetServiceResp?.employmentDetails?.details
                                                        ?.residence?.value) || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">No of dependents</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.employmentDetails?.details
                                                        ?.noOfDependents || "--"}
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="loantitle pl-2 pt-2 pb-0">
                                            Address Details
                                        </div>
                                        <Row style={{ padding: "1%" }}>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Address Line 1</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.employmentDetails?.address
                                                        ?.addressLine1 || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Address Line 2</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.employmentDetails?.address
                                                        ?.addressLine2 || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Area</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.employmentDetails?.address
                                                        ?.area || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">City</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.employmentDetails?.address
                                                        ?.city || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">State</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.employmentDetails?.address
                                                        ?.state || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Country</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.employmentDetails?.address
                                                        ?.country || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Pincode</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.employmentDetails?.address
                                                        ?.pincode || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Latitude</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.employmentDetails?.address
                                                        ?.latitude || "--"}
                                                </div>
                                            </Col>
                                            <Col
                                                className="column-collection"
                                                xl={6}
                                                sm={24}
                                                xs={24}
                                                lg={6}
                                                md={6}
                                            >
                                                <div className="collection-title">Longitude</div>
                                                <div className="collection-content">
                                                    {storeGetServiceResp?.employmentDetails?.address
                                                        ?.longitude || "--"}
                                                </div>
                                            </Col>
                                        </Row>

                                    </>
                                )}
                            </Col>

                            <Col
                                style={{
                                    border: "1px solid lightgray",
                                    borderRadius: 6,
                                    marginTop: 10,
                                }}
                                xl={18}
                                sm={24}
                                lg={18}
                                xs={24}
                                md={18}
                            >
                                <div className="heading-collection">Bank Details</div>

                                <Row style={{ padding: "1%" }}>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Bank Documents</div>
                                        <div className="collection-content">
                                            {formatString(storeGetServiceResp?.bankDetails?.bankDocName?.value) || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">{formatString(bankDocument[0]?.key === "cancelCheque" ? "Cancelled Cheque" : bankDocument[0]?.key)}</div>
                                        <div style={{ display: "flex", color: "green" }}>
                                            <EyeOutlined />
                                            <a
                                                onClick={() => handleClickToView(bankDocument[0]?.metadata?.type, bankDocument[0]?.link)}
                                                style={{ paddingLeft: "5px", color: "green" }}
                                            >
                                                CLICK TO VIEW
                                            </a>
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">IFSC Code</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.bankDetails?.ifscCode || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Account Number</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.bankDetails?.accountNumber || "--"}
                                        </div>
                                    </Col>

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Account Holder Name</div>
                                        <div className="collection-content">
                                            {formatString(storeGetServiceResp?.bankDetails?.accountHolderName) ||
                                                "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Branch Name</div>
                                        <div className="collection-content">
                                            {formatString(storeGetServiceResp?.bankDetails?.branchName) || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">MICR Code</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.bankDetails?.micrCode || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Bank name</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.bankDetails?.bankName || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Account Type</div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.bankDetails?.accountType || "--"}
                                        </div>
                                    </Col>
                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">
                                            Year of relation with bank
                                        </div>
                                        <div className="collection-content">
                                            {storeGetServiceResp?.bankDetails
                                                ?.noOfYrsOfRelationWithBank || "--"}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>

                            <Col
                                style={{
                                    border: "1px solid lightgray",
                                    borderRadius: 6,
                                    marginTop: 10,
                                }}
                                xl={18}
                                sm={24}
                                lg={18}
                                xs={24}
                                md={18}
                            >
                                {store === 'individual' ?
                                    <><div className="heading-collection">House visit Review</div><Row style={{ padding: "1%" }}>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        1. How many people aged less than 18 years are in the
                                                        household?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[0]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[0]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        2. What is the household's principal occupation?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[1]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[1]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        3. Is the residence of rented house/ kachha or pakka (burnt
                                                        bricks, stone, cement, concrete,jackboard / cement-plastered
                                                        reeds, timber, tiles, galvanised tin or asbestos cement
                                                        sheets)?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[2]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[2]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        4. What is the household's primary source of enery for
                                                        cooking?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[3]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[3]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        5. Does the household own a television?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[4]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[4]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        6. Does the household own a, cycle,scooter, or motor cycle?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[5]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[5]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        7. Does the household own aalmirah / dressing table?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[6]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[6]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        8. Does anyone study at home?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[7]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[7]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        9. What kind of phones deos the household own?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[8]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[8]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        10. How many electric fans does the household own?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[9]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[9]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        11. Are you an existing Customer?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[10]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[10]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>

                                        {storeGetServiceResp?.proposalAssessment[10]?.value === "No" ? null :
                                            <><Col
                                                className="column-collection"
                                                xl={24}
                                                sm={24}
                                                xs={24}
                                                lg={24}
                                                md={24}
                                            >
                                                <Row>
                                                    <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                        <div className="collection-title">
                                                            12. If Yes, Please provide your existing Customer ID/Loan ID?
                                                        </div>
                                                        <div className="collection-title">Response:</div>
                                                        <div className="collection-content">{storeGetServiceResp?.proposalAssessment[11]?.value}</div>
                                                    </Col>
                                                    {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                        {storeGetServiceResp?.proposalAssessment[11]?.score}
                                                    </Col> */}
                                                </Row>
                                            </Col><Col
                                                className="column-collection"
                                                xl={24}
                                                sm={24}
                                                xs={24}
                                                lg={24}
                                                md={24}
                                            >
                                                    <Row>
                                                        <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                            <div className="collection-title">
                                                                13. Since how many years have you been associated with this financial institution?
                                                            </div>
                                                            <div className="collection-title">Response:</div>
                                                            <div className="collection-content">{storeGetServiceResp?.proposalAssessment[12]?.value}</div>
                                                        </Col>
                                                        {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                            {storeGetServiceResp?.proposalAssessment[12]?.score}
                                                        </Col> */}
                                                    </Row>
                                                </Col></>
                                        }
                                    </Row>

                                    </> :

                                    <><div className="heading-collection">Bussiness Assessment</div><Row style={{ padding: "1%" }}>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        Name of the Entity
                                                        household?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.entityDetails?.businessDetails?.entityName}</div>
                                                </Col>
                                                {/* <Col xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    Score
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        1.  Date of Commencement of Business
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{dayjs(storeGetServiceResp?.proposalAssessment[0]?.value).format("DD-MM-YYYY")}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[0]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        2. Is Your Business Registered?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[1]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[1]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        3. Type of Company
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[2]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[2]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        4. Is the business managed from Residence or a Business Office?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[3]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[3]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        5.  Are you Founder/Co-Founder or did you start the business?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[4]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[4]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        6.  Pls specify the number of founders/ directors/ partners/ stakeholders in the company?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[5]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[5]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        7. Total No Of Employees?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[6]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[6]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        8.Do you maintain the company audited book of accounts?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[7]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[7]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        9. What is the monthly sales (lakhs) of the company?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[8]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[8]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        10.  Is there any growth in profit (%) as compared to last finacial year & by how much?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[9]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[9]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        11. Is there any active Secured/ Unsecured loans of the business?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[10]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[10]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        12. Have you or any of the directors/ partners defaulted on the loans?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[11]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[11]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>

                                        <Col
                                            className="column-collection"
                                            xl={24}
                                            sm={24}
                                            xs={24}
                                            lg={24}
                                            md={24}
                                        >
                                            <Row>
                                                <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                    <div className="collection-title">
                                                        13. Are you an existing Customer?
                                                    </div>
                                                    <div className="collection-title">Response:</div>
                                                    <div className="collection-content">{storeGetServiceResp?.proposalAssessment[12]?.value}</div>
                                                </Col>
                                                {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                    {storeGetServiceResp?.proposalAssessment[12]?.score}
                                                </Col> */}
                                            </Row>
                                        </Col>
                                        {storeGetServiceResp?.proposalAssessment[12]?.value === "No" ? null :
                                            <><Col
                                                className="column-collection"
                                                xl={24}
                                                sm={24}
                                                xs={24}
                                                lg={24}
                                                md={24}
                                            >
                                                <Row>
                                                    <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                        <div className="collection-title">
                                                            14. If Yes, Please provide your existing Customer ID/Loan ID?
                                                        </div>
                                                        <div className="collection-title">Response:</div>
                                                        <div className="collection-content">{storeGetServiceResp?.proposalAssessment[13]?.value}</div>
                                                    </Col>
                                                    {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                        {storeGetServiceResp?.proposalAssessment[13]?.score}
                                                    </Col> */}
                                                </Row>
                                            </Col><Col
                                                className="column-collection"
                                                xl={24}
                                                sm={24}
                                                xs={24}
                                                lg={24}
                                                md={24}
                                            >
                                                    <Row>
                                                        <Col xl={20} md={20} xs={20} lg={20} sm={20}>
                                                            <div className="collection-title">
                                                                15. Since how many years have you been associated with this financial institution?
                                                            </div>
                                                            <div className="collection-title">Response:</div>
                                                            <div className="collection-content">{storeGetServiceResp?.proposalAssessment[14]?.value}</div>
                                                        </Col>
                                                        {/* <Col className="score-align" xl={4} md={4} xs={4} lg={4} sm={4}>
                                                            {storeGetServiceResp?.proposalAssessment[14]?.score}
                                                        </Col> */}
                                                    </Row>
                                                </Col>
                                            </>
                                        }
                                    </Row></>
                                }
                            </Col>

                            <Col
                                style={{
                                    border: "1px solid lightgray",
                                    borderRadius: 6,
                                    marginTop: 10,
                                }}
                                xl={18}
                                sm={24}
                                lg={18}
                                xs={24}
                                md={18}
                            >
                                <div className="heading-collection">Document Upload</div>
                                <div className="loantitle pl-2 pt-2 pb-0">
                                    Applicant Documents
                                </div>
                                <Row style={{ padding: "1%" }}>
                                    {applicantDcument?.length > 0 ? applicantDcument?.map((item) => {
                                        return (
                                            <>
                                                <Col
                                                    className="column-collection"
                                                    xl={6}
                                                    sm={24}
                                                    xs={24}
                                                    lg={6}
                                                    md={6}
                                                >
                                                    <div className="collection-title">{formatString(item?.key)}</div><xs style={{ display: "flex", color: "green" }}>
                                                        <EyeOutlined />
                                                        <a
                                                            onClick={() => handleClickToView(item?.metadata?.type, item?.link)}
                                                            style={{ paddingLeft: "5px", color: "green" }}
                                                        >
                                                            CLICK TO VIEW
                                                        </a>
                                                    </xs>
                                                </Col>
                                            </>
                                        )
                                    }) : null
                                    }

                                    <Col
                                        className="column-collection"
                                        xl={6}
                                        sm={24}
                                        xs={24}
                                        lg={6}
                                        md={6}
                                    >
                                        <div className="collection-title">Video KYC</div><xs style={{ display: "flex", color: "green" }}>
                                            <EyeOutlined />
                                            <a
                                                onClick={() => handleClickToView("video/webm", kycdetail?.videoS3File)}
                                                style={{ paddingLeft: "5px", color: "green" }}
                                            >
                                                CLICK TO VIEW
                                            </a>
                                        </xs>
                                    </Col>
                                </Row>


                            </Col>

                            <Col
                                style={{
                                    border: "1px solid lightgray",
                                    borderRadius: 6,
                                    marginTop: 10,
                                    marginBottom: 20
                                }}
                                xl={18}
                                sm={24}
                                lg={18}
                                xs={24}
                                md={18}
                            >
                                <div className="loantitle pl-2 pt-2 pb-0">
                                    {store === "entity" ? "Entity Documents" : "Individual Documents"}
                                </div>
                                <Row style={{ padding: "1%" }}>
                                    {entityDocument?.length > 0 ? entityDocument?.map((item) => {
                                        return (
                                            <>
                                                <Col
                                                    className="column-collection"
                                                    xl={6}
                                                    sm={24}
                                                    xs={24}
                                                    lg={6}
                                                    md={6}
                                                >
                                                    <div className="collection-title">{formatString(item?.key)}</div><xs style={{ display: "flex", color: "green" }}>
                                                        <EyeOutlined />
                                                        <a
                                                            onClick={() => handleClickToView(item?.metadata?.type, item?.link)}
                                                            style={{ paddingLeft: "5px", color: "green" }}
                                                        >
                                                            CLICK TO VIEW
                                                        </a>
                                                    </xs>
                                                </Col>
                                            </>
                                        )
                                    }) : null
                                    }
                                </Row>


                            </Col>

                            {/* <Col
                    style={{
                        border: "1px solid lightgray",
                        borderRadius: 6,
                        marginTop: 10,
                    }}
                    xl={18}
                    sm={24}
                    lg={18}
                    xs={24}
                    md={18}
                >
                    <Row style={{ padding: "1%" }}>
                        <Col
                            className="column-collection"
                            xl={24}
                            sm={24}
                            xs={24}
                            lg={6}
                            md={6}
                        >
                            <Checkbox className="checkboxText">Please accept the terms and condition</Checkbox>
                        </Col>
                        <Col
                            className="column-collection"
                            xl={24}
                            sm={24}
                            xs={24}
                            lg={6}
                            md={6}
                        >
                            <div
                                style={{ display: "flex", justifyContent: "space-between" }}
                            >
                                <Button
                                    className="cancel"
                                    onClick={() => setOpenSummaryModal(false)}
                                >
                                    Cancel
                                </Button>
                                <div className="savebuttons">
                                    <Button
                                        className="savebtn"
                                        onClick={handleFinalSubmission}
                                    >
                                        Final Submission
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col> */}
                        </Row >
                        <Modal
                            visible={iframeModal}
                            width={800}
                            onOk={handleIFrameOk}
                            onCancel={handleIFrameCancel}
                        >
                            {DocumentType === "application/pdf" ?
                                <>
                                    <embed
                                        src={keyDocument}
                                        type="application/pdf"
                                        width="100%"
                                        height="600px"
                                    />
                                </> : DocumentType === "video/webm" ?
                                    <>
                                        <video controls width="600">
                                            <source src={keyDocument} type="video/webm" />
                                        </video>
                                    </>
                                    :
                                    <img style={{ width: "100%" }} className='image-web-document' src={keyDocument} />
                            }
                        </Modal>

                        <Modal
                            visible={iframeModal1}
                            width={800}
                            onOk={handleIFrameOk1}
                            onCancel={handleIFrameCancel1}
                            title="Physical Mandate Document"
                        >
                            <Dragger {...props} beforeUpload={() => false} name="file" multiple={false} onChange={handleUpload}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Drag & Drop files here</p>
                                <p className="ant-upload-hint">
                                    Only .pdf allowed. File limit is 25MB.
                                </p>
                            </Dragger>
                        </Modal>
                    </div >
                </div>
            </Spin>
        </>
    )
}

export default DisbursmentView