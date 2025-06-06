import { Button, Col, Form, Input, Progress, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import UploadComponent from "./UploadComponent";
import { useSelector } from "react-redux";
import axiosRequest from "../../axios-request/API.request.js";

const DOC_KEY = {
  passbook: "passbook",
  bankStatement: "bankStatement",
};
const BankDetails = ({ form, bankDetails, setBankDetails, id, document }) => {

  const [bankDocumentsDropdown, setBankDocumentsDropdown] = useState([])
  const [emandateOption, setEmandateOption] = useState("")
  console.log(emandateOption, "akshaysriram")
  const storedata = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?.bankDetails
  );
  const bankDocuments = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data?.document
  );
  const [documentsBankData, setDocumentsBankData] = useState(bankDocuments);

  const bankData = useSelector(
    (state) =>
      state?.applicantDoc?.bankDocumentAddress?.data?.data?.resp?.result
  );

  console.log(bankData, "akshay")

  const handleChange = (field, value, label) => {
    console.log(field, "filed in onchange");
    if (field === "bankdocuments") {
      setBankDetails({ ...bankDetails, [field]: label });
    } else {
      setBankDetails({ ...bankDetails, [field]: value });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      bankdocuments: storedata?.bankDocName,
      ifsccode: storedata?.ifscCode,
      accountnumber: storedata?.accountNumber,
      accountholdername: storedata?.accountHolderName,
      branchname: storedata?.branchName,
      micrcode: storedata?.micrCode,
      bankname: storedata?.bankName,
      accounttype: storedata?.accountType,
      noofyearrelationshipwithbank: storedata?.noOfYrsOfRelationWithBank,
      repaymentPreference: storedata?.repaymentPreference
    });
    setBankDetails({
      ...bankDetails,
      bankdocuments: storedata?.bankDocName,
      ifsccode: storedata?.ifscCode,
      accountnumber: storedata?.accountNumber,
      accountholdername: storedata?.accountHolderName,
      branchname: storedata?.branchName,
      micrcode: storedata?.micrCode,
      bankname: storedata?.bankName,
      accounttype: storedata?.accountType,
      noofyearrelationshipwithbank: storedata?.noOfYrsOfRelationWithBank,
      repaymentPreference: storedata?.repaymentPreference
    });
  }, []);

  useEffect(() => {
    if (bankDetails?.bankdocuments?.value === "cancelCheque") {
      form.setFieldsValue({
        ifsccode: bankData?.ifsc || "",
        accountnumber: bankData?.accNo || "",
        accountholdername: bankData?.name?.[0] || "",
        branchname: bankData?.bankDetails?.branch || "",
        micrcode: bankData?.micr || "",
        bankname: bankData?.bank || "",
      });
      setBankDetails({
        ...bankDetails,
        ifsccode: bankData?.ifsc || "",
        accountnumber: bankData?.accNo || "",
        accountholdername: bankData?.name?.[0] || "",
        branchname: bankData?.bankDetails?.branch || "",
        micrcode: bankData?.micr || "",
        bankname: bankData?.bank || "",
      });
    }
  }, [bankData, documentsBankData])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosRequest.get('master/dropdown/find_all?type=bankDocument');
        const PurposeTypes = response?.data?.data?.bankDocument.map(item => ({
          label: item.label,
          value: item.value
        }));
        setBankDocumentsDropdown(PurposeTypes || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const checkEmandate = async () => {
    const form = {
      "proposalId": id,
      "BankAc": bankDetails?.accountnumber,
      "IFSC": bankDetails?.ifsccode,
      "CustomerName": bankDetails?.accountholdername
    }
    try {
      const response = await axiosRequest.post('service/enach/validateBankEnach', form);
      setEmandateOption(response?.data?.data?.resp)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

 

  return (
    <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="col-wrapper">
        <div className="loandetailstitle">6- Bank Details</div>
        <div className="applicant-documents">
          <div className="currentprogress">Current Progress</div>
          <div className="progress-container">
            <Progress percent={80} strokeColor="#003399" />
          </div>
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="loandetail">
        <Form autoComplete="off" layout="vertical" form={form}>
          <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>

            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="bankdocuments"
                label="Bank Documents"
                rules={[
                  {
                    required: true,
                    message: "Please Select the Bank Documents",
                  },
                ]}
              >
                <Select
                  size="large"
                  placeholder="Select Bank Documents"
                  value={bankDetails?.bankdocuments}
                  options={bankDocumentsDropdown}
                  onChange={(value, label) => handleChange("bankdocuments", value, label)}
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
              <div>
                {" "}
                <UploadComponent
                  document={document}
                  label="Document"
                  showLabel={false}
                  name={bankDetails?.bankdocuments?.value}
                  value={bankDetails?.bankdocuments?.value}
                  docType={bankDetails?.bankdocuments?.value}
                  id={id}
                  type="proposal"
                  section="bank"
                  side="front"
                  uploadedFile={documentsBankData}
                />
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}></Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="ifsccode"
                label="IFSC Code"
                rules={[
                  {
                    required: true,
                    message: "Please Enter IFSC Code",
                  },
                  {
                    pattern: /^[A-Z]{4}[0][A-Z0-9]{6}$/,
                    message: 'Please enter a valid IFSC code',
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Enter IFSC Code"
                  size="large"
                  value={bankDetails?.ifsccode}
                  onChange={(e) => handleChange("ifsccode", e.target.value)}
                  onInput={e => e.target.value = e.target.value.toUpperCase()}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="accountnumber"
                label="Account Number"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Account Number",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: 'Please enter a valid account number (only digits allowed)',
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Enter Account Number"
                  size="large"
                  value={bankDetails?.accountnumber}
                  onChange={(e) =>
                    handleChange("accountnumber", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="accountholdername"
                label="Account Holder Name"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Account Holder Name",
                  },
                  {
                    pattern: '^[A-Za-z]+(?:\\s[A-Za-z]+)*$',
                    message: 'Please Enter Account Holder Name',
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Enter Account Holder Name"
                  size="large"
                  value={bankDetails?.accountholdername}
                  onChange={(e) =>
                    handleChange("accountholdername", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="branchname"
                label="Branch Name"
                rules={[
                  {
                    required: true,
                    message: "Please Select the Branch Name",
                  },
                  {
                    pattern: /^[A-Za-z\s]+$/,
                    message: 'Please enter only alphabets for the Branch Name',
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Enter Branch Name"
                  size="large"
                  value={bankDetails?.branchname}
                  onChange={(e) => handleChange("branchname", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="micrcode"
                label="MICR Code"
                rules={[
                  {
                    required: true,
                    message: "Please Enter MICR Code",
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: 'Please enter a valid account number (only digits allowed)',
                  },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Enter MICR Code"
                  size="large"
                  value={bankDetails?.micrcode}
                  onChange={(e) => handleChange("micrcode", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="bankname"
                label="Bank Name"
                rules={[
                  {
                    required: false,
                    message: "Please Select the Bank Name",
                  },
                ]}
              >
                <Select
                  placeholder="Select Bank Name"
                  size="large"
                  value={bankDetails?.bankname}
                  onChange={(value) => handleChange("bankname", value)}
                >
                  <option value="State Bank of India">
                    State Bank of India
                  </option>
                  <option value="Union Bank">Union Bank</option>
                  <option value="ICICI">ICICI</option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="accounttype"
                label="Account Type"
                rules={[
                  {
                    required: true,
                    message: "Please Select Account Type",
                  },
                ]}
              >
                <Select
                  placeholder="Select Account Type"
                  size="large"
                  value={bankDetails?.accounttype}
                  onChange={(value) => handleChange("accounttype", value)}
                >
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="noofyearrelationshipwithbank"
                label="No of years of relationship with bank"
                rules={[
                  {
                    required: true,
                    message: "Please Enter the Year of Relationship With Bank",
                  },
                ]}
              >
                <Input
                  // type="number"
                  placeholder="Enter No Of Years"
                  size="large"
                  value={bankDetails?.noofyearrelationshipwithbank}
                  onChange={(e) =>
                    handleChange("noofyearrelationshipwithbank", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
              <Form.Item
                name="repaymentPreference"
                label="Repayment Preference"
                rules={[
                  {
                    required: true,
                    message: "Please Select Repayment Preference",
                  },
                ]}
              >
                <Select
                  placeholder="Select Repayment Preference"
                  size="large"
                  value={bankDetails?.repaymentPreference}
                  onChange={(value) => handleChange("repaymentPreference", value)}
                >
                  <option value="auto-debit">Auto Debit</option>
                  <option value="offline">Offline</option>
                </Select>
              </Form.Item>
            </Col>

            {bankDetails?.repaymentPreference === "auto-debit" ? <>
              <Col style={{
                display: "flex",
                alignItems: "center"
              }} xs={24} sm={24} md={12} lg={8} xl={8}>
                <Button onClick={checkEmandate} style={{ backgroundColor: "#003399", color: "white" }}>Check mandate availability with Bank</Button>
              </Col>

              {emandateOption !== "" ? <>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name="emandate"
                    label="E-Mandate"
                    rules={[
                      {
                        required: true,
                        message: "Please Select E-Mandate",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select E-Mandate"
                      size="large"
                      value={bankDetails?.eMandate}
                      onChange={(value) => handleChange("eMandate", value)}
                    >
                      {emandateOption?.AdLive === "1" ? <option value="aadhar-mandate"><div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}><div style={{ fontWeight: 300, color: "darkgray" }}>VIA</div><div>Aadhar Mandate</div></div></option> : ""}
                      {emandateOption?.DCLive === "1" ? <option value="e-mandate-net"><div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}><div style={{ fontWeight: 300, color: "darkgray" }}>VIA</div><div>E-Mandate (debit card)</div></div></option> : ""}
                      {emandateOption?.NBLive === "1" ? <option value="e-mandate-debit"><div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}><div style={{ fontWeight: 300, color: "darkgray" }}>VIA</div><div>E-Mandate (Net banking)</div></div></option> : ""}
                      <option value="e-mandate-physical"><div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}><div style={{ fontWeight: 300, color: "darkgray" }}>VIA</div><div>E-Mandate (Physical)</div></div></option>
                    </Select>
                  </Form.Item>
                </Col>
              </> : ""}
            </> : ""
            }
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default BankDetails;
