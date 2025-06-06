import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Form, Input, Row, Col, Card, Button, Select, DatePicker, Checkbox, Upload, message, Steps,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { Step } = Steps;

const steps = [
  { title: 'Applicant Details' },
  { title: 'Business Details' },
  { title: 'Loan Requirements' },
];

function ApplicationForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const lead = location.state?.lead;
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    message.success('Application updated successfully!');
    navigate('/dashboard/leads');
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  if (!lead) {
    return <div style={{ padding: 32 }}>No lead data found.</div>;
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <h3 style={{ marginBottom: 24 }}>Basic Details</h3>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="KYC Verification Document" name="kycDocument">
                  <Select placeholder="Select KYC document">
                    <Option value="pan">PAN Card</Option>
                    <Option value="aadhaar">Aadhaar Card</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="PAN Card" name="panCard">
                  <Upload>
                    <Button icon={<UploadOutlined />}>Upload PAN Card</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="PAN Number" name="panNumber" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Applicant's Full Name" name="fullName" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Applicant's Mobile Number" name="mobile" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Applicant's Email ID" name="email" rules={[{ required: true, type: 'email' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Date of Birth" name="dob" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
                  <Select placeholder="Select Gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <h3 style={{ margin: '24px 0' }}>Permanent Address Details</h3>
            <Row gutter={24}>
              <Col span={16}>
                <Form.Item label="Permanent Address Line 1" name={['permanentAddress', 'line1']} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Landmark" name={['permanentAddress', 'landmark']}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item label="Permanent Address Line 2" name={['permanentAddress', 'line2']}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="City/Town/Village" name={['permanentAddress', 'city']} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="State" name={['permanentAddress', 'state']} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Country" name={['permanentAddress', 'country']} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="PIN Code" name={['permanentAddress', 'pincode']} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="sameAsPermanent" valuePropName="checked">
              <Checkbox>Current address is same as Permanent address</Checkbox>
            </Form.Item>
            <h3 style={{ margin: '24px 0' }}>Current Address Details</h3>
            {/* Similar fields for current address */}
          </>
        );
      // Add cases for other steps here
      default:
        return 'Unknown step';
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto' }}>
      <Card bordered={false}>
        <Steps current={currentStep} style={{ marginBottom: 40 }}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ ...lead, dob: lead.dob ? moment(lead.dob) : null }}
        >
          {renderStepContent(currentStep)}
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            {currentStep > 0 && (
              <Button style={{ marginRight: 8 }} onClick={prevStep}>
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={nextStep}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" htmlType="submit">
                Save & Proceed
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default ApplicationForm; 