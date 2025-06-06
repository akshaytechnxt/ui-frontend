import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Progress,
  Row,
  Select,
} from "antd";
import { InputOTP } from "antd-input-otp";
import Sdloader from "../../components/Loader/FullPageLoader";
import { useDispatch } from "react-redux"
import React, { useEffect } from "react";
import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import axiosRequest from "../../axios-request/API.request"
import { setLoader } from "../../state/slices/loader";

const { Panel } = Collapse;

const ExistingLoanDetails = ({
  form,
  existingLoanDetails,
  setExistingLoanDetails,
  cibilReport,
  setCibilReport
}) => {
  const [fieldConfigs, setFieldsConfig] = useState([
    {
      existingBankName: "HDFC BANK",
      existingNumberOfFacility: "Long Term",
      existingSanctionedamount: "12,00,000",
      existingPresentOutstanding: "3000",
      existingSecurityOffered: "YES",
      existingActivemonthlyemi: "1,90,000"

    },
    {
      existingBankName: "SBI BANK",
      existingNumberOfFacility: "Short Term",
      existingSanctionedamount: "15,00,000",
      existingPresentOutstanding: "13,000",
      existingSecurityOffered: "No",
      existingActivemonthlyemi: "1,50,000"
    }
  ])
  const dispatch = useDispatch();
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const existingLoanDetailsStore = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?.existingLoanDetails
  );
  const cibilDetails = useSelector((state) => state?.fetchProposal?.proposal?.data?.data?.equifaxDetail)
  const _id = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?._id
  );
  const applicantType = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?.loanDetails?.applicationType?.value
  )
  console.log("existingLoanDetailsStore", existingLoanDetailsStore);
  const [openCibilModal, setOpenCibilModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [onSendOtp, setOnSendOtp] = useState(false);
  const [numPanels, setNumPanels] = useState(1);
  const [showExistingData, setExistingData] = useState(false)
  const [securityType, setSecurityType] = useState([])
  const [natureOfFacilityType, setNatureOfFacilityType] = useState([])
  const [cibilDate, setCibilDate] = useState("")
  const [summarydata, setSummaryData] = useState("")

  const cibilFetch = async () => {
    setLoading(true)
    dispatch(setLoader(true))
    // const form = {
    //   InquiryPurpose: "00",
    //   FirstName: storePan?.name?.value,
    //   DOB: dayjs(store?.applicantId?.dob).format("YYYY-MM-DD"),
    //   InquiryAddresses: [
    //     {
    //       AddressLine1: store?.applicantId?.currentAddress?.addressLine1,
    //       AddressLine2: store?.applicantId?.currentAddress?.addressLine2,
    //       Locality: "",
    //       City: store?.applicantId?.currentAddress?.city,
    //       State: store?.applicantId?.currentAddress?.state,
    //       AddressType: "H",
    //       Postal: `${store?.applicantId?.currentAddress?.pincode}`
    //     }
    //   ],
    //   InquiryPhones: [
    //     {
    //       Number: store?.applicantId?.primaryMobile,
    //       PhoneType: "H"
    //     }
    //   ],
    //   IDDetails: [
    //     {
    //       IDValue: store?.applicantId?.pancardId,
    //       IDType: "T",
    //       Source: "Inquiry"
    //     }
    //   ],
    //   MFIDetails: {
    //     FamilyDetails: [
    //       {
    //         AdditionalName: storePan?.father?.value,
    //         AdditionalNameType: "F"
    //       }
    //     ]
    //   }
    // }
    if (applicantType === "entity") {
      var form = {
        "proposalId": _id,
        "InquiryPurpose": "9002",
        "TransactionAmount": "100",
        "BusinessName": "SHAIK SADIQ ALI",
        "InquiryAddresses": [
          {
            "AddressLine1": "501 INDRAPRASTH 10 BODAKDEV FIRE STATIO N LANE BODAKDEV",
            "AddressLine2": "string",
            "Locality": "",
            "City": "surat",
            "State": "GJ",
            "AddressType": "H",
            "Postal": "380015"
          }
        ],
        "InquiryPhones": [
          {
            "Number": "9999956745",
            "PhoneType": "H"
          }
        ],
        "EmailAddresses": [
          {
            "EmailType": [
              ""
            ],
            "Email": "test@equifax.com"
          }
        ],
        "CustomFields": [
          {
            "key": "ProductCategory",
            "value": "OnlyCBR"
          }
        ],
        "IDDetails": [
          {
            "IDType": "T",
            "IDValue": "IQGPS3724B",
            "Source": "Inquiry"
          }
        ]
      }

    }
    else {
      var form = {
        "proposalId": _id,
        "InquiryPurpose": "00",
        "FirstName": "Con Junktivitas",
        "DOB": "1988-02-16",
        "InquiryAddresses": [
          {
            "AddressLine1": "KARIGALA B",
            "AddressLine2": "string",
            "Locality": "",
            "City": "surat",
            "State": "GJ",
            "AddressType": "H",
            "Postal": "301213"
          }
        ],
        "InquiryPhones": [
          {
            "Number": "7856205145",
            "PhoneType": "H"
          }
        ],
        "IDDetails": [
          {
            "IDValue": "YTR1748771",
            "IDType": "T",
            "Source": "Inquiry"
          }
        ],
        "MFIDetails": {
          "FamilyDetails": [
            {
              "AdditionalName": "RAJU S",
              "AdditionalNameType": "F"
            }
          ]
        }
      }
    }
    try {
      const response = await axiosRequest.post(`service/equifax/${applicantType}/combineCreditReport`, form);
      if (response?.resCode === -1) {
        const data = response?.data
        setSummaryData(data);
        setCibilReport(data)
        setButtonDisabled(true)
        const currentDate = new Date();
        const date = dayjs(currentDate)
        setCibilDate(date)
        setLoading(false)
        dispatch(setLoader(false))
        message.success("Data Fetched Successfully")
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  console.log(cibilDetails,"akshaysriram")
  useEffect(() => {
    if (cibilDetails === undefined || cibilDetails === "" || cibilDetails === null) {
      setButtonDisabled(false)
    }
    else {
      setButtonDisabled(true)
    }
  }, [])

  useEffect(() => {
    if (cibilDetails !== undefined || cibilDetails !== "") {
      setSummaryData(cibilDetails)
      setCibilReport(cibilDetails)
    }
    // if(cibilDetails !== undefined || cibilDetails !== "" || cibilDetails !== null){
    //   setButtonDisabled(true)
    // }
  }, [cibilDetails])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=securityOffered');
        const PurposeTypes = response?.data?.data?.securityOffered.map(item => ({
          label: item.label,
          value: item.value
        }));
        setSecurityType(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=numberOfFacility');
        const PurposeTypes = response?.data?.data?.numberOfFacility.map(item => ({
          label: item.label,
          value: item.value
        }));
        setNatureOfFacilityType(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const sendOtp = () => {
    setOnSendOtp(true);
    if (onSendOtp) {
      setExistingData(true)
      setOpenCibilModal(false)
    }
  };

  const handleChange = (field, value, index, label) => {
    if (field === `existingSecurityOffered.${index}` || field === `securityoffered.${index}` || field === `numberOfFacility.${index}` || field === `existingNumberOfFacility.${index}`) {
      const newData = [...existingLoanDetails];
      newData[index] = { ...newData[index], [field]: label };
      setExistingLoanDetails(newData);
    }
    else {
      const newData = [...existingLoanDetails];
      newData[index] = { ...newData[index], [field]: value };
      setExistingLoanDetails(newData);
    }
  };

  const handleDeletePanel = (index) => {
    const newData = existingLoanDetails.filter((_, i) => i !== index);
    console.log("index is", newData);
    setExistingLoanDetails(newData);
    setNumPanels(numPanels - 1);
  };

  useEffect(() => {
    if (existingLoanDetailsStore?.length > 0) {
      const newExistingLoanDetails = existingLoanDetailsStore.map(
        (loanDetails, index) => ({
          [`bankName.${index}`]: loanDetails?.bankName,
          [`numberOfFacility.${index}`]: loanDetails?.numberOfFacility,
          [`sanctionedamount.${index}`]: Number(loanDetails?.sanctionedAmount),
          [`presentoutstanding.${index}`]: loanDetails?.presentOutstanding,
          [`securityoffered.${index}`]: loanDetails?.securityOffered,
          [`activemonthlyemi.${index}`]: loanDetails?.activeMontlyEMI,
        })
      );
      // Set existingLoanDetails state with the updated array
      setExistingLoanDetails(newExistingLoanDetails);

      // Set form values based on existingLoanDetailsStore
      existingLoanDetailsStore.forEach((loanDetails, index) => {
        form.setFieldsValue({
          [`bankName.${index}`]: loanDetails?.bankName,
          [`numberOfFacility.${index}`]: loanDetails?.numberOfFacility,
          [`sanctionedamount.${index}`]: Number(loanDetails?.sanctionedAmount),
          [`presentoutstanding.${index}`]: loanDetails?.presentOutstanding,
          [`securityoffered.${index}`]: loanDetails?.securityOffered,
          [`activemonthlyemi.${index}`]: loanDetails?.activeMontlyEMI,
        });
      });
      setNumPanels(existingLoanDetailsStore.length);
    }
  }, [existingLoanDetailsStore]);

  const handleOk = () => {
    setOpenCibilModal(false);
  };
  const handleCancel = () => {
    setOpenCibilModal(false);
  };
  const onChange = (index) => {
    setActiveIndex(parseInt(index, 10));
  };

  const onChange1 = () => {

  }


  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

  const genExtra = (isActive, index) => (
    <div style={{ display: "flex", gap: "8px", color: "rgb(0, 51, 153)" }}>
      <span>{isActive ? <MinusOutlined /> : <PlusOutlined />}</span>
      <span>
        <DeleteOutlined onClick={() => handleDeletePanel(index)} />
      </span>
    </div>
  );
  const genExistingExtra = (isActive, index) => (
    <div style={{ display: "flex", gap: "8px", color: "rgb(0, 51, 153)" }}>
      <span>{isActive ? <MinusOutlined /> : <PlusOutlined />}</span>
    </div>
  );

  const addPanel = () => {
    setNumPanels(numPanels + 1);
  };


  return (
    <>
      {loading && <Sdloader sdloader={loading} />}
      <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="col-wrapper">
          <div className="loandetailstitle">4 - Existing Merchant Details</div>
          <div className="applicant-documents">
            <div className="currentprogress">Current Progress</div>
            <div className="progress-container">
              <Progress percent={40} strokeColor="#003399" />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="loandetail">
          <div className="d-flex justify-content-between">
            <div className="loantitle">Credit Bureau Details</div>
            <Button disabled={buttonDisabled} className="locatemap" onClick={cibilFetch}>
              Fetch Credit Bureau Report
            </Button>
          </div>
        </Col>
      </Row>
      <Form autoComplete="off" layout="vertical" form={form}>
        <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Form.Item
              // name="cibildateandtime"
              label="Date & Time"
              rules={[
                {
                  required: false,
                  message: "Please Select Date",
                },
              ]}
            >
              <Input
                showTime
                size="large"
                defaultValue={summarydata?.Date !== undefined ? `${summarydata?.Date}-${summarydata?.Time}` : ""}
                value={summarydata?.Date !== undefined ? `${summarydata?.Date}-${summarydata?.Time}` : ""}
                disabled
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          {applicantType === "entity" ? <>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                label="Commercial Loan Score"
                initialValue={summarydata?.equifaxDetail?.commercialBureauResp?.CommercialScore || 0}
                rules={[
                  {
                    required: false,
                    message: "Please Enter Commercial Loan Score",
                  },
                ]}
              >
                <Input
                  defaultValue={summarydata?.equifaxDetail?.commercialBureauResp?.CommercialScore || 0}
                  value={summarydata?.equifaxDetail?.commercialBureauResp?.CommercialScore || 0}
                  size="large"
                  disabled
                  placeholder="Enter Commercial Loan Score"
                />
              </Form.Item>
            </Col></> : <><Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                initialValue={summarydata?.micro_finance?.score[0]?.Value}
                // name="cibilscore"
                label="MFI Loan Score"
                rules={[
                  {
                    required: false,
                    message: "Please Enter MFI Loan Score",
                  },
                ]}
              >
                <Input
                  // type="number"
                  placeholder="Enter MFI Loan Score"
                  defaultValue={summarydata?.micro_finance?.score[0]?.Value}
                  value={summarydata?.micro_finance?.score[0]?.Value}
                  size="large"
                  disabled
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                // name="retailscore"
                label="Retail Loan Score"
                initialValue={summarydata?.retail?.score[0]?.Value}
                rules={[
                  {
                    required: false,
                    message: "Please Enter Retail Loan Score",
                  },
                ]}
              >
                <Input
                  // type="number"
                  defaultValue={summarydata?.retail?.score[0]?.Value}
                  value={summarydata?.retail?.score[0]?.Value}
                  size="large"
                  disabled
                  placeholder="Enter Retail Loan Score"
                />
              </Form.Item>
            </Col>
          </>}

          {/* <Col
            xs={24}
            sm={24}
            md={12}
            lg={8}
            xl={8}
            style={{ paddingTop: "14px" }}
          >
            <UploadComponent
              label="Consumer Credit Report"
              name="cibilupload"
              disabled={true}
              showLabel={false}
            />
          </Col> */}
        </Row>
        {applicantType === "entity" ?
          <>
            <Collapse
              // expandIconPosition={'end'}
              defaultActiveKey={['1']}
              className="existing-collapse"
              onChange={onChange1}
              size="small"
              bordered={false}
            >
              <Collapse.Panel key="1" style={{ marginBottom: '20px', border: '1px solid #6d92d1', borderRadius: '10px' }}
                showArrow={false}
                header={`Entity Finance`}
              // key={index.toString()}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">CF Count</div>
                    <div>{summarydata?.commercialBureauResp?.year_wise_detail?.['2024-2025']?.CF_Count || "--"}</div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Open CF Count</div>
                    <div>{summarydata?.commercialBureauResp?.year_wise_detail?.['2024-2025']?.OpenCF_Count || "--"}</div>
                  </Col>

                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Lenders Count</div>
                    <div>{summarydata?.commercialBureauResp?.year_wise_detail?.['2024-2025']?.Lenders_Count || "--"}</div>
                  </Col>
                  {/* 
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <div>Recent Account</div>
                <div>{summarydata?.micro_finance?.detail?.RecentAccount || "--"}</div>
              </Col> */}
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Sanctioned Amt Open CF Sum</div>
                    <div>{summarydata?.commercialBureauResp?.year_wise_detail?.['2024-2025']?.SanctionedAmtOpenCF_Sum || "--"}</div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Current Balance Open CF Sum</div>
                    <div>{summarydata?.commercialBureauResp?.year_wise_detail?.['2024-2025']?.CurrentBalanceOpenCF_Sum || "--"}</div>
                  </Col>
                  {/* <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Open CF Count</div>
                    <div>{summarydata?.commercialBureauResp?.CommercialCIRSummary?.OverallCreditSummary?.AsBorrower?.['2024-2025']?.OpenCF_Count || "--"}</div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Overdue Amount Sum</div>
                    <div>{summarydata?.commercialBureauResp?.CommercialCIRSummary?.OverallCreditSummary?.AsBorrower?.['2024-2025']?.Lenders_Count || "--"}</div>
                  </Col> */}
                </Row>
              </Collapse.Panel>
            </Collapse>
          </> :
          <>
            <Collapse
              // expandIconPosition={'end'}
              defaultActiveKey={['1']}
              className="existing-collapse"
              onChange={onChange1}
              size="small"
              bordered={false}
            >
              <Collapse.Panel key="1" style={{ marginBottom: '20px', border: '1px solid #6d92d1', borderRadius: '10px' }}
                showArrow={false}
                header={`Micro Finance`}
              // key={index.toString()}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">No Of Active Accounts</div>
                    <div>{summarydata?.micro_finance?.detail?.NoOfActiveAccounts || "--"}</div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Total Past Due</div>
                    <div>{summarydata?.micro_finance?.detail?.TotalPastDue || "--"}</div>
                  </Col>

                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">No Of PastDue Accounts</div>
                    <div>{summarydata?.micro_finance?.detail?.NoOfPastDueAccounts || "--"}</div>
                  </Col>
                  {/* 
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <div>Recent Account</div>
                <div>{summarydata?.micro_finance?.detail?.RecentAccount || "--"}</div>
              </Col> */}
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Total Balance Amount</div>
                    <div>{summarydata?.micro_finance?.detail?.TotalBalanceAmount || "--"}</div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Total Monthly Payment Amount</div>
                    <div>{summarydata?.micro_finance?.detail?.TotalMonthlyPaymentAmount || "--"}</div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Total Written Off Amount</div>
                    <div>{summarydata?.micro_finance?.detail?.TotalWrittenOffAmount || "--"}</div>
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>

            <Collapse
              // expandIconPosition={'end'}
              defaultActiveKey={['1']}
              className="existing-collapse"
              onChange={onChange1}
              size="small"
              bordered={false}
            >
              <Collapse.Panel key="1" style={{ marginBottom: '20px', border: '1px solid #6d92d1', borderRadius: '10px' }}
                showArrow={false}
                header={`Retails`}
              // key={index.toString()}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">No Of Accounts</div>
                    <div>{summarydata?.retail?.detail?.NoOfAccounts || "--"}</div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">No Of Active Accounts</div>
                    <div>{summarydata?.retail?.detail?.NoOfActiveAccounts || "--"}</div>
                  </Col>

                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Total PastDue</div>
                    <div>{summarydata?.retail?.detail?.TotalPastDue || "--"}</div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">No Of PastDue Accounts</div>
                    <div>{summarydata?.retail?.detail?.NoOfPastDueAccounts || "--"}</div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Total Balance Amount</div>
                    <div>{summarydata?.retail?.detail?.TotalBalanceAmount || "--"}</div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Total Sanction Amount</div>
                    <div>{summarydata?.retail?.detail?.TotalSanctionAmount || "--"}</div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Total Credit Limit</div>
                    <div>{summarydata?.retail?.detail?.TotalCreditLimit || "--"}</div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="title-existing-retail">Total Monthly Payment Amount</div>
                    <div>{summarydata?.retail?.detail?.TotalMonthlyPaymentAmount || "--"}</div>
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>
          </>}

        {showExistingData && (
          <Collapse
            onChange={onChange}
            size="small"
            bordered={false}
          >
            {
              fieldConfigs.map((item, index) => {
                return (
                  <Collapse.Panel style={{ marginBottom: '20px', border: '1px solid #6d92d1', borderRadius: '10px' }}
                    showArrow={false}
                    header={`Existing Merchant Details - ${item?.existingBankName} `}
                    // key={index.toString()}
                    extra={genExistingExtra(activeIndex === index)}
                  >
                    <Row gutter={16}>
                      <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Form.Item
                          // name="existingBankName"
                          label="Bank Name/Financial Institution"
                          rules={[
                            {
                              required: false,
                              message: "Please Enter Bank Name/Financial Institution",
                            },
                          ]}
                        >
                          <Input
                            type="text"
                            size="large"
                            placeholder="Enter Bank Name"
                            value={item?.existingBankName}
                            // onChange={(e) =>
                            //   handleChange("existingBankName", e.target.value, index)
                            // }
                            disabled={true}

                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Form.Item
                          // name={`existingNumberOfFacility.${index}`}
                          label="Nature of Facility"
                          rules={[
                            {
                              required: false,
                              message: "Please Enter Nature of Facility",
                            },
                          ]}
                        >
                          <Select
                            size="large"
                            value={item?.existingNumberOfFacility}
                            onChange={(value, label) =>
                              handleChange(`existingNumberOfFacility.${index}`, value, index, label)
                            }
                            options={natureOfFacilityType}
                            placeholder="Select Nature of Facility"
                            disabled={true}
                          >
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Form.Item
                          // name={`existingSanctionedamount.${index}`}
                          label="Sanctioned Amount"
                          rules={[
                            {
                              required: false,
                              message: "Please Enter Sanctioned Amount",
                            },
                          ]}
                        >
                          <InputNumber
                            controls={false}
                            style={{ width: "100%" }}
                            size="large"
                            placeholder="Enter Sanctioned Amount"
                            value={item?.existingSanctionedamount}
                            disabled={true}
                            formatter={(value) =>
                              `${value}`.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          // onChange={(value) =>
                          //   handleChange(`existingSanctionedamount.${index}`, value, index)
                          // }
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Form.Item
                          // name={`existingPresentOutstanding.${index}`}
                          label="Present Outstanding"
                          rules={[
                            {
                              required: false,
                              message: "Please Enter Present Outstanding",
                            },
                          ]}
                        >
                          <InputNumber
                            controls={false}
                            style={{ width: "100%" }}
                            size="large"
                            placeholder="Enter Present Outstanding"
                            value={item?.existingPresentOutstanding}
                            disabled={true}
                            formatter={(value) =>
                              `${value}`.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          // onChange={(value) =>
                          //   handleChange(
                          //     `existingPresentOutstanding.${index}`,
                          //     value,
                          //     index
                          //   )
                          // }
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Form.Item
                          // name={`existingSecurityOffered.${index}`}
                          label="Security Offered"
                          rules={[
                            {
                              required: false,
                              message: "Please Enter Security Offered",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select"
                            size="large"
                            value={item?.existingSecurityOffered}
                            disabled={true}
                            options={securityType}
                            onChange={(value, label) =>
                              handleChange(`existingSecurityOffered.${index}`, value, index, label)
                            }
                          >
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Form.Item
                          // name={`existingActivemonthlyemi.${index}`}
                          label="Active Monthly EMI"
                          rules={[
                            {
                              required: false,
                              message: "Please Enter Active Monthly EMI",
                            },
                          ]}
                        >
                          <InputNumber
                            controls={false}
                            style={{ width: "100%" }}
                            placeholder="Enter Active Monthly EMI"
                            size="large"
                            value={item?.existingActivemonthlyemi}
                            disabled={true}
                            formatter={(value) =>
                              `${value}`.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          // onChange={(value) =>
                          //   handleChange(`existingActivemonthlyemi.${index}`, value, index)
                          // }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Collapse.Panel>
                );
              })}
          </Collapse>
        )}

        <div className="pt-3 d-flex justify-content-between">
          <div style={{ marginBottom: 20 }} className="permanentaddress">
            Existing Merchant Details
          </div>
          {/* <div className="locatemap">Locate on Map</div> */}
        </div>

        <Collapse
          style={{ border: "1px solid #6d92d1" }}
          onChange={onChange}
          size="small"
        >
          {[...Array(numPanels)].map((_, index) => (
            <Panel
              showArrow={false}
              header={`Existing Merchant Details ${index + 1}`}
              key={index.toString()}
              extra={genExtra(activeIndex === index)}
            >
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name={`bankName.${index}`}
                    label="Bank Name/Financial Institution"
                    rules={[
                      {
                        required: false,
                        message: "Please Enter Bank Name/Financial Institution",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      size="large"
                      placeholder="Enter Bank Name"
                      value={existingLoanDetails[index]?.bankName}
                      onChange={(e) =>
                        handleChange(`bankName.${index}`, e.target.value, index)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name={`numberOfFacility.${index}`}
                    label="Nature of Facility"
                    rules={[
                      {
                        required: false,
                        message: "Please Enter Nature of Facility",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      value={existingLoanDetails[index]?.numberOfFacility}
                      onChange={(value, label) =>
                        handleChange(`numberOfFacility.${index}`, value, index, label)
                      }
                      placeholder="Select Nature of Facility"
                      options={natureOfFacilityType}
                    >
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name={`sanctionedamount.${index}`}
                    label="Sanctioned Amount"
                    rules={[
                      {
                        required: false,
                        message: "Please Enter Sanctioned Amount",
                      },
                    ]}
                  >
                    <InputNumber
                      controls={false}
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="Enter Sanctioned Amount"
                      value={existingLoanDetails[index]?.sanctionedamount}
                      formatter={(value) =>
                        `${value}`.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      onChange={(value) =>
                        handleChange(`sanctionedamount.${index}`, value, index)
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name={`presentoutstanding.${index}`}
                    label="Present Outstanding"
                    rules={[
                      {
                        required: false,
                        message: "Please Enter Present Outstanding",
                      },
                    ]}
                  >
                    <InputNumber
                      controls={false}
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="Enter Present Outstanding"
                      value={existingLoanDetails[index]?.presentoutstanding}
                      formatter={(value) =>
                        `${value}`.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      onChange={(value) =>
                        handleChange(
                          `presentoutstanding.${index}`,
                          value,
                          index
                        )
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name={`securityoffered.${index}`}
                    label="Security Offered"
                    rules={[
                      {
                        required: false,
                        message: "Please Enter Security Offered",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select"
                      size="large"
                      value={existingLoanDetails[index]?.securityoffered}
                      onChange={(value, label) =>
                        handleChange(`securityoffered.${index}`, value, index, label)
                      }
                      options={securityType}
                    >
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name={`activemonthlyemi.${index}`}
                    label="Active Monthly EMI"
                    rules={[
                      {
                        required: false,
                        message: "Please Enter Active Monthly EMI",
                      },
                    ]}
                  >
                    <InputNumber
                      controls={false}
                      style={{ width: "100%" }}
                      placeholder="Enter Active Monthly EMI"
                      size="large"
                      value={existingLoanDetails[index]?.activemonthlyemi}
                      formatter={(value) =>
                        `${value}`.replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      onChange={(value) =>
                        handleChange(`activemonthlyemi.${index}`, value, index)
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
          ))}
        </Collapse>
        <div style={{ display: "flex", justifyContent: "center", margin: 30 }}>
          <Button
            style={{ border: "1px solid #003399", color: "#003399" }}
            onClick={addPanel}
          >
            + Add Existing Merchant Details
          </Button>
        </div>
      </Form>

      <Modal
        width={600}
        title="CIBIL Consent"
        open={openCibilModal}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row
          gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}
          className="otpcibilwrapper"
        >
          {onSendOtp ? (
            <Form layout="vertical">
              <Row
                gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}
                className="otpcibilwrapper"
              >
                <Col xs={14} sm={14} md={12} lg={24} xl={24}>
                  An OTP has been sent to the customer’s PAN-linked mobile
                  number.
                </Col>
                <Col
                  xs={14}
                  sm={14}
                  md={12}
                  lg={24}
                  xl={24}
                  className="cibilotp"
                >
                  <Form.Item label="Enter OTP" name="otp">
                    <InputOTP
                      autoFocus
                      inputType="numeric"
                      length={6}
                      className="center-input-message"
                    />
                  </Form.Item>
                  <div className="d-flex justify-content-between">
                    <div className="sixdigitotp">
                      Please enter 6 digit OTP sent on +91 XXXXXXXX34
                    </div>
                    <div className="resendText">RESEND</div>
                  </div>
                </Col>
              </Row>
            </Form>
          ) : (
            <>
              <Col xs={14} sm={14} md={24} lg={24} xl={24}>
                To fetch the customer's CIBIL report, click the "Send OTP"
                button below.
              </Col>
              <Col xs={12} sm={12} md={24} lg={24} xl={24}>
                For capturing the customer’s consent, we will send an OTP to the
                mobile number linked to the customer's PAN.
              </Col>
            </>
          )}
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
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
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              style={{
                backgroundColor: "#003399",
                color: "#fff",
                border: "1px solid #003399",
                boxShadow: "0px 2px 12px 0px #00339952",
                width: "118px",
                height: "42px",
                padding: "10px 22px 10px 22px",
                borderRadius: "8px",
                marginLeft: "10px",
                marginRight: "10px",
              }}
              onClick={sendOtp}
            >
              {onSendOtp ? "Verify" : "Send OTP"}
            </Button>
          </div>
        </Row>
      </Modal>
    </>
  );
};

export default ExistingLoanDetails;
