import React, { useEffect, useState } from "react";
import { Modal, Form, DatePicker, TimePicker, Input, Select, Row, Col, Radio, Button, message } from "antd";
import axiosRequest from "../axios-request/API.request"
import _ from "lodash";
import dayjs from 'dayjs';
import "./Todo/ActivityCalendar.css"

export default function CalendarEvent({ Data, setIsModalVisible, isModalVisible, click }) {
  const [form] = Form.useForm()
  const [formData, setFormData] = useState({
    purposeType: "",
    purposeSubType: "",
    mode: "",
    location: "",
    meetingLocation: "",
    duration: "",
    stackHolderType: "",
    stackHolderName: "",
    individualName: "",
    mobile: "",
    agenda: "",
    teamMembers: [
      ""
    ],
    meetingDate: "",
    meetingTime: ""
  })
  const [options, setOptions] = useState([]);

  const getCurrentTime = () => {
    return dayjs().format("HH");
  };

  useEffect(() => {
    if (click === "UPDATE EVENT") {
      const { purposeType, purposeSubType, mode, location, meetingLocation, isImp } = Data;
      form.setFieldsValue({
        purposeType,
        purposeSubType,
        mode,
        location,
        meetingLocation,
        duration: Data?.Minutes,
        stackHolderType: Data?.stackHolderType,
        stackHolderName: Data?.stackHolderName,
        individualName: Data?.individualName,
        mobile: `${Data?.stackHolderMobile}`,
        agenda: Data?.Agenda,
        teamMembers: Data?.teamMembers,
        meetingDate: dayjs(Data?.startDate, 'YYYY-MM-DD'),
        meetingTime: dayjs(Data?.time, 'HH:mm'),
        isImp
      })
      setFormData({
        ...formData,
        purposeType: Data?.purposeType,
        purposeSubType: Data?.purposeSubType,
        mode: Data?.mode,
        location: Data?.location,
        meetingLocation: Data?.meetingLocation,
        duration: Data?.Minutes,
        stackHolderType: Data?.stackHolderType,
        stackHolderName: Data?.stackHolderName,
        individualName: Data?.individualName,
        mobile: `${Data?.stackHolderMobile}`,
        agenda: Data?.Agenda,
        teamMembers: Data?.teamMembers,
        meetingDate: dayjs(Data?.startDate, 'YYYY-MM-DD'),
        meetingTime: Data?.time,
        isImp
      })
    }
  }, [click])

  const handleOk = (e) => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChangeType = (e) => {
    setFormData({ ...formData, stackHolderType: e.target.value });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosRequest.get(`user/find_all?page=1&limit=10000&project=_id%20primaryEmail`);
      const userData = response.data.data.data;
      const mappedOptions = userData.map(user => ({
        value: user._id,
        label: user.primaryEmail
      }));
      setOptions(mappedOptions);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const teamMembersData = (value) => {
    setFormData({ ...formData, teamMembers: value });
  }

  const onChangeDatePick = (date, dateString) => {
    setFormData({ ...formData, meetingDate: dateString });
  };

  const onChangeTimePick = (time, TimeString) => {
    setFormData({ ...formData, meetingTime: TimeString });
  };

  const handleForm = () => {
    console.log(formData, "akshay")
    const payload = {
      purpose: {
        purposeType: formData.purposeType,
        purposeSubType: formData.purposeSubType
      },
      mode: formData.mode,
      location: formData.location,
      meetingLocation: formData.meetingLocation,
      duration: parseInt(formData.duration),
      stackHolders: {
        holderType: formData.stackHolderType,
        entity_name: formData.stackHolderName,
        individual_name: formData.individualName,
        mobile: parseInt(formData.mobile)
      },
      agenda: formData.agenda,
      teamMembers: formData.teamMembers,
      meetingStartDate: dayjs(formData.meetingDate).format('YYYY-MM-DD'),
      meetingStartTime: formData.meetingTime
    };
    const apiConfig = click === "UPDATE EVENT" ? `activity/event/update/${Data?.id}` : `activity/event/create`;
    axiosRequest[click === "UPDATE EVENT" ? "put" : "post"](apiConfig, payload)
      .then((res) => {
        if (res.resCode === -1) {
          setIsModalVisible(false)
          form.resetFields()
          message.success(`Activity ${click === "UPDATE EVENT" ? "Updated" : "Created"} Successfully`)
        }
      })
      .catch((error) => {
        //message.error(error);
      });
  }

  const disabledDate = current => {
    return current && current < dayjs().startOf('day');
  }

  return (
    <div className="CalendarEvent-main-class">
      <Modal
        className="todo-header-style"
        title={
          <div style={{ fontWeight: '500', fontSize: '16px' }}>
            {click === 'UPDATE EVENT' ? 'Update An Event' : 'Create An Event'}
          </div>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <>
          <Form form={form} onFinish={handleForm} layout="vertical">
            <div className="">
              <Row>
                <Col xl={8} md={8} lg={8} xs={24} sm={24}>
                  <Form.Item label="Purpose" name="purposeType"
                    rules={[
                      {
                        required: true,
                        message: "Purpose field is Required"
                      }]}>
                    <Select placeholder="Please Select Purpose" onChange={(value) => setFormData({ ...formData, purposeType: value })} style={{ width: "98%" }}>
                      <Select.Option value="New Client Interaction">New Client Interaction</Select.Option>
                      <Select.Option value="Existing Client Interaction">Existing Client Interaction</Select.Option>
                      <Select.Option value="Client Application Processing">Client Application Processing</Select.Option>
                      <Select.Option value="Loan Structuring">Loan Structuring</Select.Option>
                      <Select.Option value="Loan Closing">Loan Closing</Select.Option>
                      <Select.Option value="Post-Disbursement Monitoring">Post-Disbursement Monitoring</Select.Option>
                      <Select.Option value="Networking and Business Development">Networking and Business Development</Select.Option>
                      <Select.Option value="Events / Gathering">Events / Gathering</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} lg={8} xs={24} sm={24}>
                  <Form.Item label="Purpose Subtype" name="purposeSubType" rules={[
                    {
                      required: true,
                      message: "Purpose SubType field is Required"
                    }
                  ]}>
                    <Select placeholder="Please Select Purpose SubType" onChange={(value) => setFormData({ ...formData, purposeSubType: value })} style={{ width: "98%" }}>
                      {formData?.purposeType === "New Client Interaction" ?
                        <>
                          <Select.Option value="Initial Consultations">Initial Consultations</Select.Option>
                          <Select.Option value="Explain Products">Explain Products</Select.Option>
                          <Select.Option value="Resolving Queries">Resolving Queries</Select.Option>
                        </> :
                        formData?.purposeType === "Existing Client Interaction" ?
                          <>
                            <Select.Option value="Upsell / New Products">Upsell / New Products</Select.Option>
                            <Select.Option value="Current Loan Servicing">Current Loan Servicing</Select.Option>
                            <Select.Option value="Resolving Queries">Resolving Queries</Select.Option>
                            <Select.Option value="Payment Tracking">Payment Tracking</Select.Option>
                            <Select.Option value="Customer Support">Customer Support</Select.Option>
                          </> :
                          formData?.purposeType === "Client Application Processing" ?
                            <>
                              <Select.Option value="Collect Documentation">Collect Documentation</Select.Option>
                              <Select.Option value="House visit assesment">House visit assesment</Select.Option>
                              <Select.Option value="Entity visit assesment">Entity visit assesment</Select.Option>
                              <Select.Option value="Collateral Evaluation">Collateral Evaluation</Select.Option>
                              <Select.Option value="Coordination with Underwriting">Coordination with Underwriting</Select.Option>
                              <Select.Option value="Updates to Borrowers">Updates to Borrowers</Select.Option>
                              <Select.Option value="Addressing Concerns">Addressing Concerns</Select.Option>
                            </> :
                            formData?.purposeType === "Loan Structuring" ?
                              <>
                                <Select.Option value="Loan Recommendations">Loan Recommendations</Select.Option>
                                <Select.Option value="Interest Rate Negotiation">Interest Rate Negotiation</Select.Option>
                              </> :
                              formData?.purposeType === "Loan Closing" ?
                                <>
                                  <Select.Option value="Closing Coordination">Closing Coordination</Select.Option>
                                  <Select.Option value="Explain Terms & Condition">Explain Terms & Condition</Select.Option>
                                </> :
                                formData?.purposeType === "Post-Disbursement Monitoring" ?
                                  <>
                                    <Select.Option value="Payment Tracking">Payment Tracking</Select.Option>
                                    <Select.Option value="Customer Support">Customer Support</Select.Option>
                                  </>
                                  :
                                  formData?.purposeType === "Networking and Business Development" ?
                                    <>
                                      <Select.Option value="Client Acquisition">Client Acquisition</Select.Option>
                                      <Select.Option value="Networking">Networking</Select.Option>
                                    </> :
                                    formData?.purposeType === "Events / Gathering" ?
                                      <>
                                        <Select.Option value="Products Event">Products Event</Select.Option>
                                        <Select.Option value="Training Program">Training Program</Select.Option>
                                        <Select.Option value="Cultural & Traditional Events">Cultural & Traditional Events</Select.Option>
                                      </> : ""}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} lg={8} xs={24} sm={24}>
                  <Form.Item label="Mode of Meeting" name="mode" rules={[
                    {
                      required: true,
                      message: "Mode of Meeting field is Required"
                    }]}>
                    <Select placeholder="Please Select Mode of Meeting" onChange={(value) => setFormData({ ...formData, mode: value })} style={{ width: "98%" }}>
                      <Select.Option value="In-Person Meeting">In-Person Meeting</Select.Option>
                      <Select.Option value="Phone Call">Phone Call</Select.Option>
                      <Select.Option value="Video Call">Video Call</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} lg={8} xs={24} sm={24}>
                  <Form.Item label="Location" name="location" rules={[
                    {
                      required: true,
                      message: "Location Field is Required"
                    }]}>
                    <Select placeholder="Please Select Location" onChange={(value) => setFormData({ ...formData, location: value })} style={{ width: "98%" }} >
                      <Select.Option value="Borrower's Business Premise">Borrower's Business Premise</Select.Option>
                      <Select.Option value="Borrower's Residence">Borrower's Residence</Select.Option>
                      <Select.Option value="Branch Visit">Branch Visit</Select.Option>
                      <Select.Option value="Conference/ Event">Conference/ Event</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} lg={8} xs={24} sm={24}>
                  <Form.Item label="Meeting Location" name="meetingLocation" rules={[{
                    required: true,
                    message: "Meeting Location Field is Required"
                  }]}>
                    <Input placeholder="Please Enter Meeting Location" onChange={(e) => setFormData({ ...formData, meetingLocation: e.target.value })} style={{ width: "98%" }} />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} lg={8} xs={24} sm={24}>
                  <Form.Item label="Duration" name="duration" rules={[{
                    required: true,
                    message: "Duration Field is Required"
                  }]}>
                    <Input placeholder="Please Enter Duration" onChange={(e) => setFormData({ ...formData, duration: e.target.value })} style={{ width: "98%" }} />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} lg={8} xs={24} sm={24}>
                  <Form.Item
                    name="stackHolderType"
                    label="Stake Holder Type"
                    rules={[
                      {
                        required: true,
                        message: "Please Select Stake Holder Type",
                      }
                    ]}>
                    <Radio.Group defaultValue="individual" onChange={onChangeType}>
                      <Radio value="individual">Individual</Radio>
                      <Radio value="entity">Entity</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                  <Form.Item
                    name="stackHolderName"
                    label="Stake Holder Name"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Stake Holder Name",
                      },
                      {
                        message: "only Alphabets are allowed",
                        pattern: new RegExp(/^[a-zA-Z][a-zA-Z ]*$/),
                      },
                    ]}>
                    <Input placeholder="Please Enter Stakeholder Name" onChange={(e) => setFormData({ ...formData, stackHolderName: e.target.value })} style={{ width: "98%" }}>
                    </Input>
                  </Form.Item>
                </Col>
                <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                  <Form.Item
                    name="individualName"
                    label={formData?.stackHolderType === "entity" ? <div>Entity Name</div> : <div>Individual Name</div>}
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Name",
                      },
                      {
                        message: "only Alphabets are allowed",
                        pattern: new RegExp(/^[a-zA-Z][a-zA-Z ]*$/),
                      },
                    ]}>
                    <Input placeholder="Please Enter Name" onChange={(e) => setFormData({ ...formData, individualName: e.target.value })} style={{ width: "98%" }}>
                    </Input>
                  </Form.Item>
                </Col>
                <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                  <Form.Item
                    name="mobile"
                    label="Mobile Number"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter Mobile Number",
                      },
                      {
                        len: 10,
                        message: "Mobile Number must be 10 digits",
                      },
                      {
                        message: "only Numbers are allowed",
                        pattern: new RegExp(/^[0-9]*$/),
                      }]}>
                    <Input style={{ width: "98%" }} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} maxLength={10} placeholder="Please Enter Stake Holder Mobile Number">
                    </Input>
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} lg={8} xs={24} sm={24}>
                  <Form.Item label="Agenda" name="agenda" rules={[{
                    required: true,
                    message: "Agenda field is Required"
                  }]}>
                    <Input placeholder="Please Enter Agenda" onChange={(e) => setFormData({ ...formData, agenda: e.target.value })} style={{ width: "98%" }} />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} lg={8} xs={24} sm={24}>
                  <Form.Item label="Meeting Date" name="meetingDate" rules={[{
                    required: true,
                    message: "Meeting Date field is Required"
                  }]}>
                    <DatePicker
                      disabledDate={disabledDate}
                      placeholder="Please Select Date" onChange={(date, dateString) => onChangeDatePick(date, dateString)} style={{ width: "98%" }} />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} lg={8} xs={24} sm={24}>
                  <Form.Item label="Meeting Time" name="meetingTime" rules={[{
                    required: true,
                    message: "Meeting Time field is Required"
                  }]}>
                    <TimePicker
                      disabledHours={() => {
                        if (formData.meetingDate && dayjs(formData.meetingDate).isBefore(dayjs(), 'day')) {
                          return Array.from({ length: 24 }, (_, i) => i);
                        } else {
                          return Array.from({ length: 24 }, (_, i) => i).slice(0, parseInt(getCurrentTime(), 10));
                        }
                      }}
                      disabledMinutes={(selectedHour) => {
                        if (formData.meetingDate && dayjs(formData.meetingDate).isBefore(dayjs(), 'day')) {
                          return Array.from({ length: 60 }, (_, i) => i);
                        } else if (formData.meetingDate === dayjs().format("YYYY-MM-DD") && selectedHour === parseInt(getCurrentTime(), 10)) {
                          return Array.from({ length: 60 }, (_, i) => i).slice(0, dayjs().minute());
                        }
                        return [];
                      }}
                      placeholder="Please Select Time" format="HH:mm" onChange={(time, TimeString) => onChangeTimePick(time, TimeString)} style={{ width: "98%" }} />
                  </Form.Item>
                </Col>
                <Col xl={8} md={8} lg={8} xs={24} sm={24}>
                  <Form.Item label="Team Members" name="teamMembers" rules={[{
                    required: true,
                    message: "Team Member field is Required"
                  }]}>
                    <Select mode="multiple" placeholder="Please Select Team Member" onChange={teamMembersData} style={{ width: "98%" }}>
                      {options.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ display: "flex", marginTop: "20px", justifyContent: "flex-end", marginBottom: "10px" }}>
                <div style={{ width: "50%", display: "flex", flexDirection: "row" }}>
                  <Button
                    onClick={() => handleCancel()}
                    style={{ width: "50%", color: "#003399", marginRight: "10px", background: "white", border: "1px solid #003399" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    htmlType="submit"
                    style={{ width: "50%", background: "#003399", color: "white" }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </>
      </Modal>
    </div >
  );
}
