import React, { useState, useEffect, useRef } from "react";
import {
  Col,
  Form,
  Upload,
  Button,
  Progress,
  message,
  Modal,
  Image,
} from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import Config from "../../config/api.config";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../state/slices/loader";
import Sdloader from "../../components/Loader/FullPageLoader";
import {
  setAadharDocumentAddress,
  setBankDetails,
  setPanDetails,
  setVoterIdDocumentAddress,
  setAdhaarFrontDocument,
  setVoterBackDocument
} from "../../state/slices/applicantDetailsSlice";
import { setEntityPanDetails } from "../../state/slices/entityDocuments";
import { FileDownloadDoneOutlined } from "@mui/icons-material";

const { baseURL } = Config;
const DOC_KEY = {
  aadharCard: "aadharCard",
  pancardNo: "pancardNo",
  voterId: "voterId",
  drivingLicense: "drivingLicense",
  utilityBill: "utilityBill",
  passbook: "passbook",
  rentAgreement: "rentAgreement",
  consumerCreditReport: "consumerCreditReport",
  certificationOfIncoporation: "certificationOfIncoporation",
  udayan: "udayan",
  partnershipDeed: "partnershipDeed",
  trustDeed: "trustDeed",
  certificationOfRegistration: "certificationOfRegistration",
  tradeLicense: "tradeLicense",
  bankStatement: "bankStatement",
};
const DOC_KEY_INDIVIDUAL = {
  finacialDocument: "financialDocument",
  salarySlip: "salarySlip",
  form26AS: "form26AS",
  plSatement: "plSatement",
  form16ABIncomeExendiatureStatement: "form16ABIncomeExendiatureStatement",
};
const UploadComponent = (props) => {
  const {
    required,
    name,
    label,
    validationMessage,
    uploadedFile,
    showLabel = true,
    disabled,
    id,
    docType,
    type,
    section,
    side,
    applicantName,
    value,
    document,
    filename,
    imageLink,
    kycType,
    data,
    _id
  } = props;

  console.log("my props are", value, name, kycType, data);

  const token = useSelector((state) => state?.user?.userData?.data?.data?.jwt);
  const documentKey = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?.document
  );
  const documentAllKey = useSelector(
    (state) => state?.fetchAllProposal?.proposal?.data
  );
  console.log("dockey", documentKey);

  console.log("toooooken", token);
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [viewButtonDisabled, setViewButtonDisabled] = useState(false);
  const [fileType, setFileType] = useState(false)
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [isFileUploaded, setIsFileUploaded] = useState(false); // New state to track file upload status
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (uploadedFile && Array.isArray(uploadedFile)) {
      if (documentKey?.length > 0) {
        let match = documentKey?.filter(
          (obj) => obj.key === value && obj.side === side
        );
        if (match[0]?.key === name) {
          setIsFileUploaded(true);
        } else {
          setIsFileUploaded(false);
        }
        setFileType(match[0]?.metadata?.type)
        setImageUrl(match[0]?.link);
        setFile(match[0]?.name);
      }
    }
    if (uploadedFile && Array.isArray(uploadedFile)) {
      if (documentAllKey?.length > 0) {
        let match = documentAllKey?.filter(
          (obj) => obj.key === value && obj.side === side
        );
        console.log("match and name", match, name);
        if (match[0]?.key === name) {
          setIsFileUploaded(true);
        } else {
          setIsFileUploaded(false);
        }
        setFileType(match[0]?.metadata?.type)
        setImageUrl(match[0]?.link);
        setFile(match[0]?.name);
      }
    }
  }, [uploadedFile, document, value, DOC_KEY]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChange = async (e) => {
    const selectedFile = e.target.files[0];
    console.log("selectedfile before", selectedFile?.name);
    setFile(selectedFile?.name); // Render file name with optional chaining
    if (selectedFile && selectedFile instanceof Blob) {
      if (selectedFile.type.includes("image/") ||
        selectedFile.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = (event) => {
          console.log("slectedimage", event.target.result);
          setImageUrl(event.target.result);
        };
        reader.readAsDataURL(selectedFile); // Read file as data URL
        console.log("selectedfile after", selectedFile?.name);
        const formData = new FormData();
        if (docType === "E-aadhaar") {
          formData.append("proposalId", _id);
          formData.append("docType", docType);
          formData.append("file", selectedFile);
          formData.append("ValidateName", applicantName)
        } else if (docType === "Voter ID Front") {
          formData.append("proposalId", _id);
          formData.append("docType", docType);
          formData.append("file", selectedFile);
          formData.append("ValidateName", applicantName)
        } else if (docType === "PAN") {
          formData.append("proposalId", _id);
          formData.append("docType", docType);
          formData.append("file", selectedFile);
          formData.append("ValidateName", applicantName)
        }
        else if (docType === "businessEntityPan") {
          formData.append("proposalId", _id);
          formData.append("docType", "PAN");
          formData.append("file", selectedFile);
        }
        else if (docType === "cancelCheque") {
          formData.append("proposalId", _id);
          formData.append("file", selectedFile);
        }
        let formData1 = new FormData();
        if (
          name === "aadharCard" ||
          name === "voterId" ||
          name === "pancardNo" || name === "businessEntityPan"
        ) {
          formData1.append("file", selectedFile);
          formData1.append("key", name);
          formData1.append("uid", id);
          formData1.append("parent", type);
          formData1.append("section", section);
          formData1.append("side", side);
        } else {
          formData1.append("file", selectedFile);
          formData1.append("key", name);
          formData1.append("uid", id);
          formData1.append("parent", type);
          formData1.append("section", section);
          formData1.append("side", side);
        }
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        };

        setLoading(true);
        dispatch(setLoader(true));
        try {
          if (docType === "E-aadhaar" && side === "front") {
            let url = `${baseURL}service/karza/ocr/userDoc`;
            const response = await axios.post(url, formData, { headers });
            if (response?.status === 201) {
              console.log(response, "akshay")
              message.success(response?.data?.data?.resp?.statuMsg)
              dispatch(setAdhaarFrontDocument(response));
            }
          }
          else if (docType === "E-aadhaar" && side === "back") {
            let url = `${baseURL}service/karza/ocr/userDoc`;
            const response = await axios.post(url, formData, { headers });
            if (response?.status === 201) {
              console.log(response, "akshay")
              message.success(response?.data?.data?.resp?.statuMsg)
              dispatch(setAadharDocumentAddress(response));
            }
          }
          else if (docType === "Voter ID Front" && side === "front") {
            let url = `${baseURL}service/karza/ocr/userDoc`;
            const response = await axios.post(url, formData, { headers });
            if (response?.status === 201) {
              message.success(response?.data?.data?.resp?.statuMsg)
              dispatch(setVoterIdDocumentAddress(response));
            }
          }
          else if (docType === "Voter ID Front" && side === "back") {
            let url = `${baseURL}service/karza/ocr/userDoc`;
            const response = await axios.post(url, formData, { headers });
            if (response?.status === 201) {
              message.success(response?.data?.data?.resp?.statuMsg)
              dispatch(setVoterBackDocument(response));
            }
          }
          else if (docType === "PAN") {
            let url = `${baseURL}service/karza/ocr/userDoc`;
            const response = await axios.post(url, formData, { headers });
            if (response?.status === 201) {
              message.success(response?.data?.data?.resp?.statuMsg)
              dispatch(setPanDetails(response));
            }
          }
          else if (docType === "businessEntityPan") {
            let url = `${baseURL}service/karza/ocr/userDoc`;
            const response = await axios.post(url, formData, { headers });
            if (response?.status === 201) {
              message.success(response?.data?.data?.resp?.statuMsg)
              dispatch(setEntityPanDetails(response));
            }
          }
          else if (docType === "cancelCheque") {
            let url = `${baseURL}service/karza/ocr/cheque`;
            const response = await axios.post(url, formData, { headers });
            if (response?.status === 201) {
              message.success(response?.data?.data?.resp?.statusMsg)
              dispatch(setBankDetails(response));
            }
          }
          let url = `${baseURL}proposal/upload_doc`;
          const response = await axios.post(url, formData1, { headers });
          console.log("response=", response);
          setUploadProgress(100); // Assuming 100% progress for simplicity
          if (response.data.resCode === 500) {
            //message.error("Insufficient Credits");
          } else {
            message.success(response?.data?.data?.msg);
          }
          setLoading(false);
          dispatch(setLoader(false));
          // Set a timeout to reset uploadProgress after a delay
          // setTimeout(() => {
          //   setUploadProgress(0);
          // }, 3000); // Change delay as needed
        } catch (error) {
          console.error("Error uploading file:", error);
          setLoading(false);
          dispatch(setLoader(false));
          setUploadProgress(0);
          //message.error("Failed to upload file");
        }
      } else {
        setLoading(false);
        dispatch(setLoader(false));
        //message.error("Unsupported file type. Please upload an image or PDF.");
      }
    } else {
      setLoading(false);
      dispatch(setLoader(false));
      //message.error("Invalid file selected.");
    }
  };

  const handleRemove = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setFile(null);
    setUploadProgress(0);
    setIsFileUploaded(false);
  };

  const handlePreview = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPreviewUrl(imageUrl);
    setPreviewVisible(true);
    setViewButtonDisabled(true);
  };

  const handleCancelPreview = () => {
    setPreviewVisible(false);
    setPreviewUrl(null);
    setViewButtonDisabled(false);
  };

  return (
    <>
      {loading && <Sdloader sdloader={loading} />}
      <Form.Item
        name={name}
        label={showLabel && label}
        rules={[
          {
            required: false,
            message: validationMessage || `Please Upload ${label}`,
          },
        ]}
      >
        {!isFileUploaded ? (
          <input
            type="file"
            onChange={handleChange}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            ref={fileInputRef}
          />
        ) : null}
        <Button
          style={{ alignItems: "start", justifyContent: "flex-start" }}
          icon={file ? null : <UploadOutlined />}
          className={windowWidth < 768 ? "uploaddata-mobile" : "uploadbtn"}
          disabled={disabled}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          {file ? (
            <div className="d-flex w-100">
              <div>
                {imageUrl?.includes("application/pdf") || fileType === "application/pdf" ? (
                  <FileDownloadDoneOutlined />
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="uploaded-image"
                  />
                ) : (
                  <div>{file}</div>
                )}
              </div>
              <div className="d-flex flex-grow-1 justify-content-between align-items-center pl-3">
                <div className="uploadtextwrapper">
                  <div className="filename">
                    {file?.length > 8 ? `${file?.substring(0, 20)}...` : file}
                  </div>
                  <div className="clicktoview" onClick={handlePreview}>
                    Click to view
                  </div>
                </div>
                <div>
                  {uploadedFile && (
                    <CloseOutlined
                      onClick={handleRemove}
                      className="remove-icon"
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {`Upload ${label}`}
              <p className="filetypetitle">
                Only .pdf, .jpg allowed. File limit is 5MB
              </p>
            </div>
          )}
        </Button>
      </Form.Item>
      <Modal
        visible={previewVisible}
        onCancel={handleCancelPreview}
        footer={null}
      >
        {previewUrl && fileType === "application/pdf" ? (
          <embed
            src={previewUrl}
            type="application/pdf"
            width="100%"
            height="600px"
          />
        ) : previewUrl && previewUrl?.includes("application/pdf") ? <embed
          src={previewUrl}
          type="application/pdf"
          width="100%"
          height="600px"
        /> : (
          <img
            alt="Preview"
            style={{ width: "100%", height: "300px", padding: "20px" }}
            src={previewUrl}
          />
        )}
      </Modal>
    </>
  );
};

export default UploadComponent;
