import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  DatePicker,
  InputNumber,
  message,
} from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import success from "../../assets/image/Rectangle 215.png";
import ErrorIcon from '@mui/icons-material/Error';
import "../../../src/pages/loanApplication/LoanApplication.css";
import { CloseOutlined } from "@ant-design/icons";
import { Checkmark } from 'react-checkmark'
import { useDispatch } from "react-redux";
import axiosRequest from "../../axios-request/API.request";
import { setLoader } from "../../state/slices/loader";
import dayjs from "dayjs";
import { fetchProposalById } from "../../state/slices/proposalSlice";

const NewApplication = ({ open, onCancel, checkingEligible, form: externalForm, contentTrue, setContentTrue, checkEligibility: externalCheckEligibility, showSuccessPage: externalShowSuccessPage, showErrorPage: externalShowErrorPage, value, handleChange }) => {
  const [localForm] = Form.useForm();
  const formToUse = externalForm || localForm;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value1, setValue1] = useState("entity");
  const [value2, setValue2] = useState("sme");
  const [applicationTypes, setApplicationTypes] = useState([])
  const [loanTypes, setLoanTypes] = useState([])
  const [individualPurposeTypes, setIndividualPurposeTypes] = useState([])
  const [entityPurposeTypes, setEntityPurposeTypes] = useState([])
  const [othersField, setOthersField] = useState(false);
  const [id, setId] = useState();
  const [data, setData] = useState({});
  
  // Internal state
  const [showSuccessPage, setShowSuccessPage] = useState(externalShowSuccessPage || false);
  const [showErrorPage, setShowErrorPage] = useState(externalShowErrorPage || false);
  const [checkEligibility, setCheckEligibility] = useState(externalCheckEligibility || false);

  const [inputValue, setInputValue] = useState({
    applicationType: "",
    loanType: "",
    fullName: "",
    primaryMobile: "",
    dob: "",
    amount: "",
    tenure: 0,
    purpose: "",
    others: "",
    monthlySales: 0,
    estimatedMontlyIncome: 0,
  });

  const handleNewApplicationModalCancel = () => {
    onCancel();
    formToUse.resetFields()
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=applicationType');
        setApplicationTypes(response?.data?.data?.applicationType || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=typeOfLoan');
        setLoanTypes(response?.data?.data?.typeOfLoan || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=purposeOfLoanIndividual');
        const PurposeTypes = response?.data?.data?.purposeOfLoanIndividual.map(item => ({
          label: item.label,
          value: item.value
        }));
        setIndividualPurposeTypes(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=purposeOfLoanEntity');
        const PurposeTypes = response?.data?.data?.purposeOfLoanEntity.map(item => ({
          label: item.label,
          value: item.value
        }));
        setEntityPurposeTypes(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const data = value1;
    applicationTypes.forEach(item => {
      if (item?.value === data) {
        setInputValue((prevState) => ({
          ...prevState,
          applicationType:
          {
            label: item?.label,
            value: item?.value
          },
        }));
      }
    });
  }, [value1, applicationTypes]);

  useEffect(() => {
    const data = value2;
    loanTypes.forEach(item => {
      if (item?.value === data) {
        setInputValue((prevState) => ({
          ...prevState,
          loanType:
          {
            label: item?.label,
            value: item?.value
          },
        }));
      }
    });
  }, [value2, loanTypes]);

  const onRadioChange1 = (type) => {
    setOthersField(false)
    setValue1(type?.value);
    formToUse.resetFields();
  };

  const onRadioChange2 = (type) => {
    setValue2(type?.value);
    setOthersField(false)
    formToUse.resetFields();
  };

  const purposeLoan = (label, value) => {
    setInputValue((prevState) => ({
      ...prevState,
      purpose: value
    }));
    if (label === "others") {
      setOthersField(true);
    } else {
      setOthersField(false);
    }
  };

  const handleCheckEligibility = async (values) => {
    dispatch(setLoader(true));
    const payload = {
      applicant: {
        fullName: values.fullName,
        primaryMobile: values.primaryMobile,
        dob: dayjs(values.dob).format("YYYY-MM-DD"),
      },
      loanDetails: {
        applicationType: inputValue?.applicationType,
        loanType: inputValue?.loanType,
        amount: values.amount,
        tenure: values.tenure,
        purpose: inputValue?.purpose,
        otherPurpose: values.others,
        estimatedMontlyIncome: Number(values.estimatedMontlyIncome),
      },
      ...(value1 === "entity" && value2 === "sme"
        ? {
          monthlySales: Number(values.monthlySales),
          isBusinessRegistered:
            values.businessregistered === "Yes" ? true : false,
        }
        : ""),
    };

    setData({
      value: value1,
      value2: value2,
    });
    await axiosRequest
      .post(`proposal/check-eligibility`, payload, { secure: true })
      .then((response) => {
        dispatch(setLoader(false));
        console.log("Response:", response);
        if(response.resCode === 2){
          alert(response.data.msg)
        }
        if (response.resCode === -1) {
          message.success(response.data.msg);
          setId(response.data.data.id);
          setCheckEligibility(true);
          setShowSuccessPage(true);
          formToUse.resetFields();
          console.log("Response:", response);
        } else if (response?.resCode === 1) {
          // setIsNewApplicationModalVisible(true)
          setCheckEligibility(true);
          setShowSuccessPage(false);
          setShowErrorPage(true)
          console.log("Response:", response);

        } else if (response?.resCode === 6) {
          setCheckEligibility(true);
          setShowSuccessPage(false);
          setShowErrorPage(true)
          console.log("Response:", response);

        }
      })
      .catch((error) => {
        // setIsNewApplicationModalVisible(true)
        dispatch(setLoader(false));
        setCheckEligibility(true);
        setShowSuccessPage(false);
        setShowErrorPage(true)
        console.error("Error:", error);
      });
  };

  const handleInput = (name, value, dateString) => {
    if (name === "estimatedMontlyIncome") {
      // const parsedValue = Math.abs(parseInt(value, 10)) || 0;
      console.log(value, "ppppp");
      setInputValue((prevState) => ({ ...prevState, [name]: value }));
    } else {
      setInputValue((prevState) => ({ ...prevState, [name]: value }));
    }
  };


  const formatNumberWithCommas = (value) => {
    if (value == null) return ''; // Handle undefined or null values

    const number = Number(value); // Convert value to a number
    if (isNaN(number)) return ''; // Check if value is not a valid number

    const formattedNumber = number.toLocaleString('en-IN', { maximumFractionDigits: 2 }); // Format number with commas
    return `₹ ${formattedNumber}`;
  }

  const handleNext = () => {
    if (onCancel) {
      onCancel();
    }
    formToUse.resetFields();
  }

  return (
    <Modal
      width={1000}
      title={checkEligibility ? "" : checkingEligible}
      open={open}
      onCancel={handleNewApplicationModalCancel}
      footer={null}
      closeIcon={checkEligibility ? null : <CloseOutlined />}
    >
      {!checkEligibility && (
        <Form form={formToUse} onFinish={handleCheckEligibility} layout="vertical">
          <Row
            gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}
            className="p-3"
          >
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="typeloan mb-3">Application for</div>
              {applicationTypes.map(type => (
                <Radio.Group
                  onChange={() => onRadioChange1(type)}
                  value={value1}
                  className="pb-3"
                  name="applicationType"
                >
                  <Radio
                    key={type._id}
                    value={type?.value}
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      lineHeight: "18px",
                      letterSpacing: "0em",
                      textAlign: "left",
                      color: "#444444",
                    }}
                  >
                    {type.label}
                  </Radio>
                </Radio.Group>
              ))}
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              {value1 === "entity" && (
                <>
                  <div className="typeloan mb-3">Type of Loan</div>
                  {loanTypes.map(type => (
                    <Radio.Group
                      onChange={() => onRadioChange2(type)}
                      value={value2}
                      className="pb-3"
                      name="loanType"
                    >
                      <Radio
                        key={type._id}
                        value={type?.value}
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          lineHeight: "18px",
                          letterSpacing: "0em",
                          textAlign: "left",
                          color: "#444444",
                        }}
                      >
                        {type.label}
                      </Radio>
                    </Radio.Group>
                  ))}
                </>
              )}
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="fullName"
                label="Applicant Full Name"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Applicant Full Name",
                  },
                  {
                    pattern: new RegExp(/^[a-zA-Z ]+$/),
                    message: "Please Enter only Alphabets",
                  },
                ]}
              >
                <Input
                  type="text"
                  size="large"
                  placeholder="Enter Full Name"
                  value={inputValue.fullName}
                  onChange={(e) => handleInput("fullName", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="primaryMobile"
                label="Applicant Mobile Number"
                rules={[
                  {
                    required: true,
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(new Error("Mobile Number is required"));
                      }
                      if (!/^[0-9]*$/.test(value)) {
                        return Promise.reject(new Error("Only Numbers are allowed"));
                      }
                      if (value.length !== 10) {
                        return Promise.reject(new Error("Mobile Number should be 10 digits"));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  maxLength={10}
                  size="large"
                  placeholder="Enter Mobile Number"
                  value={inputValue.primaryMobile}
                  onChange={(e) => handleInput("primaryMobile", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[
                  {
                    required: true,
                    message: "DOB should be from 18 years - 60 years",
                  },
                ]}
              >
                <DatePicker
                  disabledDate={(current) =>
                    current &&
                    (current < dayjs().subtract(60, "years") ||
                      current > dayjs().subtract(18, "years"))
                  }
                  style={{ width: "100%" }}
                  size="large"
                  placeholder="DD-MM-YYYY"
                  value={dayjs(inputValue.dob).format("DD-MM-YYYY")}
                  onChange={(date, dateString) =>
                    handleInput("dob", dateString)
                  }
                  format="DD-MM-YYYY"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="amount"
                label="Loan Amount Required"
                rules={[
                  {
                    required: true,
                  },
                  {
                    validator: (_, value) =>
                      value >= 40000 && value <= 500000
                        ? Promise.resolve()
                        : Promise.reject("Loan amount must be between 40,000 and 500,000"),
                  },
                ]}
              >
                <InputNumber
                  controls={false}
                  style={{ width: "100%" }}
                  size="large"
                  placeholder="Enter Loan Amount"
                  value={inputValue?.amount}
                  formatter={formatNumberWithCommas}
                  onChange={(value) => handleInput("amount", value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="tenure"
                label="Tenure of Loan"
                rules={[
                  {
                    required: true,
                    message: "Please Select the Tenure of Loan",
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Select Tenure of Loan"
                  onChange={(value) => handleInput("tenure", value)}
                >
                  <Select.Option value={12}>12 months</Select.Option>
                  <Select.Option value={18}>18 months</Select.Option>
                  <Select.Option value={24}>24 months</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="purpose"
                label="Purpose Of Loan"
                rules={[
                  {
                    required: true,
                    message: "Please Select Purpose of Loan",
                  },
                ]}
              // value={inputValue.purpose}
              >
                {value1 === "individual" ? (
                  <>
                    <Select
                      onChange={purposeLoan}
                      size="large"
                      placeholder="Select"
                      options={individualPurposeTypes}
                      value={inputValue.purpose}
                    />
                  </>
                ) : (
                  <>
                    <Select
                      onChange={purposeLoan}
                      size="large"
                      placeholder="Select Purpose of Loan"
                      options={entityPurposeTypes}
                      value={inputValue.purpose}
                    />
                  </>
                )}
              </Form.Item>
            </Col>

            {othersField ? (
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item
                  name="others"
                  label="Others"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Others Details",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter Others"
                    value={inputValue.others}
                    onChange={(e) => handleInput("others", e.target.value)}
                  />
                </Form.Item>
              </Col>
            ) : (
              ""
            )}
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              {value1 === "individual" || value2 === "term" ? (
                <Form.Item
                  name="estimatedMontlyIncome"
                  label="Estimated Monthly Income"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please Enter Estimated Monthly Income",
                    },
                    // {
                    //   message: "only Numbers are allowed",
                    //   pattern: new RegExp(/^[0-9]*$/),
                    // },
                  ]}
                >
                  <InputNumber
                    controls={false}
                    style={{ width: '100%' }}
                    size="large"
                    placeholder="Enter Monthly Income"
                    // type="number"
                    value={inputValue?.estimatedMontlyIncome}
                    onChange={(value) =>
                      handleInput("estimatedMontlyIncome", value)
                    }
                    formatter={formatNumberWithCommas}

                  />
                </Form.Item>
              ) : (
                <Form.Item
                  name="businessregistered"
                  label="Is your Business Registered ?"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Is your Business Registered ?",
                    },
                  ]}
                  style={{ marginBottom: 0, width: "100%" }} // Set width for alignment
                >
                  <Select
                    onChange={(value) =>
                      handleInput("isBusinessRegistered", value)
                    }
                    placeholder="Select Bussiness Registerd"
                    size="large"
                  >
                    <Select.Option value="Yes">Yes</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                  </Select>
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              {value1 === "entity" && value2 === "sme" && (
                <Form.Item
                  name="monthlySales"
                  label="Monthly Sales"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Monthly Sales",
                    },
                    {
                      message: "only Numbers are allowed",
                      pattern: new RegExp(/^[0-9]*$/),
                    },
                  ]}
                  style={{ marginBottom: 0, width: "100%" }} // Set width for alignment
                >
                  <InputNumber
                    controls={false}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Enter Monthly Sales"
                    value={inputValue?.monthlySales}
                    onChange={(value) =>
                      handleInput("monthlySales", value)
                    }
                    formatter={formatNumberWithCommas}
                  />
                </Form.Item>
              )}
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="d-flex justify-content-end ">
                <Button
                  style={{
                    marginRight: "10px",
                    backgroundColor: "#fff",
                    color: "#68BA7F",
                    border: "1px solid #68BA7F",
                    borderRadius: "8px",
                    width: "96px",
                    height: "42px",
                    padding: "10px 22px 10px 22px",
                    fontSize: "16px",
                    fontWeight: "600",
                    lineHeight: "22px",
                    letterSpacing: "0em",
                    textAlign: "left",
                  }}
                  onClick={handleNewApplicationModalCancel}
                >
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  style={{
                    backgroundColor: "#68BA7F",
                    color: "#fff",
                    border: "1px solid #68BA7F",
                    boxShadow: "0px 2px 12px 0px #68BA7F52",
                    width: "178px",
                    height: "42px",
                    padding: "10px 22px 10px 22px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    lineHeight: "22px",
                    letterSpacing: "0em",
                    textAlign: "left",
                  }}
                >
                  Check Eligibility{" "}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      )}

      {showSuccessPage && (
        <Row justify="center" align="middle" className="pb-4">
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <Checkmark color='rgb(114, 231, 114)' className="check-mark-selected"  />
              {/* <img src={success} width={140} height={140} alt="Success Icon" /> */}
              <div className="success">Congratulations!</div>
              <div className="loansuccesstext p-3">
                {inputValue?.fullName} meets the eligibility criteria for <br />{" "}
                the application.
              </div>
              <Button
                className="applicationlisting"
                onClick={() => {
                  dispatch(fetchProposalById({ id }));
                  navigate("/Application-Listing/Application", {
                    state: { data, id },
                  });
                  formToUse.resetFields();
                }}
              >
                Start Application Form
              </Button>
              {/* <div className="okbtn" onClick={handleform}>
                Ok
              </div> */}
            </div>
          </Col>
        </Row>
      )}

      {showErrorPage && (
        <Row justify="center" align="middle" className="pb-4">
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <ErrorIcon style={{ color: "red", fontSize: "100px", margin: "17px 0px" }} />
              <div className="error">We are Sorry!</div>
              <div className="loansuccesstext p-3">
                {inputValue?.fullName} doesnt meets the eligibility criteria for <br />{" "}
                the application this time.
              </div>
              <Button
                className="applicationlisting"
                style={{ width: 65 }}
                onClick={handleNext}
              >
                Ok
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Modal>
  );
};

export default NewApplication;
