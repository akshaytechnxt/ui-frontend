import { useEffect, useState, useRef } from "react";
import BasicDetails from "./BasicDetails";
import ExistingLoanDetails from "./ExistingLoanDetails";
import LoanDetails from "./LoanDetails";
import { Button, Col, Modal, Row, message, Checkbox } from "antd";
import axiosRequest from "../../axios-request/API.request"
import EntityDetails from "./EntityDetails";
import BankDetails from "./BankDetails";
import DocumentUpload from "./DocumentUpload";
import SuccessApplication from "./SuccessApplication";
import EmploymentDetails from "./EmploymentDetails";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  fetchProposalById,
} from "../../state/slices/proposalSlice";
import "../../components/Todo/ActivityCalendar.css";
import "./LoanApplication.css";
import {
  setSubmitResponse,
  updateProposalApplicationById,
} from "../../state/slices/ProposalApplicationSlice";
import { useLocation, useNavigate } from "react-router-dom";
import HouseVisitQuestions from "./HouseVisitQuestions";
import BussinessAssesmentQuestion from "./BusinessAssesmentQuestion";
import { setLoader } from "../../state/slices/loader";
import {
  fetchAllProposalById,
} from "../../state/slices/getAllProposalSlice";
import Sdloader from "../../components/Loader/FullPageLoader";
import { EyeOutlined } from "@ant-design/icons";
import PDFViewer from 'pdf-viewer-reactjs'
import { Form } from 'antd';

