import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Progress,
  InputNumber,
  message,
  Row,
  Select,
} from "antd";
import React, { useState, useEffect } from "react";
import "./LoanApplication.css";
import axiosRequest from "../../axios-request/API.request.js";
import UploadComponent from "./UploadComponent";
import MapsContainer from "../../utils/MapsContainer";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { setLoader } from "../../state/slices/loader.js";
import axios from "axios";
import config from "../../config/api.config";

const { baseURL } = config;
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
const EntityDetails = ({
  form,
  setEntityDetails,
  entityDetails,
  id,
  document,
}) => {
  const dispatch = useDispatch();

  const entityDocuments = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?.document
  );

  const token = useSelector((state) => state?.user?.userData?.data?.data?.jwt);

  const storedata = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?.entityDetails
  );

  const businessVerifyStage = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data
  );
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyLabel, setVerifyLabel] = useState(false)
  const [verifyTextPAN, setVerifiedTextPAN] = useState("VERIFY");
  const [panlinks, setPanLinks] = useState(true);
  const [businessDocType, setBusinessDocType] = useState([])
  const [companyPremiseDocType, setCompanyPremisesDocType] = useState([])

  const [dataFromgoogleAPI, setDataFromGoogleAPI] = useState({
    lat: "",
    long: "",
    pincode: "",
    city: "",
    district: "",
    country: "",
    address: "",
  });
  console.log(dataFromgoogleAPI, "dataFromgoogleAPI=====>");
  const [dataCollctedFromgooglemaps, setDataCollctedFromGoogleMaps] =
    useState(false);

  const [cords, setCords] = useState({ lat: 0, long: 0 });
  const [mapsaddress, setmapsAddress] = useState("");
  const [documentsEntityData, setDocumentsEntityData] = useState([]);
  const [effectCount, setEffectCount] = useState(0);
  const [identityDropdown, setIdentityDropdown] = useState([])
  const [entityCompanyTypes, setEntityCompanyTypes] = useState([])
  const [identityLabel, setIdentityLabel] = useState("Unique Identity Number")
  const bussinesPanAddress = useSelector(
    (state) =>
      state?.entityDoc?.entityPanAddressDetails?.data?.data?.resp?.result?.[0]
        ?.details
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=typeOfCompanyEntity');
        const PurposeTypes = response?.data?.data?.typeOfCompanyEntity.map(item => ({
          label: item.label,
          value: item.value
        }));
        setEntityCompanyTypes(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await axiosRequest.get(`master/dropdown/find_all?type=uniqueBusinessIdentity`);
        const PurposeTypes = response?.data?.data?.uniqueBusinessIdentity.map(item => ({
          label: item.label,
          value: item.value
        }));
        setIdentityDropdown(PurposeTypes || []);
      } catch (error) {
      }
      try {
        const response = await axiosRequest.get(`master/dropdown/find_all?type=businessDocNameEntity`);
        const PurposeTypes = response?.data?.data?.businessDocNameEntity.map(item => ({
          label: item.label,
          value: item.value
        }));
        setBusinessDocType(PurposeTypes || []);
      } catch (error) {
      }
      try {
        const response = await axiosRequest.get(`master/dropdown/find_all?type=companyPremiseEntity`);
        const PurposeTypes = response?.data?.data?.companyPremiseEntity.map(item => ({
          label: item.label,
          value: item.value
        }));
        setCompanyPremisesDocType(PurposeTypes || []);
      } catch (error) {
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      pannumber: storedata?.pannumber || bussinesPanAddress?.panNo?.value,
      entityname: storedata?.businessDetails?.entityName || bussinesPanAddress?.name?.value,
      dateofincorporation: storedata?.businessDetails?.dateOfIncoporation
        ? dayjs(storedata?.businessDetails?.dateOfIncoporation)
        : "" || dayjs(bussinesPanAddress?.date?.value)
    });
    setEntityDetails({
      ...entityDetails,
      pannumber: storedata?.pannumber || bussinesPanAddress?.panNo?.value,
      entityname: storedata?.businessDetails?.entityName || bussinesPanAddress?.name?.value,
      dateofincorporation: storedata?.businessDetails?.dateOfIncoporation
        ? dayjs(storedata?.businessDetails?.dateOfIncoporation)
        : "" || dayjs(bussinesPanAddress?.date?.value)
    });
  }, [bussinesPanAddress]);
  useEffect(() => {
    if (entityDocuments?.length > 1 && effectCount < 3) {
      setDocumentsEntityData(entityDocuments);
      setEffectCount((prevCount) => prevCount + 1);
    }
  }, [entityDocuments, effectCount]);
  useEffect(() => {
    if (dataCollctedFromgooglemaps) {
      form.setFieldsValue({
        // permanentaddressline1:dataFromgoogleAPI?.address,
        // permanentaddressline2:dataFromgoogleAPI?.address,
        addressline2: entityDetails?.addressline2,
        landmark: entityDetails?.landmark,
        city: entityDetails?.city,
        state: entityDetails?.state,
        country: entityDetails?.country,
        pincode: entityDetails?.pincode,
        latitude: entityDetails?.latitude,
        longitude: entityDetails?.longitude,
      });
    }
  }, [dataCollctedFromgooglemaps, entityDetails]);

  useEffect(() => {
    setIsChecked(storedata?.isBusinessRegistered);
    form.setFieldsValue({
      uniqueBusinessIdentityType: storedata?.businessDetails?.uniqueBusinessIdentityType,
      uniqueBusinessIdentityNumber: storedata?.businessDetails?.uniqueBusinessIdentityNumber,
      entityname: storedata?.businessDetails?.entityName || bussinesPanAddress?.name?.value,
      typeOfCompany: storedata?.businessDetails?.typeOfCompany,
      monthlySales: storedata?.businessDetails?.monthlysales,
      pannumber: storedata?.businessDetails?.pancardId,
      pancard: "",
      bussinessdocument: storedata?.businessDetails?.businessDocName,
      dateofincorporation: storedata?.businessDetails?.dateOfIncoporation ? dayjs(storedata?.businessDetails?.dateOfIncoporation) : "",
      companypremise: storedata?.businessDetails?.companyPremise,
      shareinbusinessorpartnership: storedata?.businessDetails?.shareInBusinessOrPartnership,
      addressline1: storedata?.address?.addressLine1,
      addressline2: storedata?.address?.addressLine2,
      landmark: storedata?.address?.area,
      city: storedata?.address?.city,
      state: storedata?.address?.state,
      country: storedata?.address?.country,
      pincode: storedata?.address?.pincode,
      latitude: storedata?.address?.latitude,
      longitude: storedata?.address?.longitude,
      monthlynetsalesincome: storedata?.financialDetails?.montlyNetSaleIncome,
      cashbalancecompany: storedata?.financialDetails?.cashBalanceOfTheCompany,
      networth: storedata?.financialDetails?.netWorth,
      noofemployees: storedata?.financialDetails?.noOfEmployees,
      salesprojectionfornexttwoyears:
        storedata?.financialDetails?.salesProjectionForNextTwoYears,
    });
    setEntityDetails({
      ...entityDetails,
      uniqueBusinessIdentityType: storedata?.businessDetails?.uniqueBusinessIdentityType,
      uniqueBusinessIdentityNumber: storedata?.businessDetails?.uniqueBusinessIdentityNumber,
      entityname: storedata?.businessDetails?.entityName,
      typeOfCompany: storedata?.businessDetails?.typeOfCompany,
      monthlySales: storedata?.businessDetails?.monthlySales,
      pannumber: storedata?.businessDetails?.pancardId,
      pancard: "",
      bussinessdocument: storedata?.businessDetails?.businessDocName,
      dateofincorporation: storedata?.businessDetails?.dateOfIncoporation
        ? dayjs(storedata?.businessDetails?.dateOfIncoporation)
        : "",
      companypremise: storedata?.businessDetails?.companyPremise,
      shareinbusinessorpartnership:
        storedata?.businessDetails?.shareInBusinessOrPartnership,
      addressline1: storedata?.address?.addressLine1,
      addressline2: storedata?.address?.addressLine2,
      landmark: storedata?.address?.area,
      city: storedata?.address?.city,
      state: storedata?.address?.state,
      country: storedata?.address?.country,
      pincode: storedata?.address?.pincode,
      latitude: storedata?.address?.latitude,
      longitude: storedata?.address?.longitude,
      monthlynetsalesincome: storedata?.financialDetails?.montlyNetSaleIncome,
      cashbalancecompany: storedata?.financialDetails?.cashBalanceOfTheCompany,
      networth: storedata?.financialDetails?.netWorth,
      noofemployees: storedata?.financialDetails?.noOfEmployees,
      salesprojectionfornexttwoyears:
        storedata?.financialDetails?.salesProjectionForNextTwoYears,
      isBusinessRegistered: storedata?.isBusinessRegistered,
    });
    setCompanyPremise(storedata?.businessDetails?.companyPremise || "")
    if (businessVerifyStage?.businessPanVerificationId === null || businessVerifyStage?.businessPanVerificationId === undefined) {
      setVerifiedTextPAN("VERIFY");
      setPanLinks(true);
    }
    else {
      setVerifiedTextPAN("VERIFIED");
      setPanLinks(false);
    }
  }, []);


  const handleShareVerificationPan = () => {
    setLoading(true);
    dispatch(setLoader(true));

    axios
      .post(
        baseURL + `service/karza/auth/pan`,
        {
          proposalId: id,
          pan: entityDetails?.pannumber || bussinesPanAddress?.panNo?.value,
          type: "BUSINESS_PAN"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token here
            accept: "application/json, text/plain, */*",
            "content-type": "application/json",
            // Add other headers if needed
          },
        }
      )
      .then((res) => {
        console.log(res, "res");
        setLoading(false);
        dispatch(setLoader(false));
        if (res === undefined || res === null || res === "") {
          return;
        }
        if (res.status === 200 || res.status === 201) {
          try {
            if (res?.data?.data?.statusCode === "101") {
              let _loginData = [];
              console.log("resp", res.data.data.resp.result.message);
              message.success(res.data.data.statusMsg);
              //setRequestId(res?.data?.data?.resp?.requestId);
              // setOpenOtpModal(true)
              setVerifiedTextPAN("VERIFIED");
              setPanLinks(false);
            } else if (res?.data?.data?.statusCode === "102") {
              // Handle error code 10609
              //message.error(res.data.data.statusMsg);
            } else {
              // dispatch(setUser(res.data));
              // navigate('/Dashboard')
            }
          } catch (err) {
            console.log(err);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        dispatch(setLoader(false));
      });
  };

  const handleInsuredAddress = (data, datafromgoogleAPI) => {
    console.log(data, "data in MAps");
    console.log(datafromgoogleAPI, "bxjsgdw");
    const { address_components, formatted_address, geometry } =
      datafromgoogleAPI;
    console.log(address_components, "address_components");
    console.log(datafromgoogleAPI, "googleAPIResponse");
    const newData = {};
    datafromgoogleAPI?.address_components?.map((component) => {
      const { long_name, types } = component;
      console.log(long_name, "long_name");
      console.log(types, "types");
      console.log(types[0], "DEtails from THE GooGLE");
      switch (types[0]) {
        case "landmark":
          newData.landmark = long_name;
          break;
        case "route":
          newData.addressline2 = long_name;
          break;
        case "locality":
          newData.city = long_name;
          break;
        case "administrative_area_level_3":
          newData.district = long_name;
          break;
        case "administrative_area_level_1":
          newData.state = long_name;
          break;
        case "country":
          newData.country = long_name;
          break;
        case "postal_code":
          newData.pincode = long_name;
          break;
        default:
          break;
      }
      return null;
    });

    console.log(newData, "newData");

    setDataCollctedFromGoogleMaps(true);
    setEntityDetails((prevState) => {
      return {
        ...prevState,
        ...newData,
        latitude: geometry?.location?.lat,
        longitude: geometry?.location?.lng,
        address: formatted_address,
      };
    });

    var latitudemaps = "";
    var longitudemaps = "";
    navigator.geolocation.getCurrentPosition((position) => {
      latitudemaps = position.coords.latitude;
      longitudemaps = position.coords.longitude;
      setCords({
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });
    });
    const mapspayload = {
      latitude: data?.lat || latitudemaps,
      longitude: data?.long || longitudemaps,
    };
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleChange = (field, value, label) => {
    setEntityDetails({ ...entityDetails, [field]: value });
    if (field === "typeOfCompany" || field === "bussinessdocument") {
      setEntityDetails({ ...entityDetails, [field]: label });
    }
    if (field == "uniqueBusinessIdentityType" && label?.label !== undefined) {
      setIdentityLabel(label?.label)
    }
  };

  const verifyUniqueId = () => {
    if (entityDetails?.uniqueBusinessIdentityType === "goodsAndServicesTaxIdentificationNumber") {
      var url = "service/karza/auth/gst"
      var formData = {
        proposalId: id,
        gstin: entityDetails?.uniqueBusinessIdentityNumber,
        addressSplit: true
      }
    }
    else if (entityDetails?.uniqueBusinessIdentityType === "udyamAadharNumber") {
      var url = "service/karza/check/udyam"
      var formData = {
        proposalId: id,
        udyamRegistrationNo: entityDetails?.uniqueBusinessIdentityNumber,
        isPDFRequired: "Y",
        getEnterpriseDetails: true
      }
    }
    else if (entityDetails?.uniqueBusinessIdentityType === "udyogAadharNumber") {
      var url = "service/karza/fetch/udyog"
      var formData = {
        proposalId: id,
        uan: entityDetails?.uniqueBusinessIdentityNumber,
      }
    }
    axiosRequest.post(url, formData)
      .then((response) => {
        if (response?.data) {
          message.success("Verified Successfully");
          setVerifyLabel(true)
        }
        else {
          //message.error(response?.data?.resp?.statusMessage);
          // form.setFieldsValue({
          //   uniqueBusinessIdentityType: "",
          //   uniqueBusinessIdentityNumber: "",
          // });
          // setEntityDetails({
          //   ...entityDetails,
          //   uniqueBusinessIdentityType: "",
          //   uniqueBusinessIdentityNumber: "",
          // });
        }
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        throw error;
      });
  }

  const showModalMap = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [companyPremise, setCompanyPremise] = useState(
    entityDetails?.companypremise
  );

  const handleCompanyPremiseChange = (value, label) => {
    setCompanyPremise(label);
    setEntityDetails({ ...entityDetails, companypremise: label });
  };

  const selectedDocKey = DOC_KEY[entityDetails?.bussinessdocument];
  console.log('entityDetails?.bussinessdocument', entityDetails?.bussinessdocument)
  return (
    <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="col-wrapper">
        <div className="loandetailstitle">3 - Entity Details</div>
        <div className="applicant-documents">
          <div className="currentprogress">Current Progress</div>
          <div className="progress-container">
            <Progress percent={60} strokeColor="#003399" />
          </div>
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="loandetail">
        <Form autoComplete="off" layout="vertical" form={form}>
          <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Checkbox
                name="isbusinessisregistered"
                checked={isChecked}
                onChange={handleCheckboxChange}
              >
                Is Your Business Registered?
              </Checkbox>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="loantitle">
              Business Details
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <UploadComponent
                document={document}
                label="Business PAN Card"
                name="businessEntityPan"
                value="businessEntityPan"
                docType="businessEntityPan"
                id={id}
                type="proposal"
                section="entity"
                side="front"
                uploadedFile={documentsEntityData}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="pannumber"
                label="Business PAN Number"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Correct Pan Number",
                  },
                  {
                    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
                    message: "Please Enter Correct PAN Number",
                  },
                ]}
              >
                <Input
                  type="text"
                  size="large"
                  placeholder="Enter PAN Number"
                  value={entityDetails?.pannumber}
                  onChange={(e) => handleChange("pannumber", e.target.value)}
                  onInput={(e) =>
                    (e.target.value = e.target.value.toUpperCase())
                  }
                  // className="panno"
                  maxLength={10}
                  disabled={verifyTextPAN === "VERIFIED" ? true : false}
                  suffix={
                    <div className={verifyTextPAN === "VERIFY" ? "input-text-verify" : "input-text-verify1"} onClick={handleShareVerificationPan}>{verifyTextPAN}</div>
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="entityname"
                label="Entity Name"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Entity Name",
                  },
                  {
                    pattern: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
                    message:
                      "Entity name should not contain special characters",
                  },
                ]}
              >
                <Input
                  type="text"
                  size="large"
                  value={entityDetails?.entityname}
                  onChange={(e) => handleChange("entityname", e.target.value)}
                  placeholder="Enter Entity Name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="typeOfCompany"
                label="Type Of Company"
                rules={[
                  {
                    required: true,
                    message: "Please Select The Type Of Company.",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Select
                  placeholder="Select Type Of Company"
                  size="large"
                  value={entityDetails?.typeOfCompany}
                  onChange={(value, label) => handleChange("typeOfCompany", value, label)}
                  options={entityCompanyTypes}
                >
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="monthlySales"
                label="Monthly Sales"
                rules={[
                  {
                    required: false,
                    message: "Please enter monthly sales",
                  },
                ]}
              >
                <Input
                  defaultValue={storedata?.businessDetails?.monthlySales || ""}
                  // type="number"
                  size="large"
                  value={storedata?.businessDetails?.monthlySales || ""}
                  placeholder="Enter Monthly Sales"
                  onChange={(e) => handleChange("monthlySales", e.target.value)}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="uniqueBusinessIdentityType"
                label="Unique Business Identity"
                rules={[
                  {
                    required: true,
                    message: "Please enter unique business identity",
                  },
                ]}
              >
                <Select
                  placeholder="Select Unique Business Identity"
                  size="large"
                  // defaultValue={storedata?.businessDetails?.uniqueBusinessIdentity || ""}
                  value={storedata?.businessDetails?.uniqueBusinessIdentity || ""}
                  onChange={(value, label) => handleChange("uniqueBusinessIdentityType", value, label)}
                  options={identityDropdown}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="uniqueBusinessIdentityNumber"
                label={identityLabel !== "" ? identityLabel : "Unique Identity Number"}
                rules={[
                  {
                    required: true,
                    message: "Please enter Unique Business Number",
                  },
                ]}
              >
                <Input disabled={verifyLabel === true ? true : false} placeholder={identityLabel !== "" ? `Enter ${identityLabel}` : "Unique Identity Number"} value={storedata?.businessDetails?.uniqueBusinessNumber || ""} onChange={(e) => handleChange("uniqueBusinessIdentityNumber", e.target.value)} suffix={entityDetails?.uniqueBusinessIdentityType == "goodsAndServicesTaxIdentificationNumber" || entityDetails?.uniqueBusinessIdentityType == "udyogAadharNumber" || entityDetails?.uniqueBusinessIdentityType == "udyamAadharNumber" ? <Button disabled={verifyLabel} onClick={verifyUniqueId} className="verify-button-entity">{verifyLabel === true ? "VERIFIED" : "VERIFY"}</Button> : ""} size="large" />
              </Form.Item>
            </Col>


            <Col xs={24} sm={24} md={8} lg={8} xl={8}></Col>
            {isChecked && (
              <>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name="bussinessdocument"
                    label="Business Document"
                    rules={[
                      {
                        required: true,
                        message: " Please Select the Business Document",
                      },
                    ]}
                  >
                    <Select
                      options={businessDocType}
                      placeholder="Select Business Document"
                      size="large"
                      value={entityDetails?.bussinessdocument}
                      onChange={(value, label) => handleChange("bussinessdocument", value, label)}
                    >
                    </Select>
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={8}
                  xl={8}
                  style={{ marginTop: "20px" }}
                >
                  <div>{entityDetails?.bussinessdocument?.value}</div>
                  <UploadComponent
                    document={document}
                    label="Document"
                    showLabel={false}
                    name={entityDetails?.bussinessdocument?.value}
                    value={entityDetails?.bussinessdocument?.value}
                    id={id}
                    type="proposal"
                    section="entity"
                    side="front"
                    uploadedFile={documentsEntityData}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}></Col>
              </>
            )}
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="dateofincorporation"
                label="Date Of Incorporation"
                rules={[
                  {
                    required: true,
                    message: "Please Select the Date of Incorporation",
                  },
                ]}
              >
                <DatePicker
                  size="large"
                  format="DD/MM/YYYY"
                  value={entityDetails?.dateofincorporation || ""}
                  onChange={(date) => handleChange("dateofincorporation", date)}
                  placeholder="DD/MM/YYYY"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="companypremise"
                label="Company Premise"
                rules={[
                  {
                    required: true,
                    message: "Please Select the Company Premise",
                  },
                ]}
              >
                <Select
                  placeholder="Select Company Premise"
                  size="large"
                  value={companyPremise}
                  options={companyPremiseDocType}
                  onChange={(value, label) => handleCompanyPremiseChange(value, label)}
                >
                </Select>
              </Form.Item>
            </Col>
            {companyPremise?.value === "owned" && (
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <UploadComponent
                  label="Owned Document"
                  showLabel={true}
                  name="rentAgreement"
                  value="rentAgreement"
                  id={id}
                  type="proposal"
                  section="entity"
                  side="front"
                  uploadedFile={documentsEntityData}
                />
              </Col>
            )}
            {companyPremise?.value === "rented" && (
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <UploadComponent
                  label="Rented Document"
                  name="rentAgreement"
                  value="rentAgreement"
                  type="proposal"
                  id={id}
                  section="entity"
                  side="front"
                  showLabel={true}
                  uploadedFile={documentsEntityData}
                />
              </Col>
            )}
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="shareinbusinessorpartnership"
                label="% Shares in Business or Partnership?"
                rules={[
                  {
                    required: false,
                    message: "Please enter share percentage",
                  },
                ]}
              >
                <Input
                  value={entityDetails?.sharwinbusinessorpartnership}
                  onChange={(e) =>
                    handleChange("shareinbusinessorpartnership", e.target.value)
                  }
                  placeholder="Enter Share percentage"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="d-flex justify-content-between">
                <div className="loantitle">Address Details</div>
                <div className="locatemap" onClick={showModalMap}>
                  Locate on Map
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="addressline1"
                label="Address Line 1"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Address Line 1",
                  },
                ]}
              >
                <Input
                  type="string"
                  placeholder="Enter Address Line 1"
                  size="large"
                  value={entityDetails?.addressline1}
                  onChange={(e) => handleChange("addressline1", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="addressline2"
                label="Address Line 2"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Address Line 2",
                  },
                ]}
              >
                <Input
                  type="string"
                  placeholder="Enter Address Line 2"
                  size="large"
                  value={entityDetails?.addressline2}
                  onChange={(e) => handleChange("addressline2", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="landmark"
                label="Landmark"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Area",
                  },
                ]}
              >
                <Input
                  type="string"
                  placeholder="Enter Area"
                  size="large"
                  value={entityDetails?.landmark}
                  onChange={(e) => handleChange("landmark", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="city"
                label="City/Town/Village"
                rules={[
                  {
                    required: true,
                    message: "Please Enter City",
                  },
                ]}
              >
                <Input
                  type="string"
                  placeholder="Enter City"
                  size="large"
                  value={entityDetails?.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="state"
                label="State"
                rules={[
                  {
                    required: true,
                    message: "Please Enter State",
                  },
                ]}
              >
                <Input
                  type="string"
                  placeholder="Enter State"
                  size="large"
                  value={entityDetails?.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="country"
                label="Country"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Country",
                  },
                ]}
              >
                <Input
                  type="string"
                  placeholder="Enter Country"
                  size="large"
                  value={entityDetails?.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="pincode"
                label="PIN Code"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Pincode",
                  },
                ]}
              >
                <Input
                  // type="number"
                  value={entityDetails?.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  placeholder="Enter PIN Code"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="latitude"
                label="Latitude"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Latitude",
                  },
                ]}
              >
                <Input
                  // type="number"
                  value={entityDetails?.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                  placeholder="Enter Latitude"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="longitude"
                label="Longitude"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Longitude",
                  },
                ]}
              >
                <Input
                  // type="number"
                  value={entityDetails?.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                  placeholder="Enter Longitude"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="loantitle">
              Financial Details
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="monthlynetsalesincome"
                label="Monthly Net Sales Income"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Monthly Net Sales Income",
                  },
                ]}
              >
                <InputNumber
                  controls={false}
                  placeholder="Enter Monthly Net Sales Income"
                  min={0}
                  size="large"
                  style={{ width: "100%" }}
                  value={entityDetails.monthlynetsalesincome}
                  onChange={(value) => handleChange("monthlynetsalesincome", value)}
                  formatter={(value) =>
                    `${value}`.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="cashbalancecompany"
                label="Cash Balance Of The Company"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Cash Balance Of the Company",
                  },
                ]}
              >
                <InputNumber
                  controls={false}
                  placeholder="Enter Cash Balance Of the Company"
                  min={0}
                  size="large"
                  style={{ width: "100%" }}
                  value={entityDetails?.cashbalancecompany}
                  onChange={(value) => handleChange("cashbalancecompany", value)}
                  formatter={(value) =>
                    `${value}`.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="networth"
                label="Net Worth"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Net Worth",
                  },
                ]}
              >
                <InputNumber
                  controls={false}
                  placeholder="Enter Net Worth"
                  min={0}
                  size="large"
                  style={{ width: "100%" }}
                  value={entityDetails?.networth}
                  onChange={(value) => handleChange("networth", value)}
                  formatter={(value) =>
                    `${value}`.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="noofemployees"
                label="No Of Employees"
                rules={[
                  {
                    required: true,
                    message: "Please Enter No Of Employee",
                  },
                ]}
              >
                <InputNumber
                  controls={false}
                  placeholder="Enter No of Employees"
                  min={0}
                  size="large"
                  style={{ width: "100%" }}
                  value={entityDetails?.noofemployees}
                  onChange={(value) => handleChange("noofemployees", value)}
                  formatter={(value) =>
                    `${value}`.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                // type="number"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="salesprojectionfornexttwoyears"
                label="Sales Projections For Next Two Years"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Sales Projection",
                  },
                ]}
              >
                <InputNumber
                  controls={false}
                  min={0}
                  placeholder="Enter Sales projections"
                  size="large"
                  style={{ width: "100%" }}
                  value={entityDetails?.salesprojectionfornexttwoyears}
                  onChange={(value) => handleChange("salesprojectionfornexttwoyears", value)}
                  formatter={(value) =>
                    `${value}`.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <MapsContainer
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          cords={cords}
          setLocation={setCords}
          handleInsuredAddress={handleInsuredAddress}
          mapsaddress={mapsaddress}
        />
        {/* <Modal
          title="Locate On Map"
          // className="locateonmapmodal"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={(_, { OkBtn, CancelBtn }) => (
            <>
              <Button
                style={{
                  backgroundColor: "#fff",
                  color: "#003399",
                  border: "1px solid #003399",
                  borderRadius: "8px",
                  width: "96px",
                  height: "42px",
                  padding: "10px 22px 10px 22px",
                }}
              >
                Cancel
              </Button>
              <Button
                style={{
                  backgroundColor: "#003399",
                  color: "#fff",
                  border: "1px solid #003399",
                  boxShadow: "0px 2px 12px 0px #00339952",
                  width: "178px",
                  height: "42px",
                  padding: "10px 22px 10px 22px",
                  borderRadius: "8px",
                }}
              >
                Confirm Location
              </Button>
            </>
          )}
        >
          <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
            <div className="container">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Input placeholder="Search" suffix={<SearchOutlined />} />
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div className="m-2">
                  <img src={maps} width="100%" />
                </div>
              </Col>
            </div>
          </Row>
        </Modal> */}
      </Col>
    </Row>
  );
};

export default EntityDetails;
