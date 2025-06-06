import React, { useEffect, useState } from 'react';
import {
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    Progress,
    Row,
    Radio
} from "antd";
import './BusinessAssesmentQuestions.css'
import dayjs from 'dayjs';
import { useSelector } from "react-redux";


const BusinessAssessmentQuestions = ({ setProposalAssessment, form, proposalAssessment }) => {
    const [mandatory, setMandatory] = useState(false)
    const storedata = useSelector(
        (state) => state?.fetchProposal?.proposal?.data?.data?.proposalAssessment
    );
    const renderData = useSelector(
        (state) => state?.fetchProposal?.proposal?.data?.data?.entityDetails
    )

    const [data, setData] = useState("")
    const [effectCount, setEffectCount] = useState(0);
    const [customerId, setCustomerId] = useState(null)

    function DateScore(value) {
        const inputDate = new Date(value);
        const currentDate = new Date();
        const yearDifference = currentDate.getFullYear() - inputDate.getFullYear();
        const monthDifference = currentDate.getMonth() - inputDate.getMonth();
        const dayDifference = currentDate.getDate() - inputDate.getDate();
        let adjustedYearDifference = yearDifference;
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            adjustedYearDifference -= 1;
        }
        let score;
        if (adjustedYearDifference > 10) {
            score = -2;
        } else if (adjustedYearDifference >= 5) {
            score = -1;
        } else {
            score = 0;
        }
        return score;
    }

    function employeeScore(value) {
        let noOfEmployee = value
        let employeeScore;
        if (noOfEmployee <= 10) {
            employeeScore = 0
        }
        else if (noOfEmployee > 10 && noOfEmployee <= 50) {
            employeeScore = 1
        }
        else if (noOfEmployee > 50) {
            employeeScore = 2
        }
        console.log(employeeScore, "akshaygeetha")
        return employeeScore
    }

    const handleChange = (qID, value, score) => {
        if (qID === '13' && value === 'Yes') {
            setCustomerId(true)
        }
        else if (qID === '13' && value === 'No') {
            setCustomerId(false)
        }
        setProposalAssessment(prevData => ({
            ...prevData,
            [qID]: {
                value: value,
                score: score
            }
        }));

    };

    const remainingData = [{
        qID: "1",
        value: renderData?.businessDetails?.dateOfIncoporation,
    }, {
        qID: "2",
        value: renderData?.isBusinessRegistered === true ? "Yes" : "No",
    }, {
        qID: "3",
        value: renderData?.businessDetails?.typeOfCompany?.value,
    },
    {
        qID: "7",
        value: renderData?.financialDetails?.noOfEmployees,
    }
    ]

    useEffect(() => {
        if (effectCount < 3) {
            if (renderData?.businessDetails?.dateOfIncoporation == "" || renderData?.businessDetails?.dateOfIncoporation == undefined) {
                setData("");
                console.log(data, "akshay");
            } else {
                form.setFieldsValue({
                    "1": renderData?.businessDetails?.entityName ? renderData?.businessDetails?.entityName : "",
                    "2": renderData?.businessDetails?.dateOfIncoporation ? dayjs(renderData?.businessDetails?.dateOfIncoporation)
                        : "",
                    "4": renderData?.businessDetails?.typeOfCompany?.value ? renderData?.businessDetails?.typeOfCompany?.value : "",
                    "8": renderData?.financialDetails?.noOfEmployees ? renderData?.financialDetails?.noOfEmployees : ""
                });
                setEffectCount((prevCount) => prevCount + 1);
            }
        }
    }, [renderData, effectCount, form, proposalAssessment, remainingData]);

    useEffect(() => {
        const initialValues = {};
        storedata?.forEach((item) => {
            const score = calculateScore(item.qID, item.value);
            initialValues[item.qID] = { value: item?.value, qID: item.qID, score: score };
        });

        const mergedData = { ...initialValues };
        remainingData.forEach((item) => {
            const score = calculateScore(item.qID, item.value);
            mergedData[item.qID] = { value: item?.value, qID: item.qID, score: score };
        });
        setProposalAssessment(mergedData)
        setMandatory(false)
        if (storedata?.find(item => item.qID === "13")?.value == "Yes") {
            setCustomerId(true)
        }
        else {
            setCustomerId(false)
        }
    }, [storedata]);

    const calculateScore = (qID, value) => {
        switch (qID) {
            case "1":
                return DateScore(value);
            case "2":
                return getScore1(value);
            case "3":
                return getScore(value);
            case "4":
                return getScore2(value);
            case "5":
                return getScore1(value);
            case "6":
                return getCofounderScore(value);
            case "7":
                return employeeScore(value);
            case "8":
                return getScore3(value);
            case "9":
                return getSalaryScore(value);
            case "10":
                return getProfitScore(value);
            case "11":
                return getScore4(value);
            case "12":
                return getScore12(value);
            case "13":
                return getScore1(value);
            case "15":
                return getFinancialScore(value);
            default:
                return 0;
        }
    };

    const getScore1 = (value) => {
        switch (value) {
            case "Yes":
                return 2;
            case "No":
                return 0;
            default:
                return 0;
        }
    };

    const getFinancialScore = (value) => {
        if (value >= "10") {
            return 2
        }
        else if (value < "10") {
            return 0
        }
    }

    const getScore12 = (value) => {
        switch (value) {
            case "Yes":
                return 0;
            case "No":
                return 2;
            default:
                return 0;
        }
    };

    const getScore = (value) => {
        console.log(value, "akshay")
        switch (value) {
            case "private":
                return 2;
            case "public":
                return 2;
            case "proprietorship":
                return 1;
            case "partnership":
                return 2;
            case "society":
                return 0;
            case "trust":
                return 0;
            case "others":
                return 0;
            default:
                return 0; // default score if none matches
        }
    };

    const getScore2 = (value) => {
        switch (value) {
            case "Office":
                return 2;
            case "Residence":
                return 1;
            default:
                return 0;
        }
    };

    const getCofounderScore = (value) => {
        if (value < 3) {
            return 0
        }
        else if (value < 5) {
            return 1
        }
        else if (value > 5) {
            return 2
        }
    }

    const getScore3 = (value) => {
        switch (value) {
            case "Yes-Audited":
                return 2;
            case "Yes-but not Audited":
                return 1;
            case "Not maintained":
                return 0;
            default:
                return 0; // Default score
        }
    };

    const getSalaryScore = (value) => {
        if (value > "500000") {
            return 2
        }
        else if ("100000" >= value <= "500000") {
            return 1
        }
        else if (value < "100000") {
            return 0
        }
    }

    const getProfitScore = (value) => {
        if (value > "10") {
            return 0;
        } else if (value >= "10" && value <= "20") {
            return 1;
        } else if (value > "20") {
            return 2;
        }
    };

    const getScore4 = (value) => {
        switch (value) {
            case "Yes-Secured":
                return 1;
            case "Yes-Unsecured":
                return 0;
            case "No":
                return 2;
            default:
                return 0; // Default score
        }
    };

    return (
        <>
            <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ display: window.innerWidth >= 768 ? 'flex' : 'block', flexDirection: window.innerWidth >= 768 ? 'row' : '', justifyContent: window.innerWidth >= 768 ? 'space-between' : 'inherit' }}>
                    <div className="loandetailstitle">5- Business Assessment </div>
                    <div className={`${window.innerWidth >= 768 ? 'd-flex flex-column' : ''}`} style={{ width: window.innerWidth >= 768 ? "40%" : "100%" }}>
                        <div className={window.innerWidth >= 768 ? 'currentprogress' : 'currentprogress-hide'}>
                            Current Progress
                        </div>
                        <div style={{ display: window.innerWidth >= 768 ? 'flex' : 'block' }}>
                            <Progress percent={60} strokeColor="#003399" />
                        </div>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form layout='vertical' form={form} >
                        <Card className='card-shadow'>
                            <div className='input-item'>
                                <Form.Item
                                    label={<label className="labletitle">Name of the Entity</label>}
                                    name="1"
                                    rules={[
                                        {
                                            required: false,
                                            message: "Please Enter CIBIL Score",
                                        },
                                    ]}
                                >
                                    <Input disabled
                                        size="large"
                                        defaultValue={renderData?.businessDetails?.entityName || ""}
                                        // onChange={(e) => handleChange("0", e.target.value, 0)}
                                        placeholder='Enter Name' />
                                </Form.Item>
                            </div>
                        </Card>
                        <Card className='card-shadow'>
                            <div className="labletitle" style={{ marginBottom: 4 }}>1. Date of Commencement of Business </div>
                            <div className='input-item'>
                                <Form.Item
                                    name="2"
                                    initialValue={data || ""}
                                    rules={[
                                        {
                                            required: mandatory ? true : false,
                                            message: "Please Select",
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        disabled
                                        value={data || ""}
                                        defaultValue={data || ""}
                                        size="large"
                                        onChange={(date, dateString) => handleChange("1", dateString, DateScore(data))}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </div>
                        </Card>
                        <Card className='card-shadow'>
                            <Form.Item name="3" label={<label className="labletitle">2. Is Your Business Registered? </label>}
                                initialValue={renderData?.isBusinessRegistered === true ? "Yes" : "No"}
                                rules={[
                                    {
                                        required: mandatory ? true : false,
                                        message: "Please Select",
                                    },
                                ]}>
                                <div className='radio-btns'>
                                    <Radio.Group disabled value={renderData?.isBusinessRegistered === true ? "Yes" : "No"} defaultValue={renderData?.isBusinessRegistered === true ? "Yes" : "No"} onChange={(e) => handleChange("2", e.target.value, getScore1(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
                                        <Radio.Button value="Yes">Yes</Radio.Button>
                                        <Radio.Button value="No">No</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </Form.Item>
                        </Card>
                        <Card className='card-shadow'>
                            <Form.Item
                                initialValue={renderData?.businessDetails?.typeOfCompany?.value || ""} name="4" label={<label className="labletitle">3. Type of Company </label>}
                                rules={[
                                    {
                                        required: mandatory ? true : false,
                                        message: "Please Select",
                                    },
                                ]}>
                                <div className='radio-btns'>
                                    <Radio.Group disabled value={renderData?.businessDetails?.typeOfCompany?.value || ""} defaultValue={renderData?.businessDetails?.typeOfCompany?.value || ""} onChange={(e) => handleChange("3", e.target.value, getScore(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
                                        <Radio.Button value="private">Private</Radio.Button>
                                        <Radio.Button value="public">Public Ltd</Radio.Button>
                                        <Radio.Button value="proprietorship">Proprietorship</Radio.Button>
                                        <Radio.Button value="partnership">Partnership</Radio.Button>
                                        <Radio.Button value="society">Society</Radio.Button>
                                        <Radio.Button value="trust">Trust</Radio.Button>
                                        <Radio.Button value="others">Others</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </Form.Item>
                        </Card>
                        <Card className='card-shadow'>
                            <Form.Item name="5" label={<label className="labletitle" >4. Is the  business managed from Residence or a Business Office? </label>}
                                rules={[
                                    {
                                        required: mandatory ? true : false,
                                        message: "Please Select",
                                    },
                                ]}>
                                <div className='radio-btns'>
                                    <Radio.Group defaultValue={storedata?.find(item => item.qID === "4")?.value || ""} onChange={(e) => handleChange("4", e.target.value, getScore2(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
                                        <Radio.Button value="Office">Office</Radio.Button>
                                        <Radio.Button value="Residence">Residence</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </Form.Item>
                        </Card>
                        <Card className='card-shadow'>
                            <Form.Item name="6" label={<label className="labletitle">5. Are you Founder/Co-Founder or did you start the business? </label>}
                                rules={[
                                    {
                                        required: mandatory ? true : false,
                                        message: "Please Select",
                                    },
                                ]}>
                                <div className='radio-btns'>
                                    <Radio.Group defaultValue={storedata?.find(item => item.qID === "5")?.value || ""} onChange={(e) => handleChange("5", e.target.value, getScore1(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
                                        <Radio.Button value="Yes">Yes</Radio.Button>
                                        <Radio.Button value="No">No</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </Form.Item>
                        </Card>
                        <Card className='card-shadow'>
                            <Form.Item name="7" label={<label className="labletitle">6. Please specify the number of founders/ directors/ partners/ stakeholders in the company?</label>}
                                rules={[
                                    {
                                        required: mandatory ? true : false,
                                        message: "Please Select",
                                    },
                                ]}>
                                <div className='input-item'>
                                    <Input defaultValue={storedata?.find(item => item.qID === "6")?.value || ""} onChange={(e) => handleChange("6", e.target.value, getCofounderScore(e.target.value))} size="large" placeholder='Enter' />
                                </div>
                            </Form.Item>
                        </Card>
                        <Card className='card-shadow'>
                            <Form.Item name="8"
                                initialValue={renderData?.financialDetails?.noOfEmployees || ""} label={<label className="labletitle">7. Total No Of Employees? </label>}
                                rules={[
                                    {
                                        required: mandatory ? true : false,
                                        message: "Please Select",
                                    },
                                ]}>
                                <div className='input-item'>
                                    <Input disabled value={renderData?.financialDetails?.noOfEmployees || ""} defaultValue={renderData?.financialDetails?.noOfEmployees || ""} onChange={(e) => handleChange("7", e.target.value, employeeScore(renderData?.financialDetails?.noOfEmployees))} size="large" placeholder='Enter' />
                                </div>
                            </Form.Item>
                        </Card>
                        <Card className='card-shadow'>
                            <Form.Item name="9" label={<label className="labletitle">8. Do you maintain the company audited book of accounts? </label>}
                                rules={[
                                    {
                                        required: mandatory ? true : false,
                                        message: "Please Select",
                                    },
                                ]}>
                                <div className='radio-btns'>
                                    <Radio.Group defaultValue={storedata?.find(item => item.qID === "8")?.value || ""} onChange={(e) => handleChange("8", e.target.value, getScore3(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
                                        <Radio.Button value="Yes-Audited">Yes-Audited</Radio.Button>
                                        <Radio.Button value="Yes-but not Audited">Yes-but not Audited</Radio.Button>
                                        <Radio.Button value="Not maintained">Not maintained</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </Form.Item>
                        </Card>
                        <Card className='card-shadow'>
                            <div className='input-item'>
                                <Form.Item
                                    label={<label className="labletitle">9. What is the monthly sales (lakhs) of the company? </label>}
                                    name="10"
                                    rules={[
                                        {
                                            required: mandatory ? true : false,
                                            message: "Please Enter monthly sales",
                                        },
                                    ]}
                                >
                                    <Input defaultValue={storedata?.find(item => item.qID === "9")?.value || ""}
                                        onChange={(e) => handleChange("9", e.target.value, getSalaryScore(e.target.value))} size="large" placeholder='Enter' />
                                </Form.Item>
                            </div>
                        </Card>
                        <Card className='card-shadow'>
                            <div className='input-item'>
                                <Form.Item
                                    label={<label className="labletitle" >10. Is there any growth in profit (%) as compared to last financial year & by how much? </label>}
                                    name="11"
                                    rules={[
                                        {
                                            required: mandatory ? true : false,
                                            message: "Please Enter profit",
                                        },
                                    ]}
                                >
                                    <Input defaultValue={storedata?.find(item => item.qID === "10")?.value || ""} onChange={(e) => handleChange("10", e.target.value, getProfitScore(e.target.value))} size="large" placeholder='Enter' />
                                </Form.Item>
                            </div>
                        </Card>
                        <Card className='card-shadow'>
                            <Form.Item name="12" label={<label className="labletitle">11. Is there any active Secured/ Unsecured loans of the business? </label>}
                                rules={[
                                    {
                                        required: mandatory ? true : false,
                                        message: "Please Select",
                                    },
                                ]}>
                                <div className='radio-btns'>
                                    <Radio.Group defaultValue={storedata?.find(item => item.qID === "11")?.value || ""} onChange={(e) => handleChange("11", e.target.value, getScore4(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
                                        <Radio.Button value="Yes-Secured">Yes-Secured</Radio.Button>
                                        <Radio.Button value="Yes-Unsecured">Yes-Unsecured</Radio.Button>
                                        <Radio.Button value="No">No</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </Form.Item>
                        </Card>
                        <Card className='card-shadow'>
                            <Form.Item name="13" label={<label className="labletitle">12. Have you or any of the directors/ partners defaulted on the loans? </label>}
                                rules={[
                                    {
                                        required: mandatory ? true : false,
                                        message: "Please Select",
                                    },
                                ]}>
                                <div className='radio-btns'>
                                    <Radio.Group defaultValue={storedata?.find(item => item.qID === "12")?.value || ""} onChange={(e) => handleChange("12", e.target.value, getScore12(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
                                        <Radio.Button value="Yes">Yes</Radio.Button>
                                        <Radio.Button value="No">No</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </Form.Item>
                        </Card>

                        <Card className='card-shadow'>
                            <Form.Item name="14" label={<label className="labletitle">13. Are you an existing Customer?</label>}
                                rules={[
                                    {
                                        required: mandatory ? true : false,
                                        message: "Please Select",
                                    },
                                ]}>
                                <div className='radio-btns'>
                                    <Radio.Group defaultValue={storedata?.find(item => item.qID === "13")?.value || ""} onChange={(e) => handleChange("13", e.target.value, getScore1(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
                                        <Radio.Button value="Yes">Yes</Radio.Button>
                                        <Radio.Button value="No">No</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </Form.Item>
                        </Card>
                        {customerId === true && (storedata?.find(item => item.qID === "13")?.value == "Yes" || storedata?.find(item => item.qID === "13")?.value == undefined || storedata?.find(item => item.qID === "13")?.value == "" || storedata?.find(item => item.qID === "13")?.value == "No") ? <>
                            <Card className='card-shadow'>
                                <Form.Item name="15" label={<label className="labletitle">14. If Yes, Please provide your existing Customer ID/Loan ID?</label>}
                                    rules={[
                                        {
                                            required: mandatory ? true : false,
                                            message: "Please Select",
                                        },
                                    ]}>
                                    <Input defaultValue={storedata?.find(item => item.qID === "14")?.value || ""}
                                        onChange={(e) => handleChange("14", e.target.value, 0)} size="large" placeholder='Enter' />
                                </Form.Item>
                            </Card>

                            <Card className='card-shadow'>
                                <Form.Item name="16" label={<label className="labletitle">15.Since how many years have you been associated with this financial institution?</label>}
                                    rules={[
                                        {
                                            required: mandatory ? true : false,
                                            message: "Please Select",
                                        },
                                    ]}>
                                    <Input defaultValue={storedata?.find(item => item.qID === "15")?.value || ""}
                                        onChange={(e) => handleChange("15", e.target.value, getFinancialScore(e.target.value))} size="large" placeholder='Enter' />
                                </Form.Item>
                            </Card>
                        </> : ""}
                    </Form>
                </Col >
            </Row >
        </>
    )
}

export default BusinessAssessmentQuestions