const ApplicationDetails = ({ activeTab = '1' }) => {
  const [form] = Form.useForm();
  const storeGetServiceResp = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data
  );
  const applicantData = storeGetServiceResp?.applicantId || {};
  const documentsData = useSelector((state) => state?.document)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyDocument, setKeyDocument] = useState("");
  const [bankDocument, setBankDocument] = useState("")
  const [kycdetail, setKycDetail] = useState("")
  const [employmentDocument, setEmploymentDocument] = useState("")
  const [entityDocument, setEntityDocument] = useState("")
  const [applicantDcument, setApplicantDocument] = useState("")
  const [status, setStatus] = useState("")
  const fetchAllDocuments = useSelector(
    (state) => state?.fetchAllProposal?.proposal?.data
  );
  const applicantsId = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?.applicantId?._id
  );
  const store = useSelector(
    (state) =>
      state?.fetchProposal?.proposal?.data?.data?.loanDetails?.applicationType?.value
  );

  const id = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?._id
  );
  const location = useLocation();

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

  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [iframeModal, setIframeModal] = useState(false);
  const [iframeterms, setIframeTerms] = useState(false)
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [checkedButton, setCheckedButton] = useState(false)
  const [disabledSubmission, setDisabledSubmission] = useState(true)
  const [keyType, setKeyType] = useState("")
  const [formData, setFormData] = useState({
    dob: null,
    dob1: null,
    applicantfullname: '',
    primaryEmail: '',
    primaryMobile: '',
    gender: null,
    kycVerification: null,
    kycId: '',
    pancardId: '',
    addressLine1: '',
    addressLine2: '',
    area: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    latitude: '',
    longitude: '',
    isCurrentAddressSameAsPermenantAddress: false,
    currentaddressLine1: '',
    currentaddressLine2: '',
    currentarea: '',
    currentcity: '',
    currentstate: '',
    currentcountry: '',
    currentpincode: '',
    currentlatitude: '',
    currentlongitude: '',
    fullName1: '',
    primaryEmail1: '',
    primaryMobile1: '',
    gender1: null,
    relationShip1: null,
    kycVerification1: null,
    kycId1: '',
    pancardId1: '',
    addressLine11: '',
    addressLine12: '',
    area1: '',
    city1: '',
    state1: '',
    country1: '',
    pincode1: '',
    latitude1: '',
    longitude1: ''
  });
  const [existingsLoanDetails, setExistingLoanDetails] = useState([]);
  const [pageNumber, setPageNumber] = useState(2);
  const [entitysDetails, setEntityDetails] = useState({
    uniqueBusinessIdentityType: "",
    uniqueBusinessIdentityNumber: "",
    entityname: "",
    typeOfCompany: "",
    monthlySales: 0,
    pannumber: "",
    pancard: "",
    bussinessdocument: "",
    dateofincorporation: "",
    companypremise: "",
    shareinbusinessorpartnership: "",
    addressline1: "",
    addressline2: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    latitude: "",
    longitude: "",
    monthlynetsalesincome: "",
    cashbalancecompany: "",
    networth: "",
    noofemployees: "",
    salesprojectionfornexttwoyears: "",
    isBusinessRegistered: "",
  });
  const [banksDetails, setBankDetails] = useState({
    bankdocuments: "",
    bankdocname: "",
    ifsccode: "",
    accountnumber: "",
    accountholdername: "",
    branchname: "",
    micrcode: "",
    bankname: "",
    accounttype: "",
    noofyearrelationshipwithbank: "",
    repaymentPreference: "",
    eMandate: ""
  });
  const [individualDetails, setIndividualDetails] = useState({
    individualdocuments: "",
    employersname: "",
    occupation: "",
    natureofEmployment: "",
    yearsofexperience: "",
    education: "",
    maritalstatus: "",
    residentalstatus: "",
    noofyearsinthecurrentResidence: "",
    residence: "",
    noOfDependents: "",
    addressline1: "",
    addressline2: "",
    area: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (applicantData) {
      form.setFieldsValue({
        loanamount: applicantData.loanDetails?.amount,
        tenure: applicantData.loanDetails?.tenure,
        purposeofloan: applicantData.loanDetails?.purpose?.value,
      });
    }
  }, [applicantData, form]);

  const handleOk = () => {
    setOpenSummaryModal(false);
  };

  // Function to handle modal cancellation
  const handleCancel = () => {
    setOpenSummaryModal(false);
  };

  const modalPopUp = () => {
    setIframeTerms(true)
  }

  const handleIFrameOk = () => {
    setIframeModal(false);
  };

  const handleIFrameOk1 = () => {
    setIframeTerms(false);
  };

  const checkedFunction = (e) => {
    setIframeTerms(false)
    setDisabledSubmission(false)
    setCheckedButton(true)
  }

  const handleIFrameCancel = () => {
    setIframeModal(false);
  };

  const handleIFrameCancel1 = () => {
    setIframeTerms(false);
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
  const [proposalAssessment, setProposalAssessment] = useState({});

  const [cibilReport, setCibilReport] = useState("")

  const loanDetailsArray = existingsLoanDetails.map((loanDetails, index) => ({
    bankName: loanDetails[`bankName.${index}`] || '', // Ensure bankName is not empty
    numberOfFacility: loanDetails[`numberOfFacility.${index}`] || '', // Ensure numberOfFacility is not empty
    sanctionedAmount: loanDetails[`sanctionedamount.${index}`] !== null ? Number(loanDetails[`sanctionedamount.${index}`]) : '', // Convert to number if not null, else empty string
    presentOutstanding: `${loanDetails[`presentoutstanding.${index}`]}` || '', // Ensure presentOutstanding is not empty
    securityOffered: loanDetails[`securityoffered.${index}`] || '', // Ensure securityOffered is not empty
    activeMontlyEMI: loanDetails[`activemonthlyemi.${index}`] !== null ? Number(loanDetails[`activemonthlyemi.${index}`]) : '', // Convert to number if not null, else empty string
  }));

  console.log(formData, "geetha")

  const basicDetailsPayload = {
    applicant: {
      fullName: formData?.applicantfullname,
      primaryEmail: formData?.primaryEmail,
      primaryMobile: formData?.primaryMobile,
      dob: formData?.dob ? dayjs(formData?.dob).format("YYYY-MM-DD") : null,
      gender: formData?.gender,
      kycVerification: formData?.kycVerification,
      kycId: formData?.kycId,
      pancardId: formData?.pancardId,
      permanentAddress: {
        addressLine1: formData?.addressLine1,
        addressLine2: formData?.addressLine2,
        area: formData?.area,
        city: formData?.city,
        state: formData?.state,
        country: formData?.country,
        pincode: Number(formData?.pincode),
        latitude: Number(formData?.latitude),
        longitude: Number(formData?.longitude),
      },
      currentAddress: {
        addressLine1: formData?.isCurrentAddressSameAsPermenantAddress
          ? formData?.addressLine1
          : formData?.currentaddressLine1,
        addressLine2: formData?.isCurrentAddressSameAsPermenantAddress
          ? formData?.addressLine2
          : formData?.currentaddressLine2,
        area: formData?.isCurrentAddressSameAsPermenantAddress
          ? formData?.area
          : formData?.currentarea,
        city: formData?.isCurrentAddressSameAsPermenantAddress
          ? formData?.city
          : formData?.currentcity,
        state: formData?.isCurrentAddressSameAsPermenantAddress
          ? formData?.state
          : formData?.currentstate,
        country: formData?.isCurrentAddressSameAsPermenantAddress
          ? formData?.country
          : formData?.currentcountry,
        pincode: formData?.isCurrentAddressSameAsPermenantAddress
          ? Number(formData?.pincode)
          : Number(formData?.currentpincode),
        latitude: formData?.isCurrentAddressSameAsPermenantAddress
          ? Number(formData?.latitude)
          : Number(formData?.currentlatitude),
        longitude: formData?.isCurrentAddressSameAsPermenantAddress
          ? Number(formData?.longitude)
          : Number(formData?.currentlongitude),
      },
      isCurrentAddressSameAsPermenantAddress: !!formData?.isCurrentAddressSameAsPermenantAddress,
      status: "active",
    },
    coBorrowersDetail: formData?.fullName1 ? [
      {
        fullName: formData?.fullName1,
        primaryEmail: formData?.primaryEmail1,
        primaryMobile: formData?.primaryMobile1,
        dob: formData?.dob1 ? dayjs(formData?.dob1).format("YYYY-MM-DD") : "",
        gender: formData?.gender1,
        kycVerification: formData?.kycVerification1,
        kycId: formData?.kycId1,
        pancardId: formData?.pancardId1,
        relationShip: formData?.relationShip1,
        permanentAddress: {
          addressLine1: formData?.addressLine11,
          addressLine2: formData?.addressLine12,
          area: formData?.area1,
          city: formData?.city1,
          state: formData?.state1,
          country: formData?.country1,
          pincode: Number(formData?.pincode1),
          latitude: Number(formData?.latitude1),
          longitude: Number(formData?.longitude1),
        },
      },
    ] : [],
  };

  const exstingLoanDetailsPayLoad = {
    // cibilDetails: {
    //   dateTime: "2023-12-28T16:53:06+05:30",
    //   score: 10,
    //   consumerCreditReportLink:
    //     "https://file-examples.com/storage/fe90abeceb65e0e85a0f042/2017/10/file-sample_150kB.pdf",
    // },
    equifaxDetail: cibilReport,
    existingLoanDetails: loanDetailsArray,
  };
  const entityDetailsPayLoad = {
    entityDetails: {
      isBusinessRegistered: entitysDetails?.isBusinessRegistered,
      businessDetails: {
        uniqueBusinessIdentityNumber: entitysDetails?.uniqueBusinessIdentityNumber,
        uniqueBusinessIdentityType: entitysDetails?.uniqueBusinessIdentityType,
        entityName: entitysDetails?.entityname,
        typeOfCompany: entitysDetails?.typeOfCompany,
        monthlySales: Number(entitysDetails?.monthlySales),
        pancardId: entitysDetails?.pannumber,
        businessDocName: entitysDetails?.bussinessdocument,
        dateOfIncoporation: entitysDetails?.dateofincorporation
          ? dayjs(entitysDetails?.dateofincorporation).format("YYYY-MM-DD")
          : null,
        companyPremise: entitysDetails?.companypremise,
        shareInBusinessOrPartnership: Number(
          entitysDetails?.shareinbusinessorpartnership
        ),
      },
      address: {
        addressLine1: entitysDetails?.addressline1,
        addressLine2: entitysDetails?.addressline2,
        area: entitysDetails?.landmark,
        city: entitysDetails?.city,
        state: entitysDetails?.state,
        country: entitysDetails?.country,
        pincode: Number(entitysDetails?.pincode),
        latitude: Number(entitysDetails?.latitude),
        longitude: Number(entitysDetails?.longitude),
      },
      financialDetails: {
        montlyNetSaleIncome: Number(entitysDetails?.monthlynetsalesincome),
        cashBalanceOfTheCompany: Number(entitysDetails?.cashbalancecompany),
        netWorth: Number(entitysDetails?.networth),
        noOfEmployees: Number(entitysDetails?.noofemployees),
        salesProjectionForNextTwoYears: Number(
          entitysDetails?.salesprojectionfornexttwoyears
        ),
      },
    },
  };

  const bankDetailsPayLoad = {
    bankDetails: {
      bankDocName: banksDetails?.bankdocuments,
      //   bankDocuments: "ABCTY1234EFDR",
      ifscCode: banksDetails?.ifsccode,
      accountNumber: banksDetails?.accountnumber,
      accountHolderName: banksDetails?.accountholdername,
      branchName: banksDetails?.branchname,
      micrCode: banksDetails?.micrcode,
      bankName: banksDetails?.bankname,
      accountType: banksDetails?.accounttype,
      noOfYrsOfRelationWithBank: Number(
        banksDetails?.noofyearrelationshipwithbank
      ),
      repaymentPreference: banksDetails?.repaymentPreference,
      eMandate: banksDetails?.eMandate
    },
  };

  const IndividualDetailsPayload = {
    employmentDetails: {
      details: {
        individualDocName: individualDetails?.individualdocuments,
        employeeName: individualDetails?.employersname,
        occupation: individualDetails?.occupation,
        natureOfEmployment: individualDetails?.natureofEmployment,
        yrsOfExp: Number(individualDetails?.yearsofexperience), // number value
        education: individualDetails?.education,
        maritalStatus: individualDetails?.maritalstatus,
        residentialStatus: individualDetails?.residentalstatus,
        noOfYrsInCurrentResidence: Number(
          individualDetails?.noofyearsinthecurrentResidence
        ), //number value
        residence: individualDetails?.residence,
        noOfDependents: Number(individualDetails?.noOfDependents), // number value
      },
      address: {
        addressLine1: individualDetails?.addressline1,
        addressLine2: individualDetails?.addressline2,
        area: individualDetails?.area,
        city: individualDetails?.city,
        state: individualDetails?.state,
        country: individualDetails?.country,
        pincode: Number(individualDetails?.pincode),
        latitude: Number(individualDetails?.latitude),
        longitude: Number(individualDetails?.longitude),
      },
    },
  };
  console.log("indi", IndividualDetailsPayload);
  // useEffect(()=>{
  //   form.setFieldValue({
  //     applicantFullName: formData?.firstName,
  //     email: formData?.primaryEmail,
  //     mobileNumber: formData?.primaryMobile,
  //     dob: formData?.dob,
  //     gender: formData?.gender,
  //     aadharnumber: formData?.aadharDetails?.id,
  //     aadharFront: formData?.aadharDetails?.imageLink?.front,
  //     aadharBack: formData?.aadharDetails?.imageLink?.back,
  //     pancardnumber: formData?.pancardDetails?.id,
  //     pancardfront: formData?.pancardDetails?.imageLink?.front,
  //     permanentAddress1: formData?.addressLine1,
  //     permanentAddress2: formData?.addressLine2,
  //     area: formData?.area,
  //     city: formData?.city,
  //     country: formData?.country,
  //     latitude: formData?.latitude,
  //     longitude: formData?.longitude
  //   })
  // })

  // const onChange1 = (e) => {
  //   console.log("radio checked", e.target.value);
  //   setValue1(e.target.value);
  // };
  // const onChange2 = (e) => {
  //   console.log("radio checked", e.target.value);
  //   setValue2(e.target.value);
  // };

  const getVideoKycdetail = async () => {
    try {
      const response = await axiosRequest.get(`service/karza/getVideoKycDetail/${id}`);
      setKycDetail(response?.data[0]);
    } catch (error) {
      //message.error('Error fetching user data');
    }
  }

  const onChecked = (e) => {
    if (e.target.checked === false) {
      setAcceptButton(true)
    }
    else {
      setAcceptButton(false)
    }
  };

  const handleSave = () => {
    setLoading(true);
    if (currentStep < 7) {
      setCurrentStep((prevStep) => prevStep + 1);
      message.success("Saved successfully!");
    } else if (currentStep === 7) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else if (currentStep === 8) {
      navigate("/Application-Listing");
    }
    setLoading(false);
  };

  const handleFinalSubmission = () => {
    setLoading(true);
    message.success("Application submitted successfully!");
    setCurrentStep((prevStep) => prevStep + 1);
    setOpenSummaryModal(false);
    setLoading(false);
  };

  const handlePrevious = () => {
    setLoading(true);
    setCurrentStep((prevStep) => prevStep - 1);
    setLoading(false);
  };

  const formatString = (str) => {
    return str?.replace(/([A-Z])/g, " $1")?.replace(/^./, function (str) {
      return str?.toUpperCase();
    });
  };

  const handleClickToView = (key, link) => {
    setKeyType(key)
    setKeyDocument(link);
    setIframeModal(true);
  };

  const [pdfUrl, setPdfUrl] = useState(null);
  const [acceptButton, setAcceptButton] = useState(true)

  return (
    <>
      <div className="loancontainer">
        <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            {loading && <Sdloader sdloader={loading} />}
            {currentStep === 1 ? (
              <>
                <LoanDetails form={form} />
              </>
            ) : currentStep === 2 ? (
              <BasicDetails
                form={form}
                formData={formData}
                setFormData={setFormData}
                id={applicantsId}
              />
            ) : currentStep === 3 ? (
              <>
                {store === "individual" ? (
                <></>  // <EmploymentDetails
                  //   form={form}
                  //   individualDetails={individualDetails}
                  //   setIndividualDetails={setIndividualDetails}
                  //   id={id}
                  //   document="employment"
                  // />
                ) :
                  <EntityDetails
                    form={form}
                    entityDetails={entitysDetails}
                    setEntityDetails={setEntityDetails}
                    id={id}
                    document="entity"
                  />}
              </>
            ) : currentStep === 4 ? (
              <ExistingLoanDetails
                form={form}
                cibilReport={cibilReport}
                setCibilReport={setCibilReport}
                existingLoanDetails={existingsLoanDetails}
                setExistingLoanDetails={setExistingLoanDetails}
              />
            ) : currentStep === 5 ? (
              <>
                {store === "individual" ? (
                  <HouseVisitQuestions
                    form={form}
                    proposalAssessment={proposalAssessment}
                    setProposalAssessment={setProposalAssessment}
                  />
                ) : (
                  <BussinessAssesmentQuestion
                    form={form}
                    proposalAssessment={proposalAssessment}
                    setProposalAssessment={setProposalAssessment}
                  />
                )}
              </>
            ) : currentStep === 6 ? (
              <BankDetails
                form={form}
                bankDetails={banksDetails}
                setBankDetails={setBankDetails}
                id={id}
                document="bank"
              />
            ) : currentStep === 7 ? (
              <DocumentUpload id={id} applicantId={applicantsId} status={status} setStatus={setStatus} />
            ) : currentStep === 8 ? (
              <SuccessApplication id={id} />
            ) : null}
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            className="d-flex justify-content-between p-3"
          >
            {activeTab === "Application" && (
              <>
                {currentStep === 1 ? (
                  <Button
                    className="cancel"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                ) : currentStep === 8 ? null : (
                  <Button className="cancel" onClick={handlePrevious}>
                    Previous
                  </Button>
                )}
                {currentStep === 8 ? null : (
                  <>
                    {currentStep === 7 ? (
                      <>
                        <div className="savebuttons">
                          <Button className="savebtn" onClick={handleSave}
                            // disabled={status !== 'VKYC_SUCCESS'}
                          >
                            Confirmation
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="savebuttons">
                        <Button className="savebtn" onClick={handleSave}>
                          {currentStep === 7 ? "Confirmation" : "Save & Proceed"}
                        </Button>
                      </div>
                    )}
                  </>
                )}
                {/* {currentStep === 8 ? null : (
                  <div className="savebuttons">
                    <Button className="savebtn" onClick={handleSave}>
                      {currentStep === 7 ? "Confirmation" : "Save & Proceed"}
                    </Button>
                  </div>
                )} */}
              </>
            )}
          </Col>
        </Row>
        <Modal
          title="Application Summary"
          width={4000}
          visible={openSummaryModal}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Row
            className="row-loan-summary"
            style={{ display: "flex", columnGap: 10, justifyContent: "center" }}
          >
            <Col
              style={{ border: "1px solid lightgray", borderRadius: 6 }}
              xl={18}
              sm={24}
              lg={18}
              xs={24}
              md={18}
            >
              <div className="heading-collection">Merchant Details</div>
              <div className="loantitle pl-2 pt-2 pb-0">Merchant Details</div>
              <Row style={{ padding: "1%" }}>
                <Col
                  className="column-collection"
                  xl={6}
                  sm={24}
                  xs={24}
                  lg={6}
                  md={6}
                >
                  <div className="collection-title">Application for</div>
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
                 xl={18}
              sm={24}
              lg={18}
              xs={24}
              md={18}
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
              <div className="heading-collection">Existing Merchant Details</div>
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
                {/* <Col
                                className="column-collection"
                                xl={6}
                                sm={24}
                                xs={24}
                                lg={6}
                                md={6}
                            >
                                <div className="collection-title">CIBIL Report</div>
                                <div style={{ display: "flex", color: "green" }}>
                                    <EyeOutlined />
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ paddingLeft: "5px", color: "green" }}
                                    >
                                        CLICK TO VIEW
                                    </a>
                                </div>
                            </Col> */}
              </Row>

              {storeGetServiceResp?.existingLoanDetails?.length > 0 &&
                storeGetServiceResp?.existingLoanDetails?.map((item, index) => {
                  return (
                    <>
                      <div className="loantitle pl-2 pt-2 pb-0">
                        Existing Merchant Details {index + 1} - {item?.bankName}
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
              <Row style={{ padding: "1%" }}>
                <Col
                  className="column-collection"
                  xl={24}
                  sm={24}
                  xs={24}
                  lg={6}
                  md={6}
                >
                  <Checkbox checked={checkedButton} onChange={modalPopUp} className="checkboxText">Please accept the terms and condition</Checkbox>
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
                        // disabled={disabledSubmission}
                        className="savebtn"
                        onClick={handleFinalSubmission}
                      >
                        Final Submission
                      </Button>
                    </div>
                  </div>
                </Col>
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
        </Modal >

        <Modal
          visible={iframeModal}
          width={800}
          onOk={handleIFrameOk}
          onCancel={handleIFrameCancel}
        >
          {keyType === "application/pdf" ?
            <>
              <embed
                src={keyDocument}
                type="application/pdf"
                width="100%"
                height="600px"
              />
            </> : keyType === "video/webm" ?
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
          style={{ position: "initial" }}
          visible={iframeterms}
          height={600}
          width={700}
          onOk={handleIFrameOk1}
          onCancel={handleIFrameCancel1}
        >
          <div className="pdfContainer">
            <iframe width="100%" height="100%" src={pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0'} />
          </div>
          <Checkbox onChange={onChecked} className="checkboxText">Please accept the terms and condition</Checkbox>
          <div
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              className="cancel"
              style={{ marginRight: 10 }}
              onClick={handleIFrameCancel1}
            >
              Cancel
            </Button>
            <div className="savebuttons">
              <Button
                disabled={acceptButton}
                className="savebtn"
                onClick={checkedFunction}
              >
                Accept
              </Button>
            </div>
          </div>
        </Modal>
      </div >
    </>
  );
};

export default ApplicationDetails;
