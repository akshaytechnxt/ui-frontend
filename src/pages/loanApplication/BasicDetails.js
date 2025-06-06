import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  message,
} from "antd";
import "./LoanApplication.css";
import info from "../../assets/image/info.png";
import { useEffect, useState } from "react";
import axiosRequest from "../../axios-request/API.request";
import { InputOTP } from "antd-input-otp";
import UploadComponent from "./UploadComponent";
import { useDispatch, useSelector } from "react-redux";
import MapsContainer from "../../utils/MapsContainer";
import { setSearchLocation } from "../../state/slices/mapSlice";
import dayjs from "dayjs";
import MapsCurrentAddress from "../../utils/MapsCurrentAddress";
import CoApplicantMap from "../../utils/coApplicant"
import { setLoader } from "../../state/slices/loader";
import axios from "axios";
import config from "../../config/api.config";
import { DeleteOutlined } from "@ant-design/icons";
import { updateBasicDetails, updateBasicDetailsDocuments } from '../../state/slices/formDataSlice';
const { baseURL } = config;
const { Option } = Select;
const BasicDetails = ({ form, formData, setFormData, id, document }) => {
  const [modalFormOtP] = Form.useForm();
  const token = useSelector((state) => state?.user?.userData?.data?.data?.jwt);
  const documents = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?.document
  );
  const _id = useSelector((state) => state?.fetchProposal?.proposal?.data?.data?._id)
  const storedata = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?.applicantId
  );
  const storeVerify = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data
  );
  const aadharAddress = useSelector(
    (state) =>
      state?.applicantDoc?.aadharDocumentAddress?.data?.data?.resp?.result?.[0]
        ?.details
  );

  const aadharFrontAddress = useSelector(
    (state) =>
      state?.applicantDoc?.adhaarFrontDocument?.data?.data?.resp?.result?.[0]
        ?.details
  );
  const voterBackAddress = useSelector(
    (state) =>
      state?.applicantDoc?.voterBackDocument?.data?.data?.resp?.result?.[0]
        ?.details
  )
  const voterAddress = useSelector(
    (state) =>
      state?.applicantDoc?.voterIDDocumentAddress?.data?.data?.resp?.result?.[0]
        ?.details
  )
  const panAddress = useSelector(
    (state) =>
      state?.applicantDoc?.panAddressDetails?.data?.data?.resp?.result?.[0]
        ?.details
  );
  const [documentsData, setDocumentsData] = useState([]);
  const [effectCount, setEffectCount] = useState(0);
  const [otpValue, setOtpValue] = useState("");
  const [genderTypes, setGenderTypes] = useState([])
  const [relationshipTypes] = useState([
    {
      label: "Spouse",
      value: "Spouse"
    },
    {
      label: "Parent",
      value: "Parent"
    },
    {
      label: "Sibling",
      value: "Sibling"
    },
    {
      label: "Business Partner",
      value: "Business Partner"
    },
    {
      label: "Friend",
      value: "Friend"
    },
    {
      label: "Other",
      value: "Other"
    }
  ])
  const [kycType, setKycTypes] = useState([])
  const [resendTimer, setResendTimer] = useState(0);
  const [panName, setPanName] = useState("")
  const [adhaarFrontName, setAdhaarFrontName] = useState("")
  const [coApplicant, setCoApplicant] = useState(false)
  const [adhaarDob, setAdhaarDob] = useState("")
  const [panDob, setPanDob] = useState("")
  const [resendDisabled, setResendDisabled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);
  useEffect(() => {
    if (documents?.length > 1 && effectCount < 3) {
      setDocumentsData(documents);
      setEffectCount((prevCount) => prevCount + 1);
    }
  }, [documents, effectCount]);
  useEffect(() => {
    if (documents?.length > 0) {
      documents?.forEach((element) => {
        setDocumentsData(element);
      });
    }
  }, [documents]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=gender');
        const PurposeTypes = response?.data?.data?.gender.map(item => ({
          label: item.label,
          value: item.value
        }));
        setGenderTypes(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=kycVerification');
        const PurposeTypes = response?.data?.data?.kycVerification.map(item => ({
          label: item.label,
          value: item.value
        }));
        setKycTypes(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      kycId: storedata?.kycId || aadharAddress?.aadhaar?.value,
      addressLine1:
        storedata?.permanentAddress?.addressLine1 ||
        aadharAddress?.addressSplit?.line1,
      addressLine2:
        storedata?.permanentAddress?.addressLine2 ||
        aadharAddress?.addressSplit?.line2,
      city:
        storedata?.permanentAddress?.city || aadharAddress?.addressSplit?.city,
      state:
        storedata?.permanentAddress?.state ||
        aadharAddress?.addressSplit?.state,
      pincode:
        storedata?.permanentAddress?.pincode ||
        aadharAddress?.addressSplit?.pin,
      area:
        storedata?.permanentAddress?.area ||
        aadharAddress?.addressSplit?.landmark,
    });
  }, [aadharAddress]);

  useEffect(() => {
    form.setFieldsValue({
      kycId: storedata?.kycId || aadharFrontAddress?.aadhaar?.value,
    });
    setFormData({
      ...formData,
      kycId: storedata?.kycId || aadharFrontAddress?.aadhaar?.value,
      gender: storedata?.gender || aadharFrontAddress?.gender?.value
    });
    if (aadharFrontAddress?.gender?.value === "MALE") {
      form.setFieldsValue({
        gender: {
          "label": "Male",
          "value": "male",
        }
      })
      setFormData({
        ...formData,
        gender: {
          "label": "Male",
          "value": "male",
        }
      });
    }
    else if (aadharFrontAddress?.gender?.value === "FEMALE") {
      form.setFieldsValue({
        gender: {
          "label": "Female",
          "value": "female",
        }
      })
      setFormData({
        ...formData,
        gender: {
          "label": "Female",
          "value": "female",
        }
      });
    }
    setAdhaarFrontName(aadharFrontAddress?.name?.value)
    setAdhaarDob(aadharFrontAddress?.dob?.value)
  }, [aadharFrontAddress])

  useEffect(() => {
    form.setFieldsValue({
      kycId: storedata?.kycId || voterAddress?.voterid?.value,
    });
    setFormData({
      ...formData,
      kycId: storedata?.kycId || voterAddress?.voterid?.value
    });
    if (aadharFrontAddress?.gender?.value === "MALE") {
      form.setFieldsValue({
        gender: {
          "label": "Male",
          "value": "male",
        }
      })
      setFormData({
        ...formData,
        gender: {
          "label": "Male",
          "value": "male",
        }
      });
    }
    else if (voterAddress?.gender?.value === "FEMALE") {
      form.setFieldsValue({
        gender: {
          "label": "Female",
          "value": "female",
        }
      })
      setFormData({
        ...formData,
        gender: {
          "label": "Female",
          "value": "female",
        }
      });
    }
    setAdhaarFrontName(voterAddress?.name?.value)
    setAdhaarDob(voterAddress?.dob?.value)
  }, [voterAddress]);

  useEffect(() => {
    form.setFieldsValue({
      pancardId: storedata?.pancardId || panAddress?.panNo?.value,
    });
    setFormData({
      ...formData,
      pancardId: storedata?.pancardId || panAddress?.panNo?.value,
    });
    setPanName(panAddress?.name?.value)
    setPanDob(panAddress?.date?.value)
  }, [panAddress]);

  console.log(storeVerify?.coBorrowers?.[0]?.coBorrowerId, "akshaysriram")

  useEffect(() => {
    if (storeVerify?.coBorrowers?.[0]?.coBorrowerId) {
      setCoApplicant(true)
    }
    form.setFieldsValue({
      applicantfullname: storedata?.fullName,
      primaryEmail: storedata?.primaryEmail,
      primaryMobile: storedata?.primaryMobile,
      dob: dayjs(storedata?.dob),
      gender: storedata?.gender,
      kycVerification: storedata?.kycVerification,
      aadharfront: storedata?.aadharDetails?.imageLink?.front,
      aadharBack: storedata?.aadharDetails?.imageLink?.back,
      others: storedata?.others,
      pancardId: storedata?.pancardId || panAddress?.panNo?.value,
      country: storedata?.permanentAddress?.country,
      latitude: storedata?.permanentAddress?.latitude,
      longitude: storedata?.permanentAddress?.longitude,
      currentaddressLine1: storedata?.currentAddress?.addressLine1,
      currentaddressLine2: storedata?.currentAddress?.addressLine2,
      currentcity: storedata?.currentAddress?.city,
      currentstate: storedata?.currentAddress?.state,
      currentcountry: storedata?.currentAddress?.country,
      currentpincode: storedata?.currentAddress?.pincode,
      currentlatitude: storedata?.currentAddress?.latitude,
      currentlongitude: storedata?.currentAddress?.longitude,
      currentarea: storedata?.currentAddress?.area,
      isCurrentAddressSameAsPermenantAddress: storedata?.isCurrentAddressSameAsPermenantAddress,
      kycId: storedata?.kycId || aadharAddress?.aadhaar?.value,
      addressLine1: storedata?.permanentAddress?.addressLine1 || aadharAddress?.addressSplit?.line1,
      addressLine2: storedata?.permanentAddress?.addressLine2 || aadharAddress?.addressSplit?.line2,
      city: storedata?.permanentAddress?.city || aadharAddress?.addressSplit?.city,
      state: storedata?.permanentAddress?.state || aadharAddress?.addressSplit?.state,
      pincode: storedata?.permanentAddress?.pincode || aadharAddress?.addressSplit?.pin,
      area: storedata?.permanentAddress?.area || aadharAddress?.addressSplit?.landmark,
      fullName1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.fullName,
      primaryEmail1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.primaryEmail,
      primaryMobile1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.primaryMobile,
      dob1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.dob ? dayjs(storeVerify?.coBorrowers?.[0]?.coBorrowerId?.dob) : "",
      gender1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.gender,
      relationShip1: storeVerify?.coBorrowers?.[0]?.relationShip,
      kycVerification1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.kycVerification,
      kycId1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.kycId,
      pancardId1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.pancardId,
      addressLine11: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.addressLine1,
      addressLine12: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.addressLine2,
      area1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.area,
      state1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.state,
      city1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.city,
      country1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.country,
      pincode1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.pincode,
      latitude1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.latitude,
      longitude1: storeVerify?.coBorrowers?.[0]?.coBorrowerId?.permanentAddress?.longitude
    });
    if (storedata?.kycVerification?.value === "aadharCard") {
      setShareLinks("Verify Aadhar Card")
    }
    else {
      setShareLinks("Verify Voter ID")
    }
    if ((storeVerify?.aadharVerificationId !== null && storeVerify?.voterVerificationId === null) || (storeVerify?.voterVerificationId !== null && storeVerify?.aadharVerificationId === null)) {
      setKycLinks(false);
      setVerifiedTextKYC("VERIFIED");
    }
    else {
      setKycLinks(true);
      setVerifiedTextKYC("");
    }
    if (storeVerify?.panVerificationId !== null) {
      setVerifiedTextPAN("VERIFIED");
      setPanLinks(false);
    }
    else {
      setVerifiedTextPAN("");
      setPanLinks(true);
    }
    setAdhaarFrontName(storedata?.fullName)
    setPanName(storedata?.fullName)
    setAdhaarDob(storedata?.dob)
  }, []);


  const handleCheckboxChange = (e) => {
    console.log("checked = ", e.target.checked);
    setFormData({
      ...formData,
      isCurrentAddressSameAsPermenantAddress: e.target.checked,
    });
    if (!e.target.checked) {
      form.setFieldsValue({
        currentaddressLine1: "",
        currentaddressLine2: "",
        currentcity: "",
        currentstate: "",
        currentcountry: "",
        currentpincode: "",
        currentlatitude: "",
        currentlongitude: "",
        currentarea: "",
      });
    }
  };

  const handleChange = (field, value, label) => {
    console.log(field, "filed in onchange");
    if (field === "bankdocuments") {
      setFormData({ ...formData, [field]: label });
      dispatch(updateBasicDetailsDocuments({ [field]: label }));
    } else {
      setFormData({ ...formData, [field]: value });
      dispatch(updateBasicDetails({ [field]: value }));
    }
    if (field === "kycVerification") {
      if (value === "aadharCard") {
        setShareLinks("Verify Aadhar Card");
      } else if (value === "voterId") {
        setShareLinks("Verify Voter ID");
      }
    }
  };

  const addCoApplicant = () => {
    if (coApplicant) {
      setCoApplicant(false);
    } else {
      setCoApplicant(true);
    }
  }

  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD');
      handleChange('dob', formattedDate);
    } else {
      handleChange('dob', null);
    }
  };

  const handleDateChange1 = (date) => {
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD');
      handleChange('dob1', formattedDate);
    } else {
      handleChange('dob1', null);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCurrentAddressOpen, setIsModalCurrentAddressOpen] =
    useState(false);
  const [iscoApplicantMaps, setIscoapplicantMaps] = useState(false)
  const [isModalEmailVerifyOpen, setIsModalEmailVerifyOpen] = useState(false);
  const [isModalMobileVerifyOpen, setIsModalMobileVerifyOpen] = useState(false);
  const [othersField, setOthersField] = useState(false);
  const [dataFromgoogleAPI, setDataFromGoogleAPI] = useState({
    lat: "",
    long: "",
    pincode: "",
    city: "",
    district: "",
    country: "",
    address: "",
  });
  const [dataFromCurrentAddressgoogleAPI, setDataFromCurrentAddressGoogleAPI] =
    useState({
      currentlat: "",
      currentlong: "",
      currentpincode: "",
      currentcity: "",
      currentdistrict: "",
      currentcountry: "",
      currentaddress: "",
    });
  console.log(
    dataFromgoogleAPI,
    dataFromCurrentAddressgoogleAPI,
    "dataFromgoogleAPI=====>"
  );
  const [dataCollctedFromgooglemaps, setDataCollctedFromGoogleMaps] =
    useState(false);
  const [
    dataCollctedFromCurrentAddressgooglemaps,
    setDataCollctedFromCurrentAddressGoogleMaps,
  ] = useState(false);
  const [
    dataCollctedFromCurrentAddressgooglemaps1,
    setDataCollctedFromCurrentAddressGoogleMaps1,
  ] = useState(false);
  const [cords, setCords] = useState({ lat: 0, long: 0 });
  const [currentAddressCords, setCurrentAddressCords] = useState({
    currentlat: 0,
    currentlong: 0,
  });

  const [currentAddressCords1, setCurrentAddressCords1] = useState({
    currentlat: 0,
    currentlong: 0,
  });
  const [mapsaddress, setmapsAddress] = useState("");
  const [mapsCurrentaddress, setmapsCurrenAddress] = useState("");
  const [mapsCurrentaddress1, setmapsCurrenAddress1] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    dispatch(setSearchLocation(searchTerm));
  };
  const showModalMap = () => {
    setIsModalOpen(true);
  };

  const showModalMap1 = () => {
    setIscoapplicantMaps(true)
  }
  const showModalCurrentAddressMap = () => {
    setIsModalCurrentAddressOpen(true);
  };
  const showModalEmailVerify = () => {
    setIsModalEmailVerifyOpen(true);
  };
  const showModalMobileVerify = () => {
    setIsModalMobileVerifyOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCurrentAddressOk = () => {
    setIsModalCurrentAddressOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCurrentAddressCancel = () => {
    setIsModalCurrentAddressOpen(false);
  };

  const handleCurrentAddressOk1 = () => {
    setIscoapplicantMaps(false);
  };

  const handleCurrentAddressCancel1 = () => {
    setIscoapplicantMaps(false);
  };

  const handleOkEmailVerify = () => {
    setIsModalEmailVerifyOpen(false);
    // Place your logic here for email verification
  };

  const handleOkMobileVerify = () => {
    setIsModalMobileVerifyOpen(false);
    // Place your logic here for mobile number verification
  };

  const handleOkOtpVerify = () => {
    setOpenOtpModal(false);
    // Place your logic here for mobile number verification
  };

  const handleEmailCancel = () => {
    // setIsModalOpen(false);
    setIsModalEmailVerifyOpen(false);
    // setIsModalMobileVerifyOpen(false);
  };

  const handleMobileCancel = () => {
    // setIsModalOpen(false);
    // setIsModalEmailVerifyOpen(false);
    setIsModalMobileVerifyOpen(false);
  };
  const [loading, setLoading] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [verifyTextKYC, setVerifiedTextKYC] = useState("");
  const [verifyTextPAN, setVerifiedTextPAN] = useState("");
  const [disbaled, setDisabled] = useState(false);
  console.log("setDisabled", disbaled);
  const [kyclinks, setKycLinks] = useState(true);
  const [panlinks, setPanLinks] = useState(true);
  const [shareLinks, setShareLinks] = useState("Verify Voter ID");

  const startResendTimer = () => {
    setResendTimer(60); // 30 seconds
    setResendDisabled(true);
  };

  const handleShareVerificationKyc = () => {
    setLoading(true);
    dispatch(setLoader(true));
    console.log("formData", formData?.kycId);

    //   if (!formData?.kycId) {
    //     // Handle the case where kycId is undefined
    //     setLoading(false);
    //     dispatch(setLoader(false));
    //     message.error("AADHAAR number is undefined");
    //     return;
    // }

    let apiEndpoint = "";
    let requestData = {};

    if (formData?.kycVerification?.value === "voterId") {
      // If Voter ID is selected
      apiEndpoint = "service/karza/kyc/voterId";
      requestData = {
        epicNo: formData?.kycId,
        proposalId: _id
      };
    } else if (formData?.kycVerification?.value === "aadharCard") {
      // If Aadhar Card is selected
      apiEndpoint = "service/karza/kyc/aadhar/v2/generate_otp";
      requestData = {
        aadhaarNo: formData?.kycId,
        proposalId: _id
      };
    }

    axios
      .post(baseURL + apiEndpoint, requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token here
            accept: "application/json, text/plain, */*",
            "content-type": "application/json",
            // Add other headers if needed
          },
        })
      .then((res) => {
        console.log(res, "res");
        setLoading(false);
        dispatch(setLoader(false));
        if (res === undefined || res === null || res === "") {
          return;
        }
        if (res.status === 200 || res.status === 201) {
          try {
            if (res?.data?.resCode === -1) {
              let _loginData = [];
              console.log("resp kyc", res.data.data.resp.result);
              setRequestId(res?.data?.data?.resp?.requestId);
              if (shareLinks === "Verify Aadhar Card") {
                setOpenOtpModal(true);
                // setVerifiedText("VERIFIED")
                // startResendTimer(); // Start the timer after OTP is sent successfully
              } else {
                setOpenOtpModal(false);
                setKycLinks(false);
                setVerifiedTextKYC("VERIFIED");
                message.success(res.data.data.statusMsg);
              }
            } else if (res.data.errCode === 10609) {
              // Handle error code 10609
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
        if (error?.response?.status === 400) {
          if (error?.response?.data?.resCode === 8)
            message.error("Please Enter Correct OTP");
        }
      });
  };

  const handleReShareVerificationKyc = () => {
    setLoading(true);
    dispatch(setLoader(true));
    console.log("formData", formData?.kycId);

    //   if (!formData?.kycId) {
    //     // Handle the case where kycId is undefined
    //     setLoading(false);
    //     dispatch(setLoader(false));
    //     message.error("AADHAAR number is undefined");
    //     return;
    // }

    let apiEndpoint = "";
    let requestData = {};

    if (formData?.kycVerification?.value === "voterId") {
      // If Voter ID is selected
      apiEndpoint = "service/karza/kyc/voterId";
      requestData = {
        epicNo: formData?.kycId,
        proposalId: _id
      };
    } else if (formData?.kycVerification?.value === "aadharCard") {
      // If Aadhar Card is selected
      apiEndpoint = "service/karza/kyc/aadhar/v2/generate_otp";
      requestData = {
        aadhaarNo: formData?.kycId,
        proposalId: _id
      };
    }

    axios
      .post(baseURL + apiEndpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token here
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
          // Add other headers if needed
        },
      })
      .then((res) => {
        console.log(res, "res");
        setLoading(false);
        dispatch(setLoader(false));
        if (res === undefined || res === null || res === "") {
          return;
        }
        if (res.status === 200 || res.status === 201) {
          try {
            if (res?.data?.resCode === -1) {
              let _loginData = [];

              console.log("resp", res.data.data.resp);
              message.success(res.data.data.resp.statusMsg);
              setRequestId(res?.data?.data?.resp?.requestId);
              if (shareLinks === "Verify Aadhar Card") {
                setOpenOtpModal(true);
                // setVerifiedText("VERIFIED")
                startResendTimer(); // Start the timer after OTP is sent successfully
              } else {
                setOpenOtpModal(false);
                setKycLinks(false);
                setVerifiedTextKYC("VERIFIED");
              }
            } else if (res.data.errCode === 10609) {
              // Handle error code 10609
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
        if (error?.response?.status === 400) {
          if (error?.response?.data?.resCode === 8)
            message.error("Please Enter Correct OTP");
        }
      });
  };

  const handleShareVerificationPan = () => {
    setLoading(true);
    dispatch(setLoader(true));

    axios
      .post(
        baseURL + `service/karza/auth/pan`,
        {
          proposalId: _id,
          pan: formData?.pancardId,
          type: "INDIVIDUAL_PAN"
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
            console.log('pan res', res?.data?.data)
            if (res?.data?.data?.statusCode === "101") {
              let _loginData = [];

              console.log("resp", res.data.data.resp.result.message);
              message.success(res.data.data.statusMsg);
              setRequestId(res?.data?.data?.resp?.requestId);
              // setOpenOtpModal(true)
              setVerifiedTextPAN("VERIFIED");
              setPanLinks(false);
            } else if (res?.data?.data?.statusCode === "102") {
              // Handle error code 10609
              message.error(res.data.data.statusMsg);
            }
          } catch (err) {
            console.log(err);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        dispatch(setLoader(false));
        if (error?.response?.status === 400) {
          if (error?.response?.data?.resCode === 8)
            message.error("Please Enter Correct OTP");
        }
      });
  };

  console.log(formData?.kycVerification, "filed in onchange")

  const handleVerifyOtp = () => {
    setLoading(true);
    dispatch(setLoader(true));
    var axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    console.log("otp value", formData?.otp);
    axios
      .post(
        baseURL + `service/karza/kyc/aadhar/v2/submit_otp`,
        {
          proposalId: _id,
          requestId: requestId,
          otp: otpValue,
          aadhaarNo: formData?.kycId,
        },
        axiosConfig
      )
      .then((res, error) => {
        setLoading(false);
        dispatch(setLoader(false));
        if (res === undefined || res === null || res === "") {
          return;
        }
        if (res.status === 200 || res.status === 201) {
          //setLoading(false)
          // if (!res.ok) {
          //     message.error('Please check your internet connections');
          // } else {
          try {
            if (res.data.resCode === -1) {
              let _loginData = [];
              console.log(res.data.data, 'verify otp')
              setOpenOtpModal(false);
              if (res.data.data.statusCode === 102) {
                message.error(res.data.data.statusMsg);
                setVerifiedTextKYC("");
                setOpenOtpModal(true)
                setOtpValue("")
                modalFormOtP.resetFields();
              } else {
                message.success(res.data.data.statusMsg);
                setVerifiedTextKYC("VERIFIED");
                setKycLinks(false);
                setDisabled(true);
                setOpenOtpModal(false);

              }

            } else if (res.data.resCode === 500) {
              console.log("resp", res.data);
              message.error(res.data.data.statusMsg);
              //setVerify(true);
              setOtpValue('');
            } else {
              //setVerify(true);
            }
          } catch (err) {
            console.log(err);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        dispatch(setLoader(false));
        if (error?.response?.status === 404) {
          if (error?.response?.data?.resCode === 4)
            message.error("Please Enter Correct User Credentials");
        }
      });
  };

  useEffect(() => {
    if (dataCollctedFromgooglemaps) {
      form.setFieldsValue({
        // permanentaddressline1:dataFromgoogleAPI?.address,
        // permanentaddressline2:dataFromgoogleAPI?.address,
        addressLine2: formData?.addressLine2,
        area: formData?.area,
        city: formData?.city,
        state: formData?.state,
        country: formData?.country,
        pincode: formData?.pincode,
        latitude: formData?.latitude,
        longitude: formData?.longitude,
      });
    }
  }, [dataCollctedFromgooglemaps, formData]);

  useEffect(() => {
    if (dataCollctedFromCurrentAddressgooglemaps) {
      // Set current address fields using form.setFieldsValue
      form.setFieldsValue({
        currentaddressLine2: formData?.currentaddressLine2,
        currentarea: formData?.currentarea,
        currentcity: formData?.currentcity,
        currentstate: formData?.currentstate,
        currentcountry: formData?.currentcountry,
        currentpincode: formData?.currentpincode,
        currentlatitude: formData?.currentlatitude,
        currentlongitude: formData?.currentlongitude,
        // Add other current address fields as needed
      });
    }
  }, [dataCollctedFromCurrentAddressgooglemaps, formData]);

  useEffect(() => {
    if (dataCollctedFromCurrentAddressgooglemaps1) {
      // Set current address fields using form.setFieldsValue
      form.setFieldsValue({
        addressLine12: formData?.addressLine12,
        area1: formData?.area1,
        city1: formData?.city1,
        state1: formData?.state1,
        country1: formData?.country1,
        pincode1: formData?.pincode1,
        latitude1: formData?.latitude1,
        longitude1: formData?.longitude1,
        // Add other current address fields as needed
      });
    }
  }, [dataCollctedFromCurrentAddressgooglemaps1, formData]);

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
          newData.area = long_name;
          break;
        case "route":
          newData.addressLine2 = long_name;
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

    setDataCollctedFromGoogleMaps(true);
    setFormData((prevState) => {
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

  const handleCurrentAddress = (data, dataFromCurrentAddressgoogleAPI) => {
    console.log(data, "data in MAps");
    console.log(dataFromCurrentAddressgoogleAPI, "bxjsgdw");
    const { address_components, formatted_address, geometry } =
      dataFromCurrentAddressgoogleAPI;
    console.log(address_components, "address_components");

    console.log(dataFromCurrentAddressgoogleAPI, "googleAPIResponse");
    const newData = {};
    dataFromCurrentAddressgoogleAPI?.address_components?.map((component) => {
      const { long_name, types } = component;
      console.log(long_name, "long_name");
      console.log(types, "types");
      console.log(types[0], "DEtails from THE GooGLE");
      switch (types[0]) {
        // case "political":
        //   newData.currentaddressLine2 = long_name;
        //   break;
        case "landmark":
          newData.currentarea = long_name;
          break;
        case "route":
          newData.currentaddressLine2 = long_name;
          break;
        case "locality":
          newData.currentcity = long_name;
          break;
        case "administrative_area_level_3":
          newData.currentdistrict = long_name;
          break;
        case "administrative_area_level_1":
          newData.currentstate = long_name;
          break;
        case "country":
          newData.currentcountry = long_name;
          break;
        case "postal_code":
          newData.currentpincode = long_name;
          break;
        default:
          break;
      }
      return null;
    });

    console.log(newData, "newData");
    setDataCollctedFromCurrentAddressGoogleMaps(true);
    setFormData((prevState) => {
      return {
        ...prevState,
        ...newData,
        currentlatitude: geometry?.location?.lat,
        currentlongitude: geometry?.location?.lng,
        currentaddress: formatted_address,
      };
    });

    var latitudemaps = "";
    var longitudemaps = "";
    navigator.geolocation.getCurrentPosition((position) => {
      latitudemaps = position.coords.latitude;
      longitudemaps = position.coords.longitude;
      setCurrentAddressCords({
        currentlat: position.coords.latitude,
        currentlong: position.coords.longitude,
      });
    });
    const mapspayload = {
      latitude: data?.lat || latitudemaps,
      longitude: data?.long || longitudemaps,
    };
  };

  const handleCurrentAddress1 = (data, dataFromCurrentAddressgoogleAPI) => {
    console.log(data, "data in MAps");
    console.log(dataFromCurrentAddressgoogleAPI, "bxjsgdw");
    const { address_components, formatted_address, geometry } =
      dataFromCurrentAddressgoogleAPI;
    console.log(address_components, "address_components");
    console.log(dataFromCurrentAddressgoogleAPI, "googleAPIResponse");
    const newData1 = {};
    dataFromCurrentAddressgoogleAPI?.address_components?.map((component) => {
      const { long_name, types } = component;
      console.log(long_name, "long_name");
      console.log(types, "types");
      console.log(types[0], "DEtails from THE GooGLE");
      switch (types[0]) {
        // case "political":
        //   newData.currentaddressLine2 = long_name;
        //   break;
        case "landmark":
          newData1.area1 = long_name;
          break;
        case "route":
          newData1.addressLine12 = long_name;
          break;
        case "locality":
          newData1.city1 = long_name;
          break;
        case "administrative_area_level_3":
          newData1.district1 = long_name;
          break;
        case "administrative_area_level_1":
          newData1.state1 = long_name;
          break;
        case "country":
          newData1.country1 = long_name;
          break;
        case "postal_code":
          newData1.pincode1 = long_name;
          break;
        default:
          break;
      }
      return null;
    });

    console.log(newData1, "newData");
    setDataCollctedFromCurrentAddressGoogleMaps1(true);
    setFormData((prevState) => {
      return {
        ...prevState,
        ...newData1,
        latitude1: geometry?.location?.lat,
        longitude1: geometry?.location?.lng,
        currentaddress: formatted_address,
      };
    });

    var latitudemaps = "";
    var longitudemaps = "";
    navigator.geolocation.getCurrentPosition((position) => {
      latitudemaps = position.coords.latitude;
      longitudemaps = position.coords.longitude;
      setCurrentAddressCords({
        currentlat: position.coords.latitude,
        currentlong: position.coords.longitude,
      });
    });
    const mapspayload = {
      latitude: data?.lat || latitudemaps,
      longitude: data?.long || longitudemaps,
    };
  };
  console.log("forms", formData);

  const handleOtpChange = (value) => {
    const otpString = value.join("");
    setOtpValue(otpString);
    console.log(otpString, "prajyot");
  };

  const purposeLoan = (label, value) => {
    console.log(label, value, "akshay");
    if (value === "Others") {
      setOthersField(true);
    } else {
      setOthersField(false);
    }
    handleChange("gender", value);
  };

  const purposeLoan1 = (label, value) => {
    console.log(label, value, "akshay");
    handleChange("gender1", value);
  };

  const purposeLoan2 = (label, value) => {
    console.log(label, value, "akshay");
    handleChange("relationShip1", label);
  };

  const kyc1 = (label, value) => {
    console.log(label, value, "akshay");
    handleChange("kycVerification1", value);
  };

  const [panNumber, setPanNumber] = useState("");

  const validateNames = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please Enter applicant Full Name'));
    }
    if (!/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/.test(value)) {
      return Promise.reject(new Error('Applicant name should not contain special characters'));
    }
    const lowerCaseValue = value.toUpperCase()
    const lowerCaseAadhaarName = adhaarFrontName.toUpperCase();
    const lowerCasePanName = panName.toUpperCase();
    if (lowerCaseValue !== lowerCaseAadhaarName) {
      return Promise.reject(new Error(`Applicant name does not match with ${formData?.kycVerification?.value === "aadharCard" ? "Aadhar card" : "voter id"} name`));
    }
    if (lowerCaseValue !== lowerCasePanName) {
      message.error('Applicant name does not match with PAN name')
    }
    return Promise.resolve();
  };

  const validateDOB = async (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please Select Date Of Birth'));
    }

    const selectedDate = dayjs(value).format("DD/MM/YYYY");
    const isDateInDDMMYYYYFormat = (dateStr) => {
      return /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr);
    };
    let adhaarSelectedDob;
    if (!isDateInDDMMYYYYFormat(adhaarDob)) {
      adhaarSelectedDob = dayjs(adhaarDob).format("DD/MM/YYYY");
    } else {
      adhaarSelectedDob = adhaarDob;
    }
    if (adhaarSelectedDob !== selectedDate) {
      return Promise.reject(new Error(`Selected Date of Birth does not match with ${formData?.kycVerification?.value === "aadharCard" ? "Aadhar card" : "voter id"} Date of Birth`));
    }
    return Promise.resolve();
  };


  return (
    <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="col-wrapper">
        <div className="loandetailstitle">2 - Applicant Details</div>
        <div className="applicant-documents">
          <div className="currentprogress">Current Progress</div>
          <div className="progress-container">
            <Progress percent={20} strokeColor="#003399" />
          </div>
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="loandetail">
        <div className="loantitle">Basic Details</div>
        <Form autoComplete="off" layout="vertical" form={form}>
          <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="kycVerification"
                label="KYC Verification Document"
              >
                <Select
                  value={formData?.kycVerification}
                  onChange={(value, label) => handleChange("kycVerification", value, label)}
                  size="large"
                  placeholder="Select KYC Verification Document"
                  options={kycType}
                >
                </Select>
              </Form.Item>
            </Col>
            {formData?.kycVerification?.value !== undefined ? <>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <UploadComponent
                  label={
                    formData?.kycVerification?.value === "aadharCard"
                      ? "Aadhar Card Front"
                      : "Voter ID Front"
                  }
                  name={
                    formData?.kycVerification?.value === "aadharCard"
                      ? "aadharCard"
                      : "voterId"
                  }
                  value={
                    formData?.kycVerification?.value === "aadharCard"
                      ? "aadharCard"
                      : "voterId"
                  }
                  docType={
                    formData?.kycVerification?.value === "aadharCard"
                      ? "E-aadhaar"
                      : "Voter ID Front"
                  }
                  id={id}
                  type="applicant"
                  section="applicant"
                  side="front"
                  required={true}
                  uploadedFile={documentsData}
                  applicantName={formData?.applicantfullname}
                  _id={_id}
                />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <UploadComponent
                  label={
                    formData?.kycVerification?.value === "aadharCard"
                      ? "Aadhar Card Back"
                      : "Voter ID Back"
                  }
                  name={
                    formData?.kycVerification?.value === "aadharCard"
                      ? "aadharCard"
                      : "voterId"
                  }
                  value={
                    formData?.kycVerification?.value === "aadharCard"
                      ? "aadharCard"
                      : "voterId"
                  }
                  docType={
                    formData?.kycVerification?.value === "aadharCard"
                      ? "E-aadhaar"
                      : "Voter ID Front"
                  }
                  id={id}
                  type="applicant"
                  section="applicant"
                  side="back"
                  required={true}
                  uploadedFile={documentsData}
                  applicantName={formData?.applicantfullname}
                  _id={_id}
                />
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item
                  name="kycId"
                  label={
                    formData?.kycVerification?.value === "aadharCard"
                      ? "Aadhar Number"
                      : "Voter ID"
                  }
                >
                  <Input
                    maxLength={
                      formData?.kycVerification?.value === "aadharCard" ? "12" : ""
                    }
                    type="text"
                    size="large"
                    placeholder={
                      formData?.kycVerification?.value === "aadharCard"
                        ? "Enter Aadhar Card Number"
                        : "Enter Voter ID Number"
                    }
                    value={
                      formData?.kycVerification?.value === "aadharCard"
                        ? "kycId"
                        : "kycId"
                    }
                    onChange={(e) =>
                      handleChange(
                        formData?.kycVerification?.value === "aadharCard"
                          ? "kycId"
                          : "kycId",
                        e.target.value
                      )
                    }
                    suffix={
                      <div className={verifyTextKYC !== "" ? "input-text-verify1" : ""}>{verifyTextKYC}</div>
                    }
                    disabled={verifyTextKYC !== "" ? true : false}
                  />
                </Form.Item>
              </Col>
              {kyclinks && (
                <Col
                  xs={24}
                  sm={24}
                  md={8}
                  lg={12}
                  xl={12}
                  className="verifywrapperinfo"
                >
                  <Button
                    className="verificationwrapper"
                    onClick={handleShareVerificationKyc}
                  >


                    {shareLinks}
                  </Button>
                  {formData?.kycVerification?.value === "aadharCard" ?
                    <div className="infowrapper" style={{ paddingLeft: "5px" }}>
                      <img src={info} style={{ width: "16px", height: "16px" }} />
                      <div className="intotitleverification">
                        Customer will receive an OTP on the Registered Mobile number for Adhaar Verification
                      </div>
                    </div>
                    : ""}
                </Col>
              )}
            </> : ""}
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <UploadComponent
                label="PAN Card"
                name="pancardNo"
                value="pancardNo"
                docType="PAN"
                id={id}
                type="applicant"
                section="applicant"
                side="front"
                required={true}
                uploadedFile={documentsData}
                applicantName={formData?.applicantfullname}
                _id={_id}
              />
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}></Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}></Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="pancardId"
                label="PAN Number"
              >
                <Input
                  type="text"
                  onChange={(e) => handleChange("pancardId", e.target.value)}
                  onInput={(e) =>
                    (e.target.value = e.target.value.toUpperCase())
                  }
                  size="large"
                  placeholder="Enter PAN Number"
                  maxLength={10}
                  disabled={verifyTextPAN !== "" ? true : false}
                  value={formData?.pancardId}
                  suffix={
                    <div className={verifyTextPAN !== "" ? "input-text-verify1" : ""}>{verifyTextPAN}</div>
                  }
                />
              </Form.Item>
            </Col>
            {panlinks && (
              <Col
                xs={24}
                sm={24}
                md={8}
                lg={12}
                xl={12}
                className="verifywrapperinfo"
              >
                <Button
                  className="verificationwrapper"
                  onClick={handleShareVerificationPan}
                >

                  Verify PAN
                </Button>
              </Col>
            )}
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="applicantfullname"
                label="Applicant's Full Name"
              >
                <Input
                  type="text"
                  size="large"
                  value={formData?.applicantfullname}
                  onChange={(e) =>
                    handleChange("applicantfullname", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="primaryMobile"
                label="Applicant's Mobile Number"
              >
                <Input
                  maxLength={10}
                  type="text"
                  value={formData?.primaryMobile}
                  onChange={(e) =>
                    handleChange("primaryMobile", e.target.value)
                  }
                  size="large"
                // suffix={
                //   <div
                //     className="input-text-verify"
                //   // onClick={showModalMobileVerify}
                //   >
                //     VERIFY
                //   </div>
                // }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="primaryEmail"
                label="Applicant's Email ID"
              >
                <Input
                  type="text"
                  value={formData?.primaryEmail}
                  onChange={(e) => handleChange("primaryEmail", e.target.value)}
                  size="large"
                  placeholder="Enter Applicant Email ID"
                // suffix={
                //   <div
                //     className="input-text-verify"
                //     onClick={showModalEmailVerify}
                //   >
                //     VERIFY
                //   </div>
                // }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="dob"
                label="Date Of Birth"
              >
                <DatePicker
                  format="DD-MM-YYYY"
                  value={formData?.dob ? dayjs(formData.dob, "YYYY-MM-DD") : null}
                  onChange={handleDateChange}
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current &&
                    (current < dayjs().subtract(60, "years") ||
                      current > dayjs().subtract(18, "years"))
                  }
                  showDisabledMonthNavigation
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="gender"
                label="Gender"
              >
                <Select
                  onChange={purposeLoan}
                  value={formData?.gender}
                  size="large"
                  options={genderTypes}
                  placeholder="Select Gender"
                >
                </Select>
              </Form.Item>
            </Col>
            {othersField === true ? (
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item
                  name="others"
                  label="Others"
                >
                  <Input
                    size="large"
                    placeholder=""
                    value={formData?.others}
                    onChange={(e) => handleChange("others", e.target.value)}
                  />
                </Form.Item>
              </Col>
            ) : (
              <Col xs={24} sm={24} md={12} lg={8} xl={8}></Col>
            )}

            <Col xs={24} sm={24} md={12} lg={8} xl={8}></Col>


            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="d-flex justify-content-between">
                <div className="permanentaddress">
                  Permanent Address Details
                </div>
                <div className="locatemap" onClick={showModalMap}>
                  Locate on Map
                </div>
              </div>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="addressLine1"
                label="Permanent Address Line 1"
              >
                <Input
                  type="text"
                  value={formData?.addressLine1}
                  onChange={(e) => handleChange("addressLine1", e.target.value)}
                  size="large"
                  placeholder="Enter Permanent Address Line 1"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="addressLine2"
                label="Permanent Address Line 2"
              >
                <Input
                  type="text"
                  value={formData?.addressLine2}
                  onChange={(e) => handleChange("addressLine2", e.target.value)}
                  size="large"
                  placeholder="Enter Permanent Address Line 2"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="area"
                label="Landmark"
              >
                <Input
                  type="text"
                  size="large"
                  placeholder="Enter Landmark"
                  value={formData?.area}
                  onChange={(e) => handleChange("area", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="city"
                label="City/Town/Village"
              >
                <Input
                  type="text"
                  value={formData?.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  size="large"
                  placeholder="Enter City/Town/Village"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="state"
                label="State"
              >
                <Input
                  type="text"
                  value={formData?.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  size="large"
                  placeholder="Enter State"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="country"
                label="Country"
              >
                <Input
                  type="text"
                  value={formData?.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  size="large"
                  placeholder="Enter Country"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="pincode"
                label="PIN Code"
              >
                <Input
                  // type="number"
                  size="large"
                  placeholder="Enter PIN Code"
                  value={formData?.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="latitude"
                label="Latitude"
              >
                <Input
                  type="text"
                  value={formData?.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                  size="large"
                  placeholder="Enter Latitude"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="longitude"
                label="Longitude"
              >
                <Input
                  type="text"
                  value={formData?.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                  size="large"
                  placeholder="Enter Longitude"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Checkbox
                name="isCurrentAddressSameAsPermenantAddress"
                checked={formData?.isCurrentAddressSameAsPermenantAddress}
                onChange={handleCheckboxChange}
              >
                Is Current address same as Permanent address
              </Checkbox>
            </Col>
            {!formData?.isCurrentAddressSameAsPermenantAddress && (
              <>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div className="d-flex justify-content-between">
                    <div className="permanentaddress">
                      Current Address Details
                    </div>
                    <div
                      className="locatemap"
                      onClick={showModalCurrentAddressMap}
                    >
                      Locate on Map
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name="currentaddressLine1"
                    label="Current Address Line 1"
                  >
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter Current Address Line 1"
                      value={formData?.currentaddressLine1}
                      onChange={(e) =>
                        handleChange("currentaddressLine1", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name="currentaddressLine2"
                    label="Current Address Line 2"
                  >
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter Current Address Line 2"
                      value={formData?.currentaddressLine2}
                      onChange={(e) =>
                        handleChange("currentaddressLine2", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name="currentarea"
                    label="Landmark"
                  >
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter Landmark"
                      value={formData?.currentarea}
                      onChange={(e) =>
                        handleChange("currentarea", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name="currentcity"
                    label="City/Town/Village"
                  >
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter City/Town/Village"
                      value={formData?.currentcity}
                      onChange={(e) =>
                        handleChange("currentcity", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name="currentstate"
                    label="State"
                  >
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter State"
                      value={formData?.currentstate}
                      onChange={(e) =>
                        handleChange("currentstate", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name="currentcountry"
                    label="Country"
                  >
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter Country"
                      value={formData?.currentcountry}
                      onChange={(e) =>
                        handleChange("currentcountry", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name="currentpincode"
                    label="PIN Code"
                  >
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter PIN Code"
                      value={formData?.currentpincode}
                      onChange={(e) =>
                        handleChange("currentpincode", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name="currentlatitude"
                    label="Latitude"
                  >
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter Latitude"
                      value={formData?.currentlatitude}
                      onChange={(e) =>
                        handleChange("currentlatitude", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name="currentlongitude"
                    label="Longitude"
                  >
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter Longitude"
                      value={formData?.currentlongitude}
                      onChange={(e) =>
                        handleChange("currentlongitude", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
              </>
            )}

            {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="d-flex justify-content-center">
                <Button className="addcoapplicantbtn">
                  <img src={plusIcon} />
                  Add Co-applicant
                </Button>
              </div>
            </Col> */}
          </Row>
          <Row style={{ alignItems: "center" }}>
            <Col style={{ display: "flex", justifyContent: "center" }} xl={22} sm={22} xs={22} lg={22} md={22}>
              <Button onClick={addCoApplicant} style={{ backgroundColor: "white", color: "#003399", border: "1px solid #003399", borderRadius: 10, margin: "10px" }}>Add Co-Applicant</Button>
            </Col>
            {/* <Col xl={2} sm={2} xs={2} lg={2} md={2}>
              <DeleteOutlined style={{ color: "red" }} onClick={addCoApplicant} />
            </Col> */}
          </Row>

          {coApplicant === true ?
            <>
              <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div className="d-flex justify-content-between">
                    <div className="permanentaddress">
                      Co-Applicant
                    </div>
                    <div className="locatemap" onClick={showModalMap1}>
                      Locate on Map
                    </div>
                  </div>
                </Col>
                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="fullName1" label="Full Name">
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter Full Name"
                      value={formData?.fullName1}
                      onChange={(e) =>
                        handleChange("fullName1", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="primaryEmail1" label="Primary Email">
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter Primary Email"
                      value={formData?.primaryEmail1}
                      onChange={(e) =>
                        handleChange("primaryEmail1", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="primaryMobile1" label="Primary Mobile">
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter Primary Mobile"
                      value={formData?.primaryMobile1}
                      onChange={(e) =>
                        handleChange("primaryMobile1", e.target.value)
                      } />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="dob1" label="Date of Birth">
                    <DatePicker
                      type="text"
                      size="large"
                      placeholder="Select Date"
                      style={{ width: '100%' }}
                      value={
                        formData.dob1 ? dayjs(formData.dob1, "YYYY-MM-DD") : null
                      }
                      onChange={handleDateChange1} />
                  </Form.Item>
                </Col>

                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="gender1" label="Gender">
                    <Select
                      type="text"
                      size="large"
                      options={genderTypes}
                      placeholder="Select Gender"
                      value={formData?.gender1}
                      onChange={purposeLoan1}>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="relationShip1" label="Relationship">
                    <Select
                      type="text"
                      size="large"
                      options={relationshipTypes}
                      placeholder="Select Relationship"
                      value={formData?.relationShip1}
                      onChange={purposeLoan2}>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="kycVerification1" label="KYC Verification">
                    <Select
                      type="text"
                      size="large"
                      options={kycType}
                      placeholder="Select KYC Verification"
                      value={formData?.kycVerification1}
                      onChange={kyc1}>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="kycId1" label="KYC ID">
                    <Input
                      value={formData?.kycId1}
                      onChange={(e) =>
                        handleChange("kycId1", e.target.value)
                      }
                      type="text"
                      size="large"
                      placeholder="Enter KYC ID" />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="pancardId1" label="Pancard ID">
                    <Input
                      value={formData?.pancardId1}
                      onChange={(e) =>
                        handleChange("pancardId1", e.target.value)
                      }
                      type="text"
                      size="large"
                      placeholder="Enter PAN Card ID" />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="addressLine11" label="Address Line 1">
                    <Input
                      value={formData?.addressLine11}
                      onChange={(e) =>
                        handleChange("addressLine11", e.target.value)
                      }
                      type="text"
                      size="large"
                      placeholder="Enter Address Line 1" />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="addressLine12" label="Address Line 2">
                    <Input
                      value={formData?.addressLine12}
                      onChange={(e) =>
                        handleChange("addressLine12", e.target.value)
                      }
                      type="text"
                      size="large"
                      placeholder="Enter Address Line 2" />
                  </Form.Item>
                </Col>

                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="area1" label="Area">
                    <Input
                      value={formData?.area1}
                      onChange={(e) =>
                        handleChange("area1", e.target.value)
                      }
                      type="text"
                      size="large"
                      placeholder="Enter Area" />
                  </Form.Item>
                </Col>

                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="city1" label="City">
                    <Input
                      value={formData?.city1}
                      onChange={(e) =>
                        handleChange("city1", e.target.value)
                      }
                      type="text"
                      size="large"
                      placeholder="Enter City" />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="state1" label="State">
                    <Input
                      value={formData?.state1}
                      onChange={(e) =>
                        handleChange("state1", e.target.value)
                      }
                      type="text"
                      size="large"
                      placeholder="Enter State" />
                  </Form.Item>
                </Col>

                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="country1" label="Country">
                    <Input
                      value={formData?.country1}
                      onChange={(e) =>
                        handleChange("country1", e.target.value)
                      }
                      type="text"
                      size="large"
                      placeholder="Enter Country"
                    />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="pincode1" label="Pincode">
                    <Input
                      value={formData?.pincode1}
                      onChange={(e) =>
                        handleChange("pincode1", e.target.value)
                      }
                      type="text"
                      size="large"
                      placeholder="Enter Pincode"
                    />
                  </Form.Item>
                </Col>

                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="latitude1" label="Latitude">
                    <Input
                      value={formData?.latitude1}
                      onChange={(e) =>
                        handleChange("latitude1", e.target.value)
                      }
                      type="text"
                      size="large"
                      placeholder="Enter Latitude"
                    />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} sm={12} xs={24} lg={8}>
                  <Form.Item name="longitude1" label="Longitude">
                    <Input
                      value={formData?.longitude1}
                      onChange={(e) =>
                        handleChange("longitude1", e.target.value)
                      }
                      type="text"
                      size="large"
                      placeholder="Enter Longitude"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </> : ""}
        </Form>

        <MapsContainer
          className="map-container"
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          cords={cords}
          setLocation={setCords}
          handleInsuredAddress={handleInsuredAddress}
          mapsaddress={mapsaddress}
        />
        <MapsCurrentAddress
          isModalCurrentAddressOpen={isModalCurrentAddressOpen}
          handlehandleCurrentAddressOkOk={handleCurrentAddressOk}
          handleCurrentAddressCancel={handleCurrentAddressCancel}
          currentAddressCords={currentAddressCords}
          setLocation={setCurrentAddressCords}
          handleCurrentAddress={handleCurrentAddress}
          mapsCurrentaddress={mapsCurrentaddress}
        />
        <CoApplicantMap
          isModalCurrentAddressOpen={iscoApplicantMaps}
          handlehandleCurrentAddressOkOk={handleCurrentAddressOk1}
          handleCurrentAddressCancel={handleCurrentAddressCancel1}
          currentAddressCords={currentAddressCords1}
          setLocation={setCurrentAddressCords1}
          handleCurrentAddress={handleCurrentAddress1}
          mapsCurrentaddress={mapsCurrentaddress1}
        />
        <Modal
          title="Verify Mobile Number"
          className="locateonmapmodal"
          open={isModalMobileVerifyOpen}
          onOk={handleOkMobileVerify}
          onCancel={handleMobileCancel}
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
                  width: "89px",
                  height: "42px",
                  padding: "10px 22px 10px 22px",
                  borderRadius: "8px",
                }}
              >
                Verify
              </Button>
            </>
          )}
        >
          <Form
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Row
              gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}
              className="otpWrapper"
            >
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="emailtextotp"
              >
                We have sent an OTP on the Applicant's mobile number
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="enterOtp otplabel"
              >
                <Form.Item label="Enter OTP" name="otp">
                  <InputOTP
                    autoFocus
                    inputType="numeric"
                    length={4}
                    className="center-input-message"
                  />
                </Form.Item>
                <div className="details d-flex justify-content-center ">
                  <div className="otp-info">
                    Didn't receive an OTP?{" "}
                    <span
                      className="resendotp"
                    // onClick={handleShareVerificationKyc}
                    >
                      Resend OTP
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          title="Verify OTP"
          className="locateonmapmodal"
          visible={openOtpModal}
          onOk={handleOkOtpVerify}
          onCancel={handleOkOtpVerify}
        >
          <Form
            onFinish={handleVerifyOtp}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            form={modalFormOtP}
          >
            <Row
              gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}
              className="otpWrapper"
            >
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="emailtextotp"
              >
                We have sent an OTP on the Mobile number
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="enterOtp otplabel"
              >
                <Form.Item label="Enter OTP" name="otp">
                  <InputOTP
                    autoFocus
                    inputType="numeric"
                    length={6}
                    className="center-input-message"
                    value={otpValue}
                    onChange={handleOtpChange}
                  />
                </Form.Item>
                <div className="details d-flex justify-content-center ">
                  <div className="otp-info">
                    Didn't receive an OTP?{" "}
                    <span className="resendotp" onClick={!resendDisabled && handleReShareVerificationKyc}>
                      {resendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                    </span>
                  </div>
                </div>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
              // </Row>className="d-flex flex-grow-1 justify-content-end align-items-center"
              >
                <Button
                  style={{
                    backgroundColor: "#fff",
                    color: "#003399",
                    border: "1px solid #003399",
                    borderRadius: "8px",
                    width: "96px",
                    height: "42px",
                    padding: "10px 22px 10px 22px",
                    marginRight: "5px",
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
                    width: "89px",
                    height: "42px",
                    padding: "10px 22px 10px 22px",
                    borderRadius: "8px",
                  }}
                  onClick={handleVerifyOtp}
                >
                  Verify
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};

export default BasicDetails;
