import { Button, Col, Form, Modal, Progress, Row, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import UploadComponent from "./UploadComponent";
import MapsContainer from "../../utils/MapsContainer";
import { useSelector } from "react-redux";
import axiosRequest from "../../axios-request/API.request.js";

const DOC_KEY = {
  finacialDocument: "financialDocument",
  salarySlip: "salarySlip",
  form26AS: "form26AS",
  plSatement: "plSatement",
  form16ABIncomeExendiatureStatement: "form16ABIncomeExendiatureStatement",
};
const EmploymentDetails = ({
  form,
  individualDetails,
  setIndividualDetails,
  id,
  document,
}) => {
  const storeIndividualDetails = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?.employmentDetails
  );
  const employmentDocuments = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?.document
  );
  const { address, details } = storeIndividualDetails || {};
  console.log("storeIndividualDetails", details?.natureOfEmployment);
  const [dataCollctedFromgooglemaps, setDataCollctedFromGoogleMaps] =
    useState(false);
  const [cords, setCords] = useState({ lat: 0, long: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapsaddress, setmapsAddress] = useState("");
  const [documentsEmploymentData, setDocumentsEmploymentData] = useState([]);
  const [effectCount, setEffectCount] = useState(0);
  const [individualDocumentType, setIndividualDocumentType] = useState([])
  const [natureofEmploymentType, setNatureofEmploymentType] = useState([])
  const [employeeEducationType, setEmployeeEducationType] = useState([])
  const [maritalStatusType, setMaritalStatusType] = useState([])
  const [residenceType, setResidenceType] = useState([])
  const [residenceStatusType, setResidenceStatusType] = useState([])
  const [occupationType, setOccupationType] = useState([])

  useEffect(() => {
    if (employmentDocuments?.length > 1 && effectCount < 3) {
      setDocumentsEmploymentData(employmentDocuments);
      setEffectCount((prevCount) => prevCount + 1);
    }
  }, [employmentDocuments, effectCount]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=individualDocument');
        const PurposeTypes = response?.data?.data?.individualDocument.map(item => ({
          label: item.label,
          value: item.value
        }));
        setIndividualDocumentType(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=natureOfEmployement');
        const PurposeTypes = response?.data?.data?.natureOfEmployement.map(item => ({
          label: item.label,
          value: item.value
        }));
        setNatureofEmploymentType(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=employeeEducation');
        const PurposeTypes = response?.data?.data?.employeeEducation.map(item => ({
          label: item.label,
          value: item.value
        }));
        setEmployeeEducationType(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=maritalStatus');
        const PurposeTypes = response?.data?.data?.maritalStatus.map(item => ({
          label: item.label,
          value: item.value
        }));
        setMaritalStatusType(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=residence');
        const PurposeTypes = response?.data?.data?.residence.map(item => ({
          label: item.label,
          value: item.value
        }));
        setResidenceType(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=residentialStatus');
        const PurposeTypes = response?.data?.data?.residentialStatus.map(item => ({
          label: item.label,
          value: item.value
        }));
        setResidenceStatusType(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=occupationEmployment');
        const PurposeTypes = response?.data?.data?.occupationEmployment.map(item => ({
          label: item.label,
          value: item.value
        }));
        setOccupationType(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  console.log("individualDetails", individualDetails?.individualdocuments);
  useEffect(() => {
    form.setFieldsValue({
      individualdocuments: details?.individualDocName,
      employersname: details?.employeeName,
      occupation: details?.occupation,
      natureofEmployment: details?.natureOfEmployment,
      yearsofexperience: details?.yrsOfExp,
      education: details?.education,
      maritalstatus: details?.maritalStatus,
      residentalstatus: details?.residentialStatus,
      noofyearsinthecurrentResidence: details?.noOfYrsInCurrentResidence,
      residence: details?.residence,
      noOfDependents: details?.noOfDependents,
      addressline1: address?.addressLine1,
      addressline2: address?.addressLine2,
      area: address?.area,
      city: address?.city,
      state: address?.state,
      country: address?.country,
      pincode: address?.pincode,
      latitude: address?.latitude,
      longitude: address?.longitude,
    });
    setIndividualDetails({
      ...individualDetails,
      individualdocuments: details?.individualDocName,
      employersname: details?.employeeName,
      occupation: details?.occupation,
      natureofEmployment: details?.natureOfEmployment,
      yearsofexperience: details?.yrsOfExp,
      education: details?.education,
      maritalstatus: details?.maritalStatus,
      residentalstatus: details?.residentialStatus,
      noofyearsinthecurrentResidence: details?.noOfYrsInCurrentResidence,
      residence: details?.residence,
      noOfDependents: details?.noOfDependents,
      addressline1: address?.addressLine1,
      addressline2: address?.addressLine2,
      area: address?.area,
      city: address?.city,
      state: address?.state,
      country: address?.country,
      pincode: address?.pincode,
      latitude: address?.latitude,
      longitude: address?.longitude,
    });
  }, []);
  useEffect(() => {
    if (dataCollctedFromgooglemaps) {
      form.setFieldsValue({
        // permanentaddressline1:dataFromgoogleAPI?.address,
        // permanentaddressline2:dataFromgoogleAPI?.address,
        addressline2: individualDetails?.addressline2,
        area: individualDetails?.area,
        city: individualDetails?.city,
        state: individualDetails?.state,
        country: individualDetails?.country,
        pincode: individualDetails?.pincode,
        latitude: individualDetails?.latitude,
        longitude: individualDetails?.longitude,
      });
    }
  }, [dataCollctedFromgooglemaps, individualDetails]);

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
      console.log(types[0], "DEtails from THE GooGLE");
      switch (types[0]) {
        case "landmark":
          newData.area = long_name;
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
    setIndividualDetails((prevState) => {
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
  const showModalMap = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = (field, value, label) => {
    if (field === "occupation" || field === "residence" || field === "individualdocuments" || field === "natureofEmployment" || field === "education" || field === "maritalstatus" || field === "residentalstatus") {
      setIndividualDetails({ ...individualDetails, [field]: label });
    }
    else {
      setIndividualDetails({ ...individualDetails, [field]: value });
    }
  };

  return (
    <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="col-wrapper">
        <div className="loandetailstitle">3 -  Individual Bank Details</div>
        <div className="applicant-documents">
          <div className="currentprogress">Current Progress</div>
          <div className="progress-container">
            <Progress percent={60} strokeColor="#68BA7F" />
          </div>
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="loandetail">
        <Form autoComplete="off" layout="vertical" form={form}>
          <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}></Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="loantitle">
              Individual Details
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Form.Item
                name="individualdocuments"
                label="Individual Documents"
                rules={[
                  {
                    required: true,
                    message: "Please Enter the Individual Documents",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Select
                  placeholder="Select Individual Documents"
                  size="large"
                  value={individualDetails?.individualdocuments}
                  options={individualDocumentType}
                  onChange={(value, label) =>
                    handleChange("individualdocuments", value, label)
                  }
                >
                </Select>
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={8}
              lg={8}
              xl={8}
              style={{ marginTop: "20px" }}
            >
              <UploadComponent
                document={document}
                label="Document"
                showLabel={false}
                name={individualDetails?.individualdocuments?.value}
                value={individualDetails?.individualdocuments?.value}
                id={id}
                type="proposal"
                section="employment"
                side="front"
                uploadedFile={documentsEmploymentData}
              />
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}></Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="employersname"
                label="Employer's Name"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Employer Name",
                  },
                  {
                    pattern: /^[A-Za-z\s]+$/,
                    message: "Please enter valid employer name",
                  },
                ]}
              >
                <Input
                  type="text"
                  size="large"
                  placeholder="Enter Employer's Name"
                  value={individualDetails?.employersname}
                  onChange={(e) =>
                    handleChange("employersname", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="occupation"
                label="Occupation"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Occupation",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Select
                  placeholder="Select Occupation"
                  size="large"
                  value={individualDetails?.occupation}
                  options={occupationType}
                  onChange={(value,label) => handleChange("occupation", value,label)}
                >
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="natureofEmployment"
                label="Nature of Employment"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Nature Of Employment",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Select
                  placeholder="Select Nature Of Employment"
                  size="large"
                  value={individualDetails?.natureofEmployment}
                  onChange={(value, label) =>
                    handleChange("natureofEmployment", value, label)
                  }
                  options={natureofEmploymentType}
                >
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="yearsofexperience"
                label="Years of Experience"
                rules={[
                  {
                    required: true,
                    message: "Please Select Years Of Exp",
                  },
                ]}
              >
                <Input
                  // type="number"
                  size="large"
                  placeholder="Enter Years Of Experience"
                  value={individualDetails?.yearsofexperience}
                  onChange={(e) =>
                    handleChange("yearsofexperience", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="education"
                label="Education"
                rules={[
                  {
                    required: true,
                    message: "Please Select Eduction Details",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Select
                  placeholder="Select Education"
                  size="large"
                  value={individualDetails?.education}
                  onChange={(value, label) => handleChange("education", value, label)}
                  options={employeeEducationType}
                >
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="maritalstatus"
                label="Marital status"
                rules={[
                  {
                    required: true,
                    message: "Please Select Marital Status",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Select
                  placeholder="Select Marital Status"
                  size="large"
                  value={individualDetails?.maritalstatus}
                  options={maritalStatusType}
                  onChange={(value, label) => handleChange("maritalstatus", value, label)}
                >
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="residentalstatus"
                label="Residential Status"
                rules={[
                  {
                    required: true,
                    message: "Please Select Residentail Status",
                  },
                ]}
              >
                <Select
                  placeholder="Select Residentail Status"
                  size="large"
                  value={individualDetails?.residentalstatus}
                  options={residenceStatusType}
                  onChange={(value, label) => handleChange("residentalstatus", value, label)}
                >
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="noofyearsinthecurrentResidence"
                label="No of years in the current Residence"
                rules={[
                  {
                    required: true,
                    message: "Please Enter No Of Years In Current Residence",
                  },
                ]}
              >
                <Input
                  // type="number"
                  size="large"
                  placeholder="Enter No Of Years In The Current Residence"
                  value={individualDetails?.noofyearsinthecurrentResidence}
                  onChange={(e) =>
                    handleChange(
                      "noofyearsinthecurrentResidence",
                      e.target.value
                    )
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="residence"
                label="Residence"
                rules={[
                  {
                    required: true,
                    message: "Please Select Residence",
                  },
                ]}
              >
                <Select
                  placeholder="Select Residence"
                  size="large"
                  value={individualDetails?.residence}
                  options={residenceType}
                  onChange={(value, label) => handleChange("residence", value, label)}
                >
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="noOfDependents"
                label="No of dependents"
                rules={[
                  {
                    required: true,
                    message: "Please Enter No of Dependentance",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter No of dependents"
                  value={individualDetails?.noOfDependents}
                  onChange={(e) =>
                    handleChange("noOfDependents", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}></Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}></Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="d-flex justify-content-between">
                <div className="loantitle">Employment Address Details</div>
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
                  value={individualDetails?.addressline1}
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
                  value={individualDetails?.addressline2}
                  onChange={(e) => handleChange("addressline2", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="area"
                label="Area"
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
                  value={individualDetails?.area}
                  onChange={(e) => handleChange("area", e.target.value)}
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
                  value={individualDetails?.city}
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
                  value={individualDetails?.state}
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
                  value={individualDetails?.country}
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
                  placeholder="Enter PIN Code"
                  size="large"
                  value={individualDetails?.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="latitude"
                label="Latitude"
                rules={[
                  {
                    required: false,
                    message: "Please Enter Latitude",
                  },
                ]}
              >
                <Input
                  // type="number"
                  placeholder="Enter Latitude"
                  size="large"
                  value={individualDetails?.latitude}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="longitude"
                label="Longitude"
                rules={[
                  {
                    required: false,
                    message: "Please Enter Longitude",
                  },
                ]}
              >
                <Input
                  // type="number"
                  placeholder="Enter Longitude"
                  size="large"
                  value={individualDetails?.longitude}
                  onChange={(e) => handleChange("longitude", e.target.value)}
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
        <Modal
          title="Locate On Map"
          // className="locateonmapmodal"
          // open={isModalOpen}
          // onOk={handleOk}
          // onCancel={handleCancel}
          footer={(_, { OkBtn, CancelBtn }) => (
            <>
              <Button
                style={{
                  backgroundColor: "#fff",
                  color: "#68BA7F",
                  border: "1px solid #68BA7F",
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
                  backgroundColor: "#68BA7F",
                  color: "#fff",
                  border: "1px solid #68BA7F",
                  boxShadow: "0px 2px 12px 0px #68BA7F52",
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
            <div className="container"></div>
          </Row>
        </Modal>
      </Col>
    </Row>
  );
};

export default EmploymentDetails;
