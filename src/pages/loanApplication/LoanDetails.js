import {
  Col,
  Form,
  Input,
  Progress,
  Radio,
  Row,
  Select,
  InputNumber,
} from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { resetEntityDocumentData } from "../../state/slices/entityDocuments";

const LoanDetails = ({ form }) => {
  const dispatch = useDispatch();
  const store = useSelector(
    (state) => state?.fetchProposal?.proposal?.data?.data
  );
  const [othersField, setOthersField] = useState(false);

  const formatNumberWithCommas = (value) => {
    if (value == null) return ""; // Handle undefined or null values
    const number = Number(value); // Convert value to a number
    if (isNaN(number)) return ""; // Check if value is not a valid number
    const formattedNumber = number.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    }); // Format number with commas
    return `₹ ${formattedNumber}`;
  };

  useEffect(() => {
    const formatString = (str) => {
      return str.replace(/([A-Z])/g, ' $1')
        .replace(/^./, function (str) { return str.toUpperCase(); });
    }

    const formattedPurpose = store?.loanDetails?.purpose ? formatString(store?.loanDetails?.purpose?.value) : ""; form.setFieldsValue({
      loanamount: formatNumberWithCommas(store?.loanDetails?.amount),
      tenure: store?.loanDetails?.tenure,
      purposeofloan: formattedPurpose,
      others: store?.loanDetails?.otherPurpose,
    });
  }, [store]);

  const onChangeLoan = (value) => {
    console.log("changed", value);
  };

  const purposeLoan = (value) => {
    console.log(value, "akshay");
    if (value === "Others") {
      setOthersField(true);
    } else {
      setOthersField(false);
    }
  };
  
  useEffect(() =>{
    dispatch(resetEntityDocumentData());
  },[])

  return (
    <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="col-wrapper">
        <div className="loandetailstitle">1 - Merchant Details</div>
        <div className="applicant-documents">
          <div className="currentprogress">Current Progress</div>
          <div className="progress-container">
            <Progress percent={10} strokeColor="#68BA7F" />
          </div>
        </div>
      </Col>

      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="loandetail">
        <div className="loantitle">Merchant Details</div>
        <div className="d-flex flex-column">
          <div className="typeloan mb-3">Application for</div>
          <Radio.Group
            value={store?.loanDetails?.applicationType?.value}
            className="pb-3 "
          >
            <Radio value="entity">Entity</Radio>
            <Radio value="individual">Individual</Radio>
          </Radio.Group>
          <div className="typeloan mb-3">Type of Loan</div>
          {store?.loanDetails?.applicationType?.value === "entity" && (
            <Radio.Group value={store?.loanDetails?.loanType?.value} className="pb-3">
              <Radio value="sme">SME Loan</Radio>
              <Radio value="term">Term Loan</Radio>
            </Radio.Group>
          )}
          <Form form={form} autoComplete="off" layout="vertical">
            <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item
                  name="loanamount"
                  label="Loan Amount Required"
                >
                  <InputNumber
                   controls={false}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Enter Loan Amount"
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item
                  name="tenure"
                  label="Tenure of Loan"
                  initialValue={store?.loanDetails?.tenure}
                >
                  <Select size="large" placeholder="Select" disabled>
                    <Select.Option value={1}>12 months</Select.Option>
                    <Select.Option value={2}>24 months</Select.Option>
                    <Select.Option value={3}>36 months</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <Form.Item
                  name="purposeofloan"
                  label="Purpose Of Loan"
                  initialValue={store?.loanDetails?.purpose}
 
                >
                  {store?.loanDetails?.loanType?.value === "individual" ? (
                    <>
                      <Select
                        onChange={purposeLoan}
                        size="large"
                        placeholder="Select"
                        disabled
                      >
                        <Select.Option value="Education">
                          Education
                        </Select.Option>
                        <Select.Option value="Marriage">Marriage</Select.Option>
                        <Select.Option value="Travel">Travel</Select.Option>
                        <Select.Option value="Renovation">
                          Renovation
                        </Select.Option>
                        <Select.Option value="Medical Reason">
                          Medical Reason
                        </Select.Option>
                        <Select.Option value="Others">Others</Select.Option>
                      </Select>
                    </>
                  ) : (
                    <>
                      <Select
                        onChange={purposeLoan}
                        size="large"
                        placeholder="Select"
                        disabled
                      >
                        <Select.Option value="Purchase Stock">
                          Purchase Stock
                        </Select.Option>
                        <Select.Option value="Inventory">
                          Inventory
                        </Select.Option>
                        <Select.Option value="Machinery">
                          Machinery
                        </Select.Option>
                        <Select.Option value="payCreditors">
                          Pay Creditors
                        </Select.Option>
                        <Select.Option value="Refinancing of loan">
                          Refinancing Of Loan
                        </Select.Option>
                        <Select.Option value="Business Expension">
                          Business Expension
                        </Select.Option>
                        <Select.Option value="Others">Others</Select.Option>
                      </Select>
                    </>
                  )}
                </Form.Item>
              </Col>

              {store?.loanDetails?.purpose === "others" ? (
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    name="others"
                    label="Others"
                  >
                    <Input size="large" placeholder="" disabled />
                  </Form.Item>
                </Col>
              ) : (
                ""
              )}
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="emidetails"
              >
                EMI Details
              </Col>
              <Col xs={12} sm={12} md={12} lg={6} xl={6} className="data">
                <div className="number">
                  {formatNumberWithCommas(store?.EMIDetails?.amount)}
                </div>
                <div className="emititle"> EMI amount </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={6} xl={6} className="data">
                <div className="number">
                  {formatNumberWithCommas(store?.EMIDetails?.processingFees)}
                </div>
                <div className="emititle"> Processing Fees </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={6} xl={6} className="data">
                <div className="number">{`${store?.EMIDetails?.rateOfInterest} % `}</div>
                <div className="emititle"> Rate of Interest (%) </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={6} xl={6} className="data">
                <div className="number">
                  {" "}
                  {store?.EMIDetails?.otherCharges === 0
                    ? "NIL"
                    : formatNumberWithCommas(store?.EMIDetails?.otherCharges)}{" "}
                </div>
                <div className="emititle"> Any Other Charges </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default LoanDetails;
