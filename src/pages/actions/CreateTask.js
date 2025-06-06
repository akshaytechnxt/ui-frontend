import React, { useEffect, useState } from "react";
import "./CreateTask.css";
import moment from "moment";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Input,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import Empty from "../../assets/image/empty.png";
const CreateTask = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [eventListData, setEventListData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  };

  const handleNextMonth = () => {
    const newDate = currentDate.clone().add(1, "month");
    console.log("Next month: ", newDate.format("MMM-YYYY"));
    setCurrentDate(newDate);
  };
  // const inputStyle = {
  //   borderBottom: "1px solid #d9d9d9",
  //   borderRadius: "0",
  // };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const eventData = [
    {
      date: "11/20/2023",
      start_time: "3:30 PM",
      end_time: "4:30 PM",
      event_name: "Callback Call with Allan Donald",
      priority: "medium",
    },
    {
      date: "12/20/2023",
      start_time: "3:30 PM",
      end_time: "4:30 PM",
      event_name: "Callback Call with Allan Donald",
      priority: "medium",
    },
  ];

  useEffect(() => {
    const filteredEventData = eventData.filter((event) => {
      const eventDate = moment(event.date, "MM/DD/YYYY");
      return eventDate.month() === currentDate.month();
    });
    setEventListData(filteredEventData);
  }, [currentDate]);

  const columns = [
    {
      title: "",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "",
      dataIndex: "start_time",
      key: "start_time",
      render: (text, record) => (
        <div>
          <div>{record.start_time}</div> <div>to</div>{" "}
          <div>{record.end_time}</div>
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "event_name",
      key: "event_name",
    },
    {
      title: "",
      dataIndex: "priority",
      key: "priority",
    },
  ];

  return (
    <>
      <div className="create-task-main">
        <Row gutter={[20, 20]} justify="center">
          <Col
            xs={{ order: 1 }}
            sm={{ order: 1 }}
            md={16}
            lg={{ order: 1 }}
            xl={{ order: 1 }}
            span={24}
          >
            <Card>
              {/* <div className="create_icon d-flex justify-content-end"> */}
              <PlusOutlined
                onClick={showModal}
                style={{
                  fontSize: "16px",
                  color: "#fff",
                  background: "#08c",
                  cursor: "pointer",
                  padding: "2px",
                  borderRadius: "4px",
                  position: "absolute",
                  right: "24px",
                  top: "15px",
                }}
                id="icons"
              />
              {/* </div> */}
              <div style={{ marginBottom: 16 }}>
                <Button onClick={handlePrevMonth}>&lt;</Button>
                <span style={{ margin: "0 8px" }}>
                  {`${currentDate.format("MMM")}-${currentDate.format("YYYY")}`}
                </span>
                <Button onClick={handleNextMonth}>&gt;</Button>
              </div>
              <div className="event_list">
                {eventListData.length > 0 ? (
                  <div
                    className="event_list_header d-flex align-items-center py-2 px-2"
                    style={{ background: "#F7F7F7" }}
                  >
                    <p className="am mb-0 font-weight-bold mr-3">Am</p>
                    <p className="till_time mb-0">(till 11:59am)</p>
                  </div>
                ) : null}
                <div className="events">
                  <Table
                    dataSource={eventListData}
                    columns={columns}
                    showHeader={false}
                    pagination={false}
                    locale={{
                      emptyText: (
                        <div className="d-flex flex-column m-auto w-100">
                          <img
                            width={200}
                            className="m-auto"
                            src={Empty}
                            alt="Empty"
                          />
                          <h5 className="mb-2">No Events Exist</h5>
                          <Button
                            style={{
                              background: "#74879a",
                              color: "#fff",
                              borderRadius: "2px",
                              cursor: "pointer",
                            }}
                            onClick={showModal}
                          >
                            Create an Event
                          </Button>
                        </div>
                      ),
                    }}
                  />
                </div>
              </div>
            </Card>
          </Col>
          <Col
            xs={{ order: 1 }}
            sm={{ order: 1 }}
            md={8}
            lg={{ order: 1 }}
            xl={{ order: 1 }}
            span={24}
          >
            <Card
              title="To Do List"
              className="mb-3"
              extra={
                <PlusOutlined
                  onClick={openModal}
                  style={{
                    fontSize: "16px",
                    color: "#fff",
                    background: "#08c",
                    cursor: "pointer",
                    padding: "2px",
                    borderRadius: "4px",
                    position: "absolute",
                    right: "24px",
                    top: "15px",
                  }}
                />
              }
            >
              <div className="todolist_checkbox">
                <Checkbox className="checkbox">
                  loremjdkcsakcjnslajcalscsljccjded
                </Checkbox>
                <Divider className="divider" />
                <Checkbox className="checkbox">
                  loremnkcjekcejckecjcekcjeckejcecjekcjeckejc
                </Checkbox>
                <Divider className="divider" />
                <Checkbox className="checkbox">loremkelckeclekc</Checkbox>
                <Divider className="divider" />
              </div>
            </Card>
            <Card
              title="Reminders"
              extra={
                <PlusOutlined
                  onClick={openModal}
                  style={{
                    fontSize: "16px",
                    color: "#fff",
                    background: "#08c",
                    cursor: "pointer",
                    padding: "2px",
                    borderRadius: "4px",
                    position: "absolute",
                    right: "24px",
                    top: "15px",
                  }}
                />
              }
            >
              <div>
                <p>haskjfhla</p>
                <Divider className="divider" />
                <p>haskjfhla</p>
                <Divider className="divider" />
                <p>haskjfhla</p>
                <Divider className="divider" />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      {/* modal add to do prajyot */}
      {isModalVisible && (
        <Modal
          title="Add Task"
          visible={isModalVisible}
          onOk={openModal}
          onCancel={closeModal}
          footer={[
            <Button
              className="w-25 align-items-center"
              key="back"
              type="default"
              onClick={handleCancel}
              style={{
                background: "#ccc",
                borderColor: "#000",
                color: "#000",
              }}
            >
              <CloseCircleOutlined />
              Cancel
            </Button>,
            <Button
              className="w-25"
              key="submit"
              type="primary"
              onClick={handleOk}
              style={{ background: "#000" }}
            >
              <PlusOutlined />
              Add
            </Button>,
          ]}
        >
          <Input
            placeholder="What do you need to do?"
            style={{ border: "none" }}
          />
          <Divider style={{ margin: "12px 0" }} />
        </Modal>
      )}
      {/* end modal */}
      <Modal
        title="Create Event"
        open={isModalOpen}
        width={700}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            className="w-25 align-items-center"
            key="back"
            type="default"
            onClick={handleCancel}
            style={{ background: "#ccc", borderColor: "#000", color: "#000" }}
          >
            <CloseCircleOutlined />
            Cancel
          </Button>,
          <Button
            className="w-30"
            key="submit"
            type="primary"
            onClick={handleOk}
            style={{ background: "#000" }}
          >
            <PlusOutlined />
            Book Appointment
          </Button>,
        ]}
        bodyStyle={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}
      >
        <div className="container">
          <p className="event_form_header">Event Details</p>
          <div className="row mb-3">
            <div className="col-12 col-sm-6">
              <label className="custom-label">Event Type</label>
              <Select
                className="custom_select"
                defaultValue="lucy"
                style={{
                  width: "100%",
                }}
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="custom-label">Event Name</label>
              <Input placeholder="Enter Event Name" className="custom-input" />
            </div>
          </div>
          <p className="event_form_header">Set Schedule</p>
          <div className="row">
            <div className="col-12">
              <label className="custom-label">Description</label>
              <Input
                placeholder="Type Description Here"
                className="custom-input"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateTask;
