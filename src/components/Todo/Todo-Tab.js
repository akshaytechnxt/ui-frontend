import { Button, Modal, DatePicker, Input, Select, Form, Col, Radio, Row, message, Drawer } from "antd";
import React, { useEffect, useState } from "react";
import axiosRequest from "../../axios-request/API.request";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs"

const TodoTab = ({ button, isModalVisible, setIsModalVisible, recordData, onTodoCreateOrUpdate }) => {
    const [form] = Form.useForm();
    const moment = require('moment');
    const [isHighButtonClick, setIsHighButtonClick] = useState(false);
    const [isMediumButtonClick, setIsMediumButtonClick] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    const [isLowButtonClick, setIsLowButtonClick] = useState(false);
    const [priorityBtn, setPriorityBtn] = useState("");
    const [priorityBtnColr, setPriorityBtnColr] = useState("");
    const [todoData, setTodoData] = useState({
        EntityName: "",
        stackHolderName: "",
        MobileNumber: "",
        category: "",
        stackHolderType: "individual",
        reminderDate: "",
        priority: "",
        status: "",
        description: ""
    });

    const breakpoint = 620;

    useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, [width]);

    const onChange = (e) => {
        setTodoData({ ...todoData, stackHolderType: e.target.value });
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        if (button === "Create") {
            setIsModalVisible(false);
            form.resetFields();
            setPriorityBtnColr("")
            setPriorityBtn("")
            setIsHighButtonClick(false)
            setIsLowButtonClick(false)
            setIsMediumButtonClick(false)
            setTodoData({
                EntityName: "",
                stackHolderName: "",
                MobileNumber: "",
                category: "",
                stackHolderType: "",
                reminderDate: "",
                priority: "",
                status: "",
                description: ""
            });
        }
        else {
            setIsModalVisible(false)
        }

    };

    const disabledDate = current => {
        return current && current < moment().startOf('day');
    }

    useEffect(() => {
        if (button === "Update") {
            const { stackHolder, category, targetDate, priority, status, description } = recordData;
            console.log(recordData, "akshay")
            form.setFieldsValue({
                IndividualName: stackHolder.individual_name,
                StackHolderType: stackHolder.holderType,
                StackHolderName: stackHolder.entity_name,
                MobileNumber: `${stackHolder.mobile}`,
                CategoryValue: category,
                TargetDate: dayjs(targetDate),
                Priority: priority,
                Status: status,
                description: description
            });
            setTodoData({
                ...todoData,
                EntityName: stackHolder.individual_name,
                stackHolderName: stackHolder.entity_name,
                MobileNumber: `${stackHolder.mobile}`,
                category,
                stackHolderType: stackHolder.holderType,
                reminderDate: dayjs(targetDate).format("YYYY-MM-DD"),
                priority,
                status,
                description
            });
            if (priority === "High") {
                setPriorityBtnColr("#ff5252");
                setPriorityBtn("High");
                setIsHighButtonClick(true);
                setIsMediumButtonClick(false);
                setIsLowButtonClick(false);
            }
            if (priority === "Medium") {
                setPriorityBtnColr("#fb8c00");
                setPriorityBtn("Medium");
                setIsMediumButtonClick(true);
                setIsHighButtonClick(false);
                setIsLowButtonClick(false);
            }
            if (priority === "Low") {
                setPriorityBtnColr("#4caf50");
                setPriorityBtn("Low");
                setIsLowButtonClick(true);
                setIsHighButtonClick(false);
                setIsMediumButtonClick(false);
            }
        }
        else {
            form.resetFields();
            setPriorityBtnColr("")
            setPriorityBtn("")
            setIsHighButtonClick(false)
            setIsLowButtonClick(false)
            setIsMediumButtonClick(false)
            setTodoData({
                EntityName: "",
                stackHolderName: "",
                MobileNumber: "",
                category: "",
                stackHolderType: "individual",
                reminderDate: "",
                priority: "",
                status: "",
                description: ""
            });
        }
    }, [button, recordData]);

    const onChangeDatePick = (date, dateString) => {
        setTodoData({ ...todoData, reminderDate: dateString });
    };

    const CategoryValue = (value) => {
        setTodoData({ ...todoData, category: value });
    };

    const StatusValue = (value) => {
        setTodoData({ ...todoData, status: value });
    }

    const handleForm = () => {
        if (priorityBtn != "") {
            const payload = {
                stackHolder: {
                    holderType: todoData.stackHolderType,
                    entity_name: todoData.stackHolderName,
                    individual_name: todoData.EntityName,
                    mobile: parseInt(todoData.MobileNumber, 10)
                },
                category: todoData.category,
                targetDate: dayjs(todoData.reminderDate).format('YYYY-MM-DD'),
                priority: priorityBtn,
                status: todoData.status,
                description: todoData.description
            };
            const apiConfig = button === "Update" ? `activity/todo/update/${recordData._id}` : `activity/todo/create`;
            axiosRequest[button === "Update" ? "put" : "post"](apiConfig, payload)
                .then((res) => {
                    if (res.resCode === -1) {
                        setIsModalVisible(false);
                        message.success(`To-Do ${button === "Update" ? "Updated" : "Created"} Successfully`);
                        form.resetFields();
                        setPriorityBtnColr("")
                        setPriorityBtn("")
                        setIsHighButtonClick(false)
                        setIsLowButtonClick(false)
                        setIsMediumButtonClick(false)
                        setTodoData({
                            EntityName: "",
                            stackHolderName: "",
                            MobileNumber: "",
                            category: "",
                            stackHolderType: "",
                            reminderDate: "",
                            priority: "",
                            status: "",
                            description: ""
                        });
                        onTodoCreateOrUpdate()
                    }
                })
                .catch((error) => {
                    //message.error(error);
                });
        }
        else {
            //message.error("priority Should be mandatory")
        }
    }

    return (
        <>
            {width > breakpoint ? (
                <>
                    <Modal
                        title={button === "Update" ? 'Update To Do' : 'Create To Do'}
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        className="todo-header-style"
                        style={{ padding: 24 }}
                        width={1000}
                    >
                        <Form form={form} onFinish={handleForm} layout="vertical">
                            <div className="">
                                <Form.Item
                                    name="StackHolderType"
                                    label="Stake Holder Type"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please Select Stake Holder Type",
                                        }
                                    ]}>
                                    <Radio.Group defaultValue="individual" onChange={onChange}>
                                        <Radio value="individual">Individual</Radio>
                                        <Radio value="entity">Entity</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                <Row>
                                    <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                                        <Form.Item
                                            name="StackHolderName"
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
                                            <Input style={{ width: "98%" }} onChange={(e) => setTodoData({ ...todoData, stackHolderName: e.target.value })} placeholder="Enter Stake Holder Name">
                                            </Input>
                                        </Form.Item>
                                    </Col>
                                    <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                                        <Form.Item
                                            name="IndividualName"
                                            label={todoData.stackHolderType === "entity" ? <div>Entity Name</div> : todoData.stackHolderType === "individual" ? <div>Individual Name</div> : <>Name</>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Enter Entity Name",
                                                },
                                                {
                                                    message: "only Alphabets are allowed",
                                                    pattern: new RegExp(/^[a-zA-Z][a-zA-Z ]*$/),
                                                },
                                            ]}>
                                            <Input style={{ width: "98%" }} onChange={(e) => setTodoData({ ...todoData, EntityName: e.target.value })} placeholder="Enter Name">
                                            </Input>
                                        </Form.Item>
                                    </Col>
                                    <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                                        <Form.Item
                                            name="MobileNumber"
                                            label="Mobile Number"
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
                                            ]}>
                                            <Input style={{ width: "98%" }} maxLength={10} onChange={(e) => setTodoData({ ...todoData, MobileNumber: e.target.value })} placeholder="Enter Mobile Number">
                                            </Input>
                                        </Form.Item>
                                    </Col>

                                    <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                                        <Form.Item
                                            name="CategoryValue"
                                            label="Category"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Select Category",
                                                }]}>
                                            <Select placeholder="Select Category" style={{ width: "98%" }} onChange={CategoryValue}>
                                                <Select.Option value="Document Collection">Document Collection</Select.Option>
                                                <Select.Option value="Document Submission">Document Submission</Select.Option>
                                                <Select.Option value="EMI Collection">EMI Collection</Select.Option>
                                                <Select.Option value="Share amortization schedule">Share amortization schedule</Select.Option>
                                                <Select.Option value="Meeting with Customer">Meeting with Customer</Select.Option>
                                                <Select.Option value="Other">Other</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                                        <Form.Item
                                            name="TargetDate"
                                            label="Target Date"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Select Target Date",
                                                }]}>
                                            <DatePicker
                                                format="YYYY/MM/DD"
                                                disabledDate={disabledDate}
                                                style={{ width: "98%" }}
                                                onChange={(date, dateString) => onChangeDatePick(date, dateString)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                                        <Form.Item
                                            name="Status"
                                            label="Status"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Select Status",
                                                }]}>
                                            <Select
                                                style={{ width: "98%" }}
                                                placeholder="Select"
                                                onChange={StatusValue}
                                            >
                                                <Select.Option value="Open">Open</Select.Option>
                                                <Select.Option value="In-Progress">Inprogress</Select.Option>
                                                <Select.Option value="Hold">Hold</Select.Option>
                                                <Select.Option value="Overdue">Overdue</Select.Option>
                                                <Select.Option value="Closed">Closed</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col md={12} lg={12} xs={24} sm={24} xl={12}>
                                        <p style={{ marginBottom: "5px" }}><span style={{ color: 'red' }}>*</span> Add Priority</p>
                                        <Button
                                            style={{
                                                marginRight: 5,
                                                backgroundColor: isHighButtonClick ? "#ff5252" : "#ffcccc",
                                                color: isHighButtonClick ? "#fff" : "#ff5252",
                                                border: "1px solid #ff5252",
                                            }}
                                            onClick={() => {
                                                setPriorityBtnColr("#ff5252");
                                                setPriorityBtn("High");
                                                setIsHighButtonClick(true);
                                                setIsMediumButtonClick(false);
                                                setIsLowButtonClick(false);
                                            }}
                                        >
                                            High
                                        </Button>
                                        <Button
                                            style={{
                                                marginRight: 5,
                                                backgroundColor: isMediumButtonClick ? "#fb8c00" : "rgba(254, 137, 0, 0.2)",
                                                color: isMediumButtonClick ? "#fff" : "#fb8c00",
                                                border: isMediumButtonClick ? "1px solid #ffeb3b" : "1px solid #fe8900",
                                            }}
                                            onClick={() => {
                                                setPriorityBtnColr("#fb8c00");
                                                setPriorityBtn("Medium");
                                                setIsMediumButtonClick(true);
                                                setIsHighButtonClick(false);
                                                setIsLowButtonClick(false);
                                            }}
                                        >
                                            Medium
                                        </Button>
                                        <Button
                                            style={{
                                                marginRight: 5,
                                                backgroundColor: isLowButtonClick ? "#008000" : "rgba(11, 193, 51, 0.2)",
                                                color: isLowButtonClick ? "#fff" : "#4caf50",
                                                border: isLowButtonClick ? "1px solid #4caf50" : "1px solid #0BC133",
                                            }}
                                            onClick={() => {
                                                setPriorityBtnColr("#4caf50");
                                                setPriorityBtn("Low");
                                                setIsLowButtonClick(true);
                                                setIsHighButtonClick(false);
                                                setIsMediumButtonClick(false);
                                            }}
                                        >
                                            Low
                                        </Button>
                                    </Col>

                                    <Col md={24} lg={24} xs={24} sm={24} xl={24}>
                                        <Form.Item
                                            style={{ marginTop: 10 }}
                                            name="description"
                                            label="Description"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Enter description",
                                                }]}
                                        >
                                            <TextArea
                                                style={{ width: "98%" }}
                                                onChange={(e) => setTodoData({ ...todoData, description: e.target.value })}
                                                placeholder="Enter Description"
                                            ></TextArea>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <div
                                    style={{ display: "flex", marginTop: "20px", justifyContent: "flex-end" }}
                                >
                                    <div style={{ width: "50%", display: "flex", flexDirection: "row" }}>
                                        <Button
                                            onClick={() => handleCancel()}
                                            style={{ width: "50%", color: "#68BA7F", marginRight: "10px", background: "white", border: "1px solid #68BA7F" }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            htmlType="submit"
                                            style={{ width: "50%", background: "#68BA7F", color: "white" }}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Modal>
                </>
            ) : <> <Drawer
                onClose={handleCancel}
                title={button === "Update" ? 'Update To Do' : 'Create To Do'}
                visible={isModalVisible}
                placement="bottom"
                className="todo-header-style"
                height={500}
            >
                <Form form={form} onFinish={handleForm} layout="vertical">
                    <div className="">
                        <Form.Item
                            name="StackHolderType"
                            label="Stake Holder Type"
                            rules={[
                                {
                                    required: false,
                                    message: "Please Select Stake Holder Type",
                                }
                            ]}>
                            <Radio.Group defaultValue="individual" onChange={onChange}>
                                <Radio value="individual">Individual</Radio>
                                <Radio value="entity">Entity</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Row>
                            <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                                <Form.Item
                                    name="StackHolderName"
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
                                    <Input style={{ width: "98%" }} onChange={(e) => setTodoData({ ...todoData, stackHolderName: e.target.value })} placeholder="Enter Stake Holder Name">
                                    </Input>
                                </Form.Item>
                            </Col>
                            <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                                <Form.Item
                                    name="IndividualName"
                                    label={todoData.stackHolderType === "entity" ? <div>Entity Name</div> : todoData.stackHolderType === "individual" ? <div>Individual Name</div> : <>Name</>}
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter Entity Name",
                                        },
                                        {
                                            message: "only Alphabets are allowed",
                                            pattern: new RegExp(/^[a-zA-Z][a-zA-Z ]*$/),
                                        },
                                    ]}>
                                    <Input style={{ width: "98%" }} onChange={(e) => setTodoData({ ...todoData, EntityName: e.target.value })} placeholder="Enter Name">
                                    </Input>
                                </Form.Item>
                            </Col>
                            <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                                <Form.Item
                                    name="MobileNumber"
                                    label="Mobile Number"
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
                                    ]}>
                                    <Input style={{ width: "98%" }} maxLength={10} onChange={(e) => setTodoData({ ...todoData, MobileNumber: e.target.value })} placeholder="Enter Mobile Number">
                                    </Input>
                                </Form.Item>
                            </Col>

                            <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                                <Form.Item
                                    name="CategoryValue"
                                    label="Category"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Select Category",
                                        }]}>
                                    <Select placeholder="Select Category" style={{ width: "98%" }} onChange={CategoryValue}>
                                        <Select.Option value="Document Collection">Document Collection</Select.Option>
                                        <Select.Option value="Document Submission">Document Submission</Select.Option>
                                        <Select.Option value="EMI Collection">EMI Collection</Select.Option>
                                        <Select.Option value="Share amortization schedule">Share amortization schedule</Select.Option>
                                        <Select.Option value="Meeting with Customer">Meeting with Customer</Select.Option>
                                        <Select.Option value="Other">Other</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                                <Form.Item
                                    name="TargetDate"
                                    label="Target Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Select Target Date",
                                        }]}>
                                    <DatePicker
                                        format="YYYY/MM/DD"
                                        disabledDate={disabledDate}
                                        style={{ width: "98%" }}
                                        onChange={(date, dateString) => onChangeDatePick(date, dateString)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={8} lg={8} xs={24} sm={24} xl={8}>
                                <Form.Item
                                    name="Status"
                                    label="Status"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Select Status",
                                        }]}>
                                    <Select
                                        style={{ width: "98%" }}
                                        placeholder="Select"
                                        onChange={StatusValue}
                                    >
                                        <Select.Option value="Open">Open</Select.Option>
                                        <Select.Option value="In-Progress">Inprogress</Select.Option>
                                        <Select.Option value="Hold">Hold</Select.Option>
                                        <Select.Option value="Overdue">Overdue</Select.Option>
                                        <Select.Option value="Closed">Closed</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col md={12} lg={12} xs={24} sm={24} xl={12}>
                                <p style={{ marginBottom: "5px" }}><span style={{ color: 'red' }}>*</span> Add Priority</p>
                                <Button
                                    style={{
                                        marginRight: 5,
                                        backgroundColor: isHighButtonClick ? "#ff5252" : "#ffcccc",
                                        color: isHighButtonClick ? "#fff" : "#ff5252",
                                        border: "1px solid #ff5252",
                                    }}
                                    onClick={() => {
                                        setPriorityBtnColr("#ff5252");
                                        setPriorityBtn("High");
                                        setIsHighButtonClick(true);
                                        setIsMediumButtonClick(false);
                                        setIsLowButtonClick(false);
                                    }}
                                >
                                    High
                                </Button>
                                <Button
                                    style={{
                                        marginRight: 5,
                                        backgroundColor: isMediumButtonClick ? "#fb8c00" : "rgba(254, 137, 0, 0.2)",
                                        color: isMediumButtonClick ? "#fff" : "#fb8c00",
                                        border: isMediumButtonClick ? "1px solid #ffeb3b" : "1px solid #fe8900",
                                    }}
                                    onClick={() => {
                                        setPriorityBtnColr("#fb8c00");
                                        setPriorityBtn("Medium");
                                        setIsMediumButtonClick(true);
                                        setIsHighButtonClick(false);
                                        setIsLowButtonClick(false);
                                    }}
                                >
                                    Medium
                                </Button>
                                <Button
                                    style={{
                                        marginRight: 5,
                                        backgroundColor: isLowButtonClick ? "#008000" : "rgba(11, 193, 51, 0.2)",
                                        color: isLowButtonClick ? "#fff" : "#4caf50",
                                        border: isLowButtonClick ? "1px solid #4caf50" : "1px solid #0BC133",
                                    }}
                                    onClick={() => {
                                        setPriorityBtnColr("#4caf50");
                                        setPriorityBtn("Low");
                                        setIsLowButtonClick(true);
                                        setIsHighButtonClick(false);
                                        setIsMediumButtonClick(false);
                                    }}
                                >
                                    Low
                                </Button>
                            </Col>

                            <Col md={24} lg={24} xs={24} sm={24} xl={24}>
                                <Form.Item
                                    style={{ marginTop: 10 }}
                                    name="description"
                                    label="Description"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please Enter description",
                                        }]}
                                >
                                    <TextArea
                                        style={{ width: "98%" }}
                                        onChange={(e) => setTodoData({ ...todoData, description: e.target.value })}
                                        placeholder="Enter Description"
                                    ></TextArea>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div
                            style={{ display: "flex", marginTop: "20px", justifyContent: "flex-end" }}
                        >
                            <div style={{ width: "50%", display: "flex", flexDirection: "row" }}>
                                <Button
                                    onClick={() => handleCancel()}
                                    style={{ width: "50%", color: "#68BA7F", marginRight: "10px", background: "white", border: "1px solid #68BA7F" }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    htmlType="submit"
                                    style={{ width: "50%", background: "#68BA7F", color: "white" }}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>
            </Drawer></>}
        </>
    );
};

export default TodoTab;
