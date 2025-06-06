import { Button, Col, Progress, Row, Select, Table, message, Popover } from "antd";
import React from "react";
import iconLeft from "../../assets/image/Icon Left.png";
import info from "../../assets/image/info.png";
import UploadComponent from "./UploadComponent";
import axiosRequest from "../../axios-request/API.request"
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./LoanApplication.css";
import { setAdditionalBothDocument, setAdditionalEntityDocument, setAdditionalIndividualDocument, setBankDocument, setBusinessPhotoDocument, setDocument, setEntityDocument, setResidencePhotoDocument } from "../../state/slices/documentSlice";
import { ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


const DocumentUpload = ({ id, applicantId, status, setStatus }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const kycType = useSelector((state) => state.fetchProposal?.proposal?.data?.data?.applicantId)
  const bussinessRegistedKey = useSelector((state) => state?.fetchProposal?.proposal?.data?.data?.entityDetails?.isBusinessRegistered);
  const bussinessDocKey = useSelector((state) => state?.fetchProposal?.proposal?.data?.data?.entityDetails?.businessDetails?.businessDocName?.value);
  const bankKey = useSelector((state) => state?.fetchProposal?.proposal?.data?.data?.bankDetails?.bankDocName?.value);
  const storeApplciationType = useSelector((state) => state?.fetchProposal?.proposal?.data?.data?.loanDetails?.applicationType?.value);
  const documentList = useSelector((state) => state?.fetchAllProposal?.proposal?.data);
  const [getData, setGetData] = useState([]);
  const [effectCount, setEffectCount] = useState(0);
  const [additionalDocumentBoth, setAdditionalDocumentBoth] = useState([]);
  const [statusCount, setStatusCount] = useState("")
  const [buttonLink, setButtonLink] = useState(true)
  const [additionalDocCount, setAdditionalDocCount] = useState(0)
  const [statusMsg, setStatusMsg] = useState("")
  const [entityDocCount, setEntityDocCount] = useState(0)
  const [individualCount, setIndividualCount] = useState(0)
  const [additionalDocumentEntity, setAdditionalDocumentEntity] = useState([]);
  const [additionalDocumentIndividual, setAdditionalDocumentIndividual] = useState([]);
  const [optionsArray, setOptionsArray] = useState([]);
  const [entityData, setEntityData] = useState([
    {
      key: "businessEntityPan",
      documenttype: "Business Pan Card",
    },
    ...(bussinessRegistedKey
      ? [
        {
          key: bussinessDocKey,
          documenttype: "Business Document",
        },
      ]
      : []),
    {
      key: bankKey,
      documenttype: "Bank Statement",
      extraInfo: "For the last 6 months",
    },
    {
      key: "selfieVideo",
      documenttype: "Video KYC",
    },
    {
      key: "businessBoard",
      documenttype: "Business Photo Upload",
    },
    {
      key: "Additional Documents",
      documenttype: "Additional Documents",
    },
  ]);

  const [individualData, setIndividualData] = useState([
    {
      key: "selfieVideo",
      documenttype: "Video KYC",
    },
    {
      key: "residencePhoto",
      documenttype: "Residence Photo",
    },
    {
      key: bankKey,
      documenttype: "Bank Statement",
      extraInfo: "For the last 6 months",
    },
    {
      key: additionalDocumentIndividual,
      documenttype: "Additional Documents",
    },
  ])


  useEffect(() => {
    if (bussinessDocKey) {
      let optionArray = options?.filter(
        (option) => option.value !== bussinessDocKey
      );
      setOptionsArray(optionArray);
    } else {
      setOptionsArray(options);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await axiosRequest.get(`service/karza/getVideoKycDetail/${id}`);
        if (response.data[0].status === "" || response.data[0].status === undefined || response.data[0].status === "LINK_EXPIRED" || response.data[0].status === "VKYC_FAILED") {
          setButtonLink(true)
        }
        else {
          setButtonLink(false)
        }
        setStatus(response.data[0].status)
        setStatusMsg(response.data[0].statusWiseMsg)
        setStatusCount(response)
        if (response.data[0].status === 'VKYC_SUCCESS') {
          clearInterval(interval);
        }
        if(response.data.length > 3){
          message.error("application rejected due to exceed max attempt")
          alert("Proposal Has been rejected due to customer exceeds max attempt for videoKYC")
          navigate("/dashboard")
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 5000)
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (documentList?.length > 1 && effectCount < 3) {
      let matchedBankDoc = [];
      documentList.forEach((item) => {
        if (bankKey === item.key) {
          matchedBankDoc.push({ key: item.key, link: item.link, type: item.metadata.type });
        }
      });
      if (matchedBankDoc.length > 0) {
        dispatch(setBankDocument(matchedBankDoc))
      }
      let matchedBussinessPhoto = [];
      documentList.forEach((item) => {
        if (item.key === "businessBoard") {
          matchedBussinessPhoto.push({ key: item.key, link: item.link, type: item.metadata.type });
        }
      });
      if (matchedBussinessPhoto.length > 0) {
        dispatch(setBusinessPhotoDocument(matchedBussinessPhoto))
      }
      let matchedResidencePhoto = [];
      documentList.forEach((item) => {
        if (item.key === "residencePhoto") {
          matchedResidencePhoto.push({ key: item.key, link: item.link, type: item.metadata.type });
        }
      });
      if (matchedResidencePhoto.length > 0) {
        dispatch(setResidencePhotoDocument(matchedResidencePhoto))
      }
      let matchedAdditionalDoc = [];
      let matchedAddDoc = []
      additionalDocument.forEach((type) => {
        documentList.forEach((item) => {
          if (type.value === item.key) {
            matchedAdditionalDoc.push(item.key);
            matchedAddDoc.push({ key: item.key, link: item.link, type: item.metadata.type })
          }
        });
      });
      if (matchedAdditionalDoc.length > 0) {
        dispatch(setAdditionalBothDocument(matchedAddDoc))
        setAdditionalDocumentBoth(matchedAdditionalDoc)
        setAdditionalDocCount(matchedAdditionalDoc.length)
      } else {
        setAdditionalDocumentBoth([]);
      }
      let matchedKeysEntity = [];
      let matchedEntity = []
      options.forEach((type) => {
        documentList.forEach((item) => {
          if (type.value === item.key) {
            matchedKeysEntity.push(item?.key);
            matchedEntity.push({ key: item.key, link: item.link, type: item.metadata.type })
          }
        });
      });
      if (matchedKeysEntity.length > 0) {
        dispatch(setAdditionalEntityDocument(matchedEntity))
        setAdditionalDocumentEntity(matchedKeysEntity);
        setEntityDocCount(matchedKeysEntity.length)
      } else {
        setAdditionalDocumentEntity([]);
      }
      let matchedKeys1 = [];
      let matchedIndividual = []
      documentTypes.forEach((type) => {
        documentList.forEach((item) => {
          if (type.value === item.key) {
            matchedKeys1.push(item.key);
            matchedIndividual.push({ key: item.key, link: item.link, type: item.metadata.type })
          }
        });
      });
      if (matchedKeys1.length > 0) {
        dispatch(setAdditionalIndividualDocument(matchedIndividual))
        setAdditionalDocumentIndividual(matchedKeys1);
        setIndividualCount(matchedKeys1.length)
      }
      else {
        setAdditionalDocumentIndividual([]);
      }
      setGetData(documentList);
      setEffectCount((prevCount) => prevCount + 1);
    }
  }, [documentList, effectCount, dispatch]);

  const handleChangeBoth = (index, value) => {
    const updatedArray = [...additionalDocumentBoth];
    updatedArray[index] = value;
    setAdditionalDocumentBoth(updatedArray);
  };

  useEffect(() => {
    if (additionalDocCount > 0) {
      for (let i = 1; i < additionalDocCount; i++) {
        const newKey = (data1.length + 1).toString();
        setData1((prevData) => [
          ...prevData,
          {
            key: newKey,
            documenttype: "Additional Documents",
          },
        ]);
        handleChangeBoth();
      }
    }
  }, [additionalDocCount]);

  useEffect(() => {
    if (entityDocCount > 0) {
      for (let i = 1; i < entityDocCount; i++) {
        const newKey = (entityData.length + 1).toString();
        setEntityData((prevData) => [
          ...prevData,
          {
            key: newKey,
            documenttype: "Additional Documents",
          },
        ]);
        handleChangeEntity();
      }
    }
  }, [entityDocCount]);

  useEffect(() => {
    if (individualCount > 0) {
      for (let i = 1; i < individualCount; i++) {
        const newKey = (individualData.length + 1).toString();
        setIndividualData((prevData) => [
          ...prevData,
          {
            key: newKey,
            documenttype: "Additional Documents",
          },
        ]);
        handleChangeIndividual();
      }
    }
  }, [individualCount]);

  const handleChangeEntity = (index, value) => {
    const updatedArray = [...additionalDocumentEntity];
    updatedArray[index] = value;
    setAdditionalDocumentEntity(updatedArray);
  };

  const handleChangeIndividual = (index, value) => {
    const updatedArray = [...additionalDocumentIndividual];
    updatedArray[index] = value;
    setAdditionalDocumentIndividual(updatedArray);
  };

  const [data1, setData1] = useState([
    {
      key: "1",
      documenttype: kycType?.kycVerification?.value === "voterId" ? "Voter ID" : "Aadhar Card",

    },
    {
      key: "2",
      documenttype: "PAN Card",
    },
    {
      key: "3",
      documenttype: "Additional Documents",
    },
  ]);

  const handleAddDocument = () => {
    const newKey = (data1.length + 1).toString();
    setData1([
      ...data1,
      {
        key: newKey,
        documenttype: "Additional Documents",
      },
    ]);
  };

  const verifyVideoKyc = async () => {
    const form = {
      proposalId: id
    }
    try {
      const response = await axiosRequest.post(`proposal/sendVideoKycLink`, form);
      if (response?.resCode === -1) {
        message.success(response?.data?.msg)
      }
      else {
        message.error(response?.data?.msg?.[0])
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const checkVideoStatus = async () => {
    try {
      const response = await axiosRequest.get(`service/karza/kyc/video/status?proposalId=${id}`);
      if (response?.resCode === -1) {
        message.success(response?.data?.statusMsg)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleAddDocumentEntity = () => {
    const newKey = (entityData.length + 1).toString();
    setEntityData([
      ...entityData,
      {
        key: newKey,
        documenttype: "Additional Documents",
      },
    ]);
  };

  const handleAddDocumentIndividual = () => {
    const newKey = (individualData.length + 1).toString();
    setIndividualData([
      ...individualData,
      {
        key: newKey,
        documenttype: "Additional Documents",
      },
    ]);
  };

  const additionalDocument = [
    { label: "Driving License", value: "drivingLicense" },
    { label: "Utility Bill", value: "utilityBill" },
    { label: "Passbook", value: "passbook" },
    { label: "Rental Agreement", value: "rentAgreement" },
  ];

  const documentTypes = [
    { label: "Financial Document", value: "financialDocument" },
    { label: "Salary Slip", value: "salarySlip" },
    { label: "Form 26AS", value: "form26AS" },
    { label: "P&L Statement", value: "plSatement" },
    { label: "Form16A/B,Income & Expenditure Statement", value: "form16AB" },
    { label: "ITR", value: "itr" },
  ];

  const options = [
    { label: "Certificate of Incorporation", value: "certificateOfIncorporation" },
    { label: "Udayan", value: "udayan" },
    { label: "Partnership Deed", value: "partnershipDeed" },
    { label: "Trust Deed", value: "trustDeed" },
    { label: "Certificate of Registration", value: "certificateOfRegistration" },
    { label: "Trade License", value: "tradeLicense" },
    { label: "GST Certificate", value: "gstCertificate" },
  ];

  const bankDoc = [
    { label: "Bank Passbook", value: "passbook" },
    { label: "Bank Statement", value: "bankStatement" }
  ]

  const columns1 = [
    {
      title: "Document Type",
      dataIndex: "documenttype",
      width: "30%",
      render: (text, record, index) => {
        if (record.documenttype === "Additional Documents") {
          const adjustedIndex = index - 2; // Adjust the index here
          return (
            <>
              <div>Additional Documents</div>
              <Select
                size="large"
                placeholder="Select"
                style={{ width: "100%" }}
                value={additionalDocumentBoth[adjustedIndex]}
                onChange={(value) => handleChangeBoth(adjustedIndex, value)}
              >
                {additionalDocument.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </>
          );
        } else {
          return <span>{text}</span>;
        }
      },
    },
    {
      title: "Main Applicant Document",
      dataIndex: "mainapplicantdocument",
      width: "50%",
      render: (text, record, index) => {
        if (record.documenttype === "Aadhar Card") {
          return (
            <div className="upload-document-width">
              <UploadComponent
                label="Aadhar Front"
                showLabel={false}
                name="aadharCard"
                value="aadharCard"
                id={id}
                type="applicant"
                section="applicant"
                side="front"
                uploadedFile={getData}

              />
              <UploadComponent
                label="Aadhar Back"
                showLabel={false}
                name="aadharCard"
                value="aadharCard"
                id={id}
                type="applicant"
                section="applicant"
                side="back"
                uploadedFile={getData}
              />
            </div>
          );
        }
        else if (record.documenttype === "Voter ID") {
          return (
            <div className="upload-document-width">
              <UploadComponent
                label="Voter ID Front"
                showLabel={false}
                name="voterId"
                value="voterId"
                id={id}
                type="applicant"
                section="applicant"
                side="front"
                uploadedFile={getData}

              />
              <UploadComponent
                label="Voter ID Back"
                showLabel={false}
                name="voterId"
                value="voterId"
                id={id}
                type="applicant"
                section="applicant"
                side="back"
                uploadedFile={getData}
              />
            </div>
          );
        }
        else if (record.documenttype === "PAN Card") {
          return (
            <div className="upload-document-width">
              <UploadComponent
                label="PAN"
                showLabel={false}
                name="pancardNo"
                value="pancardNo"
                id={id}
                type="applicant"
                section="applicant"
                side="front"
                uploadedFile={getData}
              />
            </div>
          );
        } else {
          const adjustedIndex = index - 2; // Adjust the index here
          return (
            <div
              className="upload-document-width"
              style={{
                alignItems: "center",
                marginTop: "35px",
              }}
            >
              <UploadComponent
                label="Document"
                showLabel={false}
                name={additionalDocumentBoth[adjustedIndex]}
                value={additionalDocumentBoth[adjustedIndex]}
                id={applicantId}
                type="applicant"
                section="applicant"
                side="front"
                uploadedFile={getData}
              />

            </div>
          );
        }
      },
    },
    {
      title: "",
      dataIndex: "action",
      // width: "20%",
      render: (text, record, index) => {
        if (record.documenttype === "Additional Documents" && index === 2) {
          return (
            <Button onClick={handleAddDocument}>+ Upload Additional Document</Button>
          );
        }
        return null;
      },
    },
  ];

  const columns2 = [
    {
      title: "Document Type",
      dataIndex: "documenttype",
      width: "20%",
      render: (text, record, index) => {
        if (record.documenttype === "Bank Statement") {
          return (
            <div>
              <span>{bankKey === "cancelCheque" ? "Cancelled Cheque" : bankKey}</span>
              <div className="lastsixmonthtext">For the last 6 months</div>
            </div>
          );
        } else if (record.documenttype === "Additional Documents") {
          const adjustedIndex = index - 5;
          return (
            <div className="d-flex flex-column gap-3">
              <span>{text}</span>
              <Select
                size="large"
                placeholder="Select"
                style={{ width: "100%" }}
                value={additionalDocumentEntity[adjustedIndex]}
                onChange={(value) => handleChangeEntity(adjustedIndex, value)}
              >
                {optionsArray.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          );
        } else {
          return <span>{text}</span>;
        }
      },
    },
    {
      title: "Main Applicant Document",
      dataIndex: "mainapplicantdocument",
      width: "30%",
      render: (text, record, index) => {
        if (record.documenttype === "Video KYC") {
          return (
            <div
            // className={`d-flex ${window.innerWidth < 768 && "flex-column"}`}
            >
              <div
                style={{ display: "flex", alignItems: "center" }}
              >
                {buttonLink === true ? <>
                  <div
                    className="verificationwrapper"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <img src={iconLeft} style={{ width: "20px", height: "20px" }} />
                    <div onClick={verifyVideoKyc} className="shareverification">Share Link with Customer</div>
                  </div>
                </>
                  :
                  <>
                    <div style={{ color: "#32CD32", fontSize: 18, fontWeight: "bold" }}>{statusMsg}</div>
                    {status === "VKYC_PROCESSING" || status === "LINK_SENT" ?
                      <>
                        <ReloadOutlined style={{ marginLeft: "30px", color: "#32CD32", fontSize: "20px" }} onClick={checkVideoStatus} />
                      </>
                      : ""}
                  </>}
                {statusCount?.data?.length > 0 ? <div style={{ marginLeft: 20 }}>No Of Attempt : {statusCount?.data?.length}
                  <Popover
                    content={
                      <div>
                        {statusCount?.data?.map((item, index) => {
                          console.log(index, "akshaysriram");
                          return (
                            <div key={index}>
                              {index} : {item?.statusWiseMsg}
                            </div>
                          );
                        })}
                      </div>
                    }
                    title="Status Video Kyc">
                    <img src={info} style={{ width: "16px", height: "16px", marginLeft: 10, cursor: "pointer" }} />
                  </Popover></div> : ""}
              </div>
            </div>
          );
        } else if (
          record.documenttype === "Business Document" && !bussinessRegistedKey) {
          return null;
        }
        else if (record.documenttype === "Additional Documents") {
          const adjustedIndex = index - 5;
          return (
            <div className="upload-document-width">
              <UploadComponent
                label="Document"
                showLabel={false}
                name={additionalDocumentEntity[adjustedIndex]}
                value={additionalDocumentEntity[adjustedIndex]}
                id={id}
                type="proposal"
                section="entity"
                side="front"
                uploadedFile={getData}
              />
            </div>
          );
        }
        else if (record.documenttype === "Bank Statement") {
          return (
            <div className="upload-document-width">
              <UploadComponent
                label="Document"
                showLabel={false}
                name={bankKey}
                value={bankKey}
                id={id}
                type="proposal"
                section="entity"
                side="front"
                uploadedFile={getData}
              />
            </div>
          );
        }
        else if (record.documenttype === "Business Statement") {
          return (
            <div className="upload-document-width">
              <UploadComponent
                label="Document"
                showLabel={false}
                name={bussinessDocKey}
                value={bussinessDocKey}
                id={id}
                type="proposal"
                section="entity"
                side="front"
                uploadedFile={getData}
              />
            </div>
          );
        }
        else {
          return (
            <div className="upload-document-width">
              <UploadComponent
                label="Document"
                showLabel={false}
                name={record?.key}
                value={record?.key}
                id={id}
                type="proposal"
                section="entity"
                side="front"
                uploadedFile={getData}
              />
            </div>
          );
        }
      },
    },
    {
      title: "",
      dataIndex: "action",
      width: "10%",
      render: (text, record, index) => {
        if (record.documenttype === "Additional Documents" && index === 5) {
          return (
            <Button onClick={handleAddDocumentEntity}>+ Upload Additional Document</Button>
          );
        } else if (record.documenttype === "Video KYC") {
          return (
            <>
              <div className="infowrapper pl-3">
                <img src={info} style={{ width: "16px", height: "16px" }} />
                <div className="intotitleverification">
                  Please complete the Verification Process by visiting the link sent on your Registered Email within 24 hours.
                </div>
              </div>
            </>
          );
        }
        return null;
      },
    },
  ];

  const column3 = [
    {
      title: "Document Type",
      dataIndex: "documenttype",
      width: "20%", // Set width for the first column
      render: (text, record, index) => {
        if (record.documenttype === "Bank Statement") {
          return (
            <div>
              <span>{bankKey === "cancelCheque" ? "Cancelled Cheque" : bankKey}</span>
              <div className="lastsixmonthtext">For the last 6 months</div>
            </div>
          );
        } else if (record.documenttype === "Additional Documents") {
          const adjustedIndex = index - 3
          return (
            <div className="d-flex flex-column gap-3">
              <span>{text}</span>
              {/* <div className="lastsixmonthtext">For the last 6 months</div> */}
              <Select
                size="large"
                placeholder="Select"
                style={{ width: "80%" }}
                value={additionalDocumentIndividual[adjustedIndex]}
                options={documentTypes}
                onChange={(value) => handleChangeIndividual(adjustedIndex, value)}
              ></Select>
            </div>
          );
        } else {
          return <span>{text}</span>;
        }
      },
    },
    {
      title: "Main Applicant Document",
      dataIndex: "mainapplicantdocument",
      width: "30%",
      render: (text, record, index) => {
        if (record.documenttype === "Video KYC") {
          return (
            <div
              style={{ display: "flex", alignItems: "center" }}
            >
              {buttonLink === true ? <>
                <div
                  className="verificationwrapper"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img src={iconLeft} style={{ width: "20px", height: "20px" }} />
                  <div onClick={verifyVideoKyc} className="shareverification">Share Link with Customer</div>
                </div>
              </>
                :
                <>
                  <div style={{ color: "#32CD32", fontSize: 18, fontWeight: "bold" }}>{status}</div>
                  {status === "VKYC_PROCESSING" || status === "LINK_SENT" ?
                    <>
                      <ReloadOutlined style={{ marginLeft: "30px", color: "#32CD32", fontSize: "20px" }} onClick={checkVideoStatus} />
                    </>
                    : ""}
                </>}
              {statusCount?.data?.length > 0 ? <div style={{ marginLeft: 20 }}>No Of Attempt : {statusCount?.data?.length}
                <Popover
                  content={
                    <div>
                      {statusCount?.data?.map((item, index) => {
                        console.log(index, "akshaysriram");
                        return (
                          <div key={index}>
                            {index} : {item?.status}
                          </div>
                        );
                      })}
                    </div>
                  }
                  title="Status Video Kyc">
                  <img src={info} style={{ width: "16px", height: "16px", marginLeft: 10, cursor: "pointer" }} />
                </Popover></div> : ""}
            </div>
          );
        } else if (record.documenttype === "Additional Documents") {
          const adjustedIndex = index - 3
          return (
            <div className="upload-document-width">
              <UploadComponent
                label="Document"
                showLabel={false}
                // name={record?.key}
                // value={record?.key}
                name={additionalDocumentIndividual[adjustedIndex]}
                value={additionalDocumentIndividual[adjustedIndex]}
                id={id}
                type="proposal"
                section="entity"
                side="front"
                uploadedFile={getData}
              />
            </div>
          );
        }
        else if (record.documenttype === "Bank Statement") {
          return (
            <div className="upload-document-width">
              <UploadComponent
                label="Document"
                showLabel={false}
                name={bankKey}
                value={bankKey}
                id={id}
                type="proposal"
                section="entity"
                side="front"
                uploadedFile={getData}
              />
            </div>
          );
        }
        else {
          return (
            <div className="upload-document-width">
              <UploadComponent
                label="Document"
                showLabel={false}
                name={record?.key}
                value={record?.key}
                id={id}
                type="proposal"
                section="entity"
                side="front"
                uploadedFile={getData}
              />
            </div>
          );
        }
      },
    },
    {
      title: "",
      dataIndex: "action",
      width: "10%",
      render: (text, record, index) => {
        console.log(record, "akshay")
        if (record.documenttype === "Additional Documents" && index === 3) {
          return (
            <Button onClick={handleAddDocumentIndividual}>+ Upload Additional Document</Button>
          );
        }
        else if (record.documenttype === "Video KYC") {
          return (
            <>
              <div className="infowrapper pl-3">
                <img src={info} style={{ width: "16px", height: "16px" }} />
                <div className="intotitleverification">
                  Please complete the Verification Process by visiting the link sent on your Registered Email within 24 hours.
                </div>
              </div>
            </>
          )
        }
        return null;
      },
    },
  ];

  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // useEffect(() => {
  //   const handleResize = () => {
  //     setWindowWidth(window.innerWidth);
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  return (
    <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
      <Col className="col-wrapper" xs={24} sm={24} md={24} lg={24} xl={24}>
        <div className="loandetailstitle">7 - Applicant Documents</div>
        <div className="applicant-documents">
          <div className="currentprogress">Current Progress</div>
          <div className="progress-container progressSuccess">
            <Progress percent={100} format={() => "100%"} strokeColor="#003399" />
          </div>
        </div>
      </Col>

      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="uploadtable">
        <div className="loantitle">Applicant Documents</div>

        <Table
          className="table-document-head"
          columns={columns1}
          dataSource={data1}
          size="small"
          bordered
          pagination={false}
          mobileBreakPoint={425}
        />
      </Col>

      {storeApplciationType === "entity" ? (
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="uploadtable">
          <div className="loantitle">Entity Documents</div>

          <Table
            className="table-document-head"
            columns={columns2}
            dataSource={entityData}
            size="small"
            bordered
            pagination={false}
            mobileBreakPoint={425}
          />
        </Col>
      ) : (
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="uploadtable">
          <div className="loantitle">Individual Documents</div>
          <Table
            className="table-document-head"
            columns={column3}
            dataSource={individualData}
            size="small"
            bordered
            pagination={false}
            mobileBreakPoint={425}
          />
        </Col>
      )}
    </Row>




  );
};

export default DocumentUpload;


