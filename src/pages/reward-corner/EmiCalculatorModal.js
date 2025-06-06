import React, { useState } from "react";
import { Modal, Form, Row, Col, Button, Input, message,Select } from "antd";
import { PieChart } from '@mui/x-charts/PieChart';
import "../loanApplication/LoanApplication.css";
import axiosRequest from "../../axios-request/API.request";
import "./ApplicationListing.css"

const EmiCalculatorModal = ({
  form,
  resetFunction,
  isVisible,
  onCancel,
  contentTrue,
  setContentTrue,
  resetModalVisible,
}) => {

  const [data, setData] = useState({})
  const [tenure,setTenure] = useState([
    {
      label: "3 Month",
      value: "3"
    },
    {
      label: "6 Month",
      value: "6"
    },
    {
      label: "12 Month",
      value: "12"
    },
    {
      label: "18 Month",
      value: "18"
    },
    {
      label: "24 Month",
      value: "24"
    },
  ])


  const calculateEmi = () => {
    form
      .validateFields()
      .then((formValues) => {
        const { loanamount, tenure, purposeofloan } = formValues;
        const payload = {
          loanAmount: parseFloat(loanamount),
          tenure: parseInt(tenure),
          interest: parseFloat(purposeofloan),
        };
        axiosRequest
          .post(`proposal/calculate-emi`, payload)
          .then((response) => {
            if (response.resCode === -1) {
              setContentTrue(false);
              setData(response?.data?.data);
            }
            else {
              //message.error(response?.data?.msg)
              setContentTrue(true);
            }
          })
          .catch((error) => {
            console.error("Error fetching activity/event data:", error);
          });
      })
      .catch((error) => {
        console.error("Form validation error:", error);
      });
  };

  return (
    <Modal
      width={600}
      title="EMI Calculator"
      visible={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      {contentTrue ?
        <>
          <Form form={form} layout="vertical" onFinish={calculateEmi}>
            <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]} className="p-3">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  name="loanamount"
                  label="Loan Amount"
                  rules={[
                    {
                      required: true,
                      message: "Please enter loan amount",
                    },
                  ]}
                >
                  <Input type="text" size="large" placeholder="Enter" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  name="purposeofloan"
                  label="Interest Rate"
                  rules={[
                    {
                      max: 30,
                      required: true,
                      message: "maximum Intrest rate 30% only"
                    }
                  ]}
                >
                  <Input size="large" placeholder="Enter Interest Rate" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  name="tenure"
                  label="Tenure"
                  rules={[
                    {
                      required: true,
                      message: "Please enter tenure",
                    },
                  ]}
                >
                  <Select options={tenure} size="large" placeholder="Enter tenure" />
                </Form.Item>
              </Col>
            </Row>
            <div className="d-flex justify-content-end ">
              <Button
                style={{
                  marginRight: "10px",
                  backgroundColor: "#fff",
                  color: "#003399",
                  border: "1px solid #003399",
                  borderRadius: "8px",
                  margin: "10px",
                  width: "96px",
                  height: "42px",
                  padding: "10px 22px 10px 22px",
                  fontSize: "16px",
                  fontWeight: "600",
                  lineHeight: "22px",
                  letterSpacing: "0em",
                  textAlign: "left",
                }}
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                style={{
                  backgroundColor: "#003399",
                  color: "#fff",
                  border: "1px solid #003399",
                  boxShadow: "0px 2px 12px 0px #00339952",
                  width: "150px",
                  height: "42px",
                  margin: "10px",
                  padding: "10px 22px 10px 22px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  lineHeight: "22px",
                  letterSpacing: "0em",
                  textAlign: "left",
                }}
                htmlType="submit"
              >
                Calculate EMI
              </Button>
            </div>
          </Form>
        </>
        :
        <>
          <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]} className="p-3">
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div className="loantitle">Break-up of Total Payment</div>
              <div>
                <div className="total-value-amount">{data?.monthlyEmi}</div>
                <div className="total-value-label">Monthly EMI</div>
              </div>
              <div>
                <div className="total-value-amount">{data?.totalAmountPayable}</div>
                <div className="total-value-label">Total Amount Payable</div>
              </div>
              <div>
                <div className="total-value-amount">{data?.principalAmount}</div>
                <div className="total-value-label">Principal Amount</div>
              </div>
              <div>
                <div className="total-value-amount">{data?.totalInterestPayable}</div>
                <div className="total-value-label">Total Interest Payable</div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <PieChart
                className="piechart-emi"
                series={[
                  {
                    data: [
                      { id: 0, value: data?.principleLoanAmountPercent, color: "#003399",label:`${data?.principleLoanAmountPercent}%` },
                      { id: 1, value: data?.totalInterestPercent, color: "#1FB02F",label:`${data?.totalInterestPercent}%` },
                    ],
                    cornerRadius: 3,
                    cx: 100,
                    outerRadius: 100,
                    arcLabel: "label",
                  },
                ]}
                width={400}
                height={200}
                axisHighlight={10}
              />
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 20, marginTop: 20 }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <div style={{ backgroundColor: "#003399", width: 10, height: 10, marginRight: 5, borderRadius: 50 }} />
                  <div style={{ inlineSize: "max-content" }}>Principal Loan Amount</div>
                </div>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <div style={{ backgroundColor: "#1DA82C", width: 10, height: 10, marginRight: 5, borderRadius: 50 }} />
                  <div style={{ inlineSize: "max-content" }}>Total Interest</div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <Button
              style={{
                backgroundColor: "#fff",
                color: "#003399",
                border: "1px solid #003399",
                borderRadius: "8px",
                width: "96px",
                height: "42px",
                margin: "10px",
                padding: "10px 22px 10px 22px",
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "22px",
                letterSpacing: "0em",
                textAlign: "left",
              }}
              onClick={resetFunction}
            >
              Reset
            </Button>
            <Button
              style={{
                backgroundColor: "#003399",
                color: "#fff",
                border: "1px solid #003399",
                boxShadow: "0px 2px 12px 0px #00339952",
                width: "200px",
                margin: "10px",
                height: "42px",
                padding: "10px 22px 10px 22px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                lineHeight: "22px",
                letterSpacing: "0em",
                textAlign: "left",
              }}
              onClick={resetModalVisible}
            >
              <div>Start New Application</div>
            </Button>
          </div>
        </>}

    </Modal>
  );
};

export default EmiCalculatorModal;
