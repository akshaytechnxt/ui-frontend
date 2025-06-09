import React, { useEffect, useState } from 'react'
import { Row, Col, Select, Form, Button, Table, Breadcrumb, Input, message, Upload, Progress, Modal } from "antd"
import { CloseOutlined, UploadOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import '../../components/Todo/ActivityCalendar.css'
import Config from "../../config/api.config";
import axiosRequest from "../../axios-request/API.request"
import CurrencyFormat from 'react-currency-format';
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import dayjs from "dayjs"

// Sample data for collection view
const mockCollectionData = {
  installmentTable: [
    {
      noOfInstallment: 1,
      outstandingAmount: 300000,
      installment: 25000,
      principalAmount: 20000,
      interestAmount: 5000,
      scheduleRepaymentDate: "2024-03-15",
      scheduleInDays: 30,
      actualRepaymentDate: "2024-03-15",
      actualRepaymentAmount: 25000
    },
    {
      noOfInstallment: 2,
      outstandingAmount: 280000,
      installment: 25000,
      principalAmount: 20500,
      interestAmount: 4500,
      scheduleRepaymentDate: "2024-04-15",
      scheduleInDays: 30,
      actualRepaymentDate: null,
      actualRepaymentAmount: null
    },
    {
      noOfInstallment: 3,
      outstandingAmount: 259500,
      installment: 25000,
      principalAmount: 21000,
      interestAmount: 4000,
      scheduleRepaymentDate: "2024-05-15",
      scheduleInDays: 30,
      actualRepaymentDate: null,
      actualRepaymentAmount: null
    },
    {
      noOfInstallment: 4,
      outstandingAmount: 238500,
      installment: 25000,
      principalAmount: 21500,
      interestAmount: 3500,
      scheduleRepaymentDate: "2024-06-15",
      scheduleInDays: 30,
      actualRepaymentDate: null,
      actualRepaymentAmount: null
    },
    {
      noOfInstallment: 5,
      outstandingAmount: 217000,
      installment: 25000,
      principalAmount: 22000,
      interestAmount: 3000,
      scheduleRepaymentDate: "2024-07-15",
      scheduleInDays: 30,
      actualRepaymentDate: null,
      actualRepaymentAmount: null
    }
  ],
  collectionInfo: {
    totalLoanAmount: 300000,
    totalInterest: 30000,
    totalAmount: 330000,
    loanStartDate: "2024-02-15",
    loanEndDate: "2025-02-15",
    interestRate: 12,
    emiAmount: 25000,
    frequency: "Monthly",
    totalInstallments: 12,
    paidInstallments: 1,
    remainingInstallments: 11,
    nextDueDate: "2024-04-15",
    daysUntilNextDue: 30
  },
  collectionDetails: {
    customerName: "John Doe",
    customerId: "CUST001",
    loanId: "LOAN001",
    loanType: "Personal Loan",
    loanPurpose: "Home Renovation",
    disbursementDate: "2024-02-15",
    disbursementAmount: 300000,
    currentOutstanding: 280000,
    totalPaid: 25000,
    lastPaymentDate: "2024-03-15",
    lastPaymentAmount: 25000,
    nextPaymentDue: "2024-04-15",
    daysUntilNextDue: 30,
    paymentHistory: [
      {
        date: "2024-03-15",
        amount: 25000,
        type: "EMI",
        status: "Paid",
        mode: "Cash"
      }
    ],
    documents: [
      {
        type: "Loan Agreement",
        uploadDate: "2024-02-15",
        status: "Verified"
      },
      {
        type: "KYC Documents",
        uploadDate: "2024-02-15",
        status: "Verified"
      }
    ],
    contactInfo: {
      phone: "+91 9876543210",
      email: "john.doe@example.com",
      address: "123 Main Street, City, State - 123456"
    }
  }
};

function CollectionView() {
  const { baseURL } = Config;
  const token = useSelector((state) => state?.user?.userData?.data?.data?.jwt);
  const location = useLocation()
  const [paymentScreen, setPaymentScreen] = useState(true)
  const [CollectionView, setCollectionView] = useState("")
  const [amount, setAmount] = useState("")
  const [form] = Form.useForm();
  const [files, setFiles] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [collectionData, setCollectionData] = useState([])
  const [pdfReceipt, setPdfReceipt] = useState("")
  const [successPayment, setSuccessPayment] = useState("")
  const [chequeNumber, setChequeNumber] = useState("")
  const [pdfView, setPdfView] = useState(false)
  const [chequeAmount, setChequeAmount] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [docId, setDocId] = useState("")
  const [paymentMode, setPaymentMode] = useState("")
  const [show, setShow] = useState(true)
  const [denominations, setDenominations] = useState({
    2000: 0,
    500: 0,
    200: 0,
    100: 0,
    50: 0,
    20: 0,
    10: 0,
    5: 0,
    1: 0
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In development mode, use mock data
        if (process.env.NODE_ENV === 'development') {
          setData(mockCollectionData);
          return;
        }

        const response = await axiosRequest.get(`proposal/collection/get_collection_details?proposalId=${location?.state}`);
        setData(response.data?.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const shareReceipt = async () => {
    try {
      const response = await axiosRequest.post(`proposal/payment/shareReceipt/${successPayment?.paymentId}`);
      if (response?.resCode === -1) {
        message.success("Receipt Shared Successfully")
      }
      else {
        //message.error(response?.data?.msg)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const viewReceipt = async (id) => {
    console.log(id, "akshaysri")
    try {
      const response = await axiosRequest.post(`proposal/payment/getReceipt/${id}`);
      if (response?.resCode === -1) {
        message.success("Receipt Shared Successfully")
        setPdfReceipt(response?.data)
      }
      else {
        //message.error(response?.data?.msg)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const totalAmount = Object.keys(denominations).reduce((total, denomination) => {
    return total + denomination * denominations[denomination];
  }, 0);

  const handleInputChange = (denomination, value) => {
    setDenominations((prevDenominations) => ({
      ...prevDenominations,
      [denomination]: value,
    }));
  };

  const viewCollectionTable = async () => {
    try {
      // In development mode, use mock data
      if (process.env.NODE_ENV === 'development') {
        setShow(false);
        setCollectionData(mockCollectionData.installmentTable);
        setCollectionView(mockCollectionData.collectionInfo);
        return;
      }

      const formData = new FormData();
      formData.append("uid", location?.state);
      formData.append("key", "paymentCheque");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const response = await axios.get(`${baseURL}proposal/collection/get_installment_table?proposalId=${location?.state}`, {
        headers: headers,
        params: formData,
      });
      setShow(false);
      setCollectionData(response?.data?.data?.data?.installmentTable || []);
      setCollectionView(response?.data?.data?.data?.collectionInfo || "");
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const paymentCash = async () => {
    if (Number(amount) === Number(totalAmount)) {
      const form = {
        "modeOfPayment": "cash",
        "totalAmount": Number(totalAmount),
        "paymentDetails": {
          "cashDistribution": denominations
        },
        "key": "emi",
        "uid": location?.state
      }
      try {
        const response = await axiosRequest.post(`proposal/payment/create`, form);
        if (response?.resCode === -1) {
          setSuccessPayment(response?.data)
          message.success("Payment Done Successfully")
          setPaymentScreen(false)
          setPaymentMode("")
          setDenominations({
            2000: 0,
            500: 0,
            200: 0,
            100: 0,
            50: 0,
            20: 0,
            10: 0,
            5: 0,
            1: 0,
          })
          setAmount("")
          viewReceipt(response?.data?.paymentId)
        }
        else {
          //message.error(response?.data?.msg)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    else {
      //message.error("Check the total Amount and the given Amount")
    }
  }

  const paymentCheque = async () => {
    const form = {
      "modeOfPayment": "cheque",
      "totalAmount": Number(chequeAmount),
      "paymentDetails": {
        "chequeNumber": Number(chequeNumber),
        "chequeDoc": docId
      },
      "key": "emi",
      "uid": location?.state
    }
    try {
      const response = await axiosRequest.post(`proposal/payment/create`, form);
      if (response?.resCode === -1) {
        message.success("Payment Successfully")
        setSuccessPayment(response?.data)
        setPaymentScreen(false)
        viewReceipt(response?.data?.paymentId)
      }
      else {
        //message.error(response?.data?.msg)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleChange = async (info) => {
    console.log(info, "akshay")
    const { file } = info;
    if (!file) {
      //message.error("Please upload a file.");
      return;
    }
    const isPdfOrPng =
      file.type === "application/pdf" ||
      file.type === "image/jpeg" ||
      file.type === "image/png";
    if (!isPdfOrPng) {
      //message.error("Only .pdf, .jpg, and .png files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      //message.error("Max size of file is 5 MB.");
      return;
    }
    setFiles(file);
    setImageUrl(URL.createObjectURL(file));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uid", location?.state);
      formData.append("key", "paymentCheque");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };
      const axiosConfig = `${baseURL}proposal/payment/upload_doc`;
      const response = await axios.post(axiosConfig, formData, {
        headers,
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setUploadProgress(percentCompleted);
        },
      });
      console.log(response, "akshay")
      if (response?.data?.resCode === -1) {
        message.success(response?.data?.data?.msg);
        setDocId(response?.data?.data?.data?.documentId)
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  console.log(docId, "akshay")
  const handlePreview = () => {
    setPreviewUrl(imageUrl);
    setPreviewVisible(true);
  };

  const handleCancelPreviewPdf = () => {
    setPdfView(false)
  }

  const handleRemove = () => {
    setImageUrl("")
    setFiles("")
    setUploadProgress(0)
  }

  const columns = [
    {
      title: 'Installment',
      dataIndex: 'noOfInstallment',
      key: 'noOfInstallment',
    },
    {
      title: 'Outstanding Amt',
      dataIndex: 'outstandingAmount',
      key: 'outstandingAmount',
    },
    {
      title: 'Installment Amt',
      dataIndex: 'installment',
      key: 'installment',
    },
    {
      title: 'Principal Amt',
      dataIndex: 'principalAmount',
      key: 'principalAmount',
    },
    {
      title: 'Interest Amt',
      dataIndex: 'interestAmount',
      key: 'interestAmount',
    },
    {
      title: 'Schedule Repayment Date',
      dataIndex: 'scheduleRepaymentDate',
      key: 'scheduleRepaymentDate',
      render: (text, record) => (
        <>
          <div>{record?.scheduleRepaymentDate ? dayjs(record?.scheduleRepaymentDate).format("DD-MM-YYYY") : "--"}</div>
        </>
      ),
    },
    {
      title: 'Schedule in days',
      dataIndex: 'scheduleInDays',
      key: 'scheduleInDays',
    },
    {
      title: 'Actual Repayment Date',
      dataIndex: 'actualRepaymentDate',
      key: 'actualRepaymentDate',
      render: (text, record) => (
        <>
          <div>{record?.scheduleRepaymentDate ? dayjs(record?.scheduleRepaymentDate).format("DD-MM-YYYY") : "--"}</div>
        </>
      ),
    },
    {
      title: 'Actual Repayment Amt',
      dataIndex: 'actualRepaymentAmount',
      key: 'actualRepaymentAmount',
      render: (text, record) => (
        <>
          <div>{record?.actualRepaymentAmount}</div>
        </>
      ),
    },
  ];

  const handleCancelPreview = () => {
    setPreviewVisible(false);
    setPreviewUrl(null);
  };

  return (
    <>
      <div style={{ background: "#ffffff" }}>
        {show === true ?
          <>
            <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "row", padding: "1% 3%" }} className="main_div">
              <div className="top_div">
                <div>
                  <Breadcrumb style={{ color: "white" }} separator=">" className="breadcrumb">
                    <Breadcrumb.Item href="/dashboard"><div className='todo-text'>Dashboard</div></Breadcrumb.Item>
                    <Breadcrumb.Item href="/collection-listing"><div className='todo-text'>Collection Listing</div></Breadcrumb.Item>
                    <Breadcrumb.Item href=""><div className='todo-text'>Collections</div></Breadcrumb.Item>
                  </Breadcrumb>
                  <div style={{ padding: "0% 0% 0% 4%", fontSize: 23, marginTop: -20 }}>Collection Details</div>
                </div>
              </div>
            </div>
            <Row style={{ columnGap: 10, padding: "2%" }}>
              <Col style={{ border: "1px solid lightgray", borderRadius: 6 }} xl={18} sm={24} lg={18} xs={24} md={18}>
                <div className='heading-collection'>
                  Personal Details
                </div>
                <Row style={{ padding: "1%" }}>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>Applicant Name</div>
                    <div className='collection-content'>{data?.applicantId?.fullName || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>Application ID</div>
                    <div className='collection-content'>{data?.applicantId?.applicantId || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>Mobile Number</div>
                    <div className='collection-content'>{data?.applicantId?.primaryMobile || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>Email ID</div>
                    <div className='collection-content'>{data?.applicantId?.primaryEmail || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>Alt Mobile Number</div>
                    <div className='collection-content'>{data?.applicantId?.primaryMobile || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>Entity Name</div>
                    <div className='collection-content'>{data?.entity?.name || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>Applicant Type</div>
                    <div className='collection-content'>{data?.EmiDetails?.loanType?.value || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>Purpose of Loan</div>
                    <div style={{ textTransform: "uppercase" }} className='collection-content'>{data?.loanDetails?.loanType?.value || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Address Line 1</div>
                    <div className='collection-content'>{data?.applicantId?.permanentAddress?.addressLine1 || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Address Line 2</div>
                    <div className='collection-content'>{data?.applicantId?.permanentAddress?.addressLine2 || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>Area</div>
                    <div className='collection-content'>{data?.applicantId?.permanentAddress?.area || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>City</div>
                    <div className='collection-content'>{data?.applicantId?.permanentAddress?.city || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>State</div>
                    <div className='collection-content'>{data?.applicantId?.permanentAddress?.state || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>Country</div>
                    <div className='collection-content'>{data?.applicantId?.permanentAddress?.country || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={6} sm={24} xs={24} lg={6} md={6}>
                    <div className='collection-title'>Pincode</div>
                    <div className='collection-content'>{data?.applicantId?.permanentAddress?.pincode || "--"}</div>
                  </Col>
                </Row>
              </Col>

              <Col style={{ border: "1px solid lightgray", borderRadius: 6 }} xl={5} sm={24} lg={5} xs={24} md={5}>
                <div className='heading-collection1'>
                  Payment Details
                </div>
                {paymentScreen === true ? <>
                  <Form style={{ padding: "5%" }} layout='vertical'>
                    <Form.Item name="modeofpayment" label="Mode Of Payment"
                      rules={[{
                        require: true,
                        message: "Please Select",
                      }]}>
                      <Select placeholder="Select Mode Of Payment" value={paymentMode} onChange={(value) => setPaymentMode(value)} className='select-collection'>
                        {data?.bankDetails?.repaymentPreference === "enach" || data?.bankDetails?.repaymentPreference === "auto-debit" ? <><Select.Option value="enach">E-NACH</Select.Option></> : ""}
                        <Select.Option value="Cash">Cash</Select.Option>
                        <Select.Option value="Cheque">Cheque</Select.Option>
                      </Select>
                    </Form.Item>
                    {paymentMode === "Cash" ?
                      <>
                        <Form.Item label="Total Amount" name="TotalAmount"
                          rules={[{
                            required: true,
                            message: "Total Amount is Required"
                          },
                          {
                            message: "only Numbers are allowed",
                            pattern: new RegExp(/^[0-9]*$/),
                          }
                          ]}>
                          <Input onChange={(e) => setAmount(e.target.value)} placeholder="Please Enter Total Amount" style={{ width: "98%" }} />
                        </Form.Item>
                        <table>
                          <th style={{ backgroundColor: "#D2E1FF", padding: 5 }}>Amount</th>
                          <th style={{ backgroundColor: "#D2E1FF", padding: 5 }}>Rupees</th>
                          <tbody>
                            {Object.entries(denominations).reverse().map(([denomination, value]) => (
                              <tr key={denomination}>
                                <td>{`₹${denomination}`} x
                                  <input
                                    style={{ borderBottom: '1px solid black', width: '60px', height: '15px' }}
                                    value={value}
                                    onChange={(e) => handleInputChange(denomination, parseInt(e.target.value) || 0)}
                                  />
                                </td>
                                <td>
                                  {value * denomination}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td>Total ₹</td>
                              <td>{totalAmount}</td>
                            </tr>
                          </tbody>
                        </table>
                        <Button onClick={paymentCash} style={{ width: "100%", marginTop: 10, backgroundColor: "#68BA7F", color: "white", border: "1px solid #68BA7F", borderRadius: 6 }}>Submit</Button>
                      </>
                      :
                      paymentMode === "Cheque" ? <>
                        <Form.Item label="Total Amount" name="TotalAmount" rules={[{
                          required: true,
                          message: "Total Amount is Required"
                        },
                        {
                          message: "only Numbers are allowed",
                          pattern: new RegExp(/^[0-9]*$/),
                        }]}>
                          <Input onChange={(e) => setChequeAmount(e.target.value)} placeholder="Please Enter Total Amount" style={{ width: "98%" }} />
                        </Form.Item>
                        <Form.Item label="Cheque Number" name="ChequeNumber" rules={[{
                          required: true,
                          message: "Cheque Number is Required"
                        }]}>
                          <Input onChange={(e) => setChequeNumber(e.target.value)} placeholder="Please Enter Cheque Number" style={{ width: "98%" }} />
                        </Form.Item>
                        <div className="upload-receipt" style={{ margin: "20px 0px 0px 0px", width: "50%" }}>
                          <Form.Item
                            name="paymentCheque"
                            rules={[
                              {
                                required: false,
                                message: `Please upload document`,
                              },
                            ]}
                          >
                            <Button
                              icon={files ? "" : <UploadOutlined />}
                              className="uploadbtn"
                            >
                              {uploadProgress > 0 && uploadProgress < 100 ? (
                                <Progress percent={uploadProgress} />
                              ) : files ? (
                                <div className="d-flex justify-content-between">
                                  <div>
                                    {imageUrl ? (
                                      <img
                                        style={{ width: "50px" }}
                                        src={imageUrl}
                                        alt="Uploaded"
                                        className="uploaded-image"
                                        onError={(e) => {
                                          e.target.src = "/path/to/placeholder-image.jpg";
                                        }}
                                      />
                                    ) : (
                                      <div>{files?.name}</div>
                                    )}
                                  </div>
                                  <div className="d-flex">
                                    <div className="uploadtextwrapper">
                                      <div className="filename">
                                        {files.name?.length > 8
                                          ? `${files.name?.substring(0, 10)}...`
                                          : files.name}
                                      </div>

                                      <div className="clicktoview" onClick={() => handlePreview()}>
                                        Click to view
                                      </div>
                                    </div>
                                    <CloseOutlined
                                      onClick={() => handleRemove()}
                                      className="remove-icon"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <Upload
                                  onChange={handleChange}
                                  showUploadList={false}
                                  beforeUpload={() => false}
                                >
                                  <div style={{ color: "#68BA7F" }}>Upload Cheque
                                    <p className="filetypetitle">
                                      Only .pdf, .jpg allowed. File limit is 5MB
                                    </p>
                                  </div>
                                </Upload>
                              )}
                            </Button>
                          </Form.Item>
                        </div>
                        <Button onClick={paymentCheque} style={{ width: "100%", marginTop: 10, backgroundColor: "#68BA7F", color: "white", border: "1px solid #68BA7F", borderRadius: 6 }}>Submit</Button>
                      </> : ""}
                  </Form>
                </> :
                  <>
                    <div style={{ padding: 10 }}>
                      <div style={{ fontSize: 16, color: "#1dba1d", fontWeight: 500 }}>Online Payment Success !</div>
                      <br />
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 10, color: "#68BA7F", gap: 10 }}>
                        <div>&#x2022; Payment Date</div>:<div>{dayjs(successPayment?.paymentDate).format("YYYY-MM-DD")}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 10, color: "#68BA7F", gap: 10 }}>
                        <div>&#x2022; Payment Amount</div>:<div>{successPayment?.paymentAmount}/-</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 10, color: "#68BA7F", gap: 10 }}>
                        <div>&#x2022; Payment ID</div>:<div>{successPayment?.paymentId}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 10, color: "#68BA7F", gap: 10 }}>
                        <div>&#x2022; Payment Method</div>:<div>{successPayment?.paymentMethod}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row", marginTop: 20, gap: 10 }}>
                        <Button onClick={shareReceipt} style={{ color: "#68BA7F", border: "1px solid #68BA7F", borderRadius: 6 }}>Share Receipt</Button>
                        <Button onClick={() => setPdfView(true)} style={{ backgroundColor: "#68BA7F", color: "white", border: "1px solid #68BA7F", borderRadius: 6 }}>View Receipt</Button>
                      </div>
                    </div>
                  </>}
              </Col>

              <Col style={{ border: "1px solid lightgray", borderRadius: 6, margin: "2% 0%" }} xl={9} sm={24} lg={9} xs={24} md={9}>
                <div className='heading-collection'>
                  Bank Details
                </div>
                <Row style={{ padding: "1%" }}>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Bank Name</div>
                    <div className='collection-content'>{data?.bankDetails?.bankName || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>IFSC Code</div>
                    <div className='collection-content'>{data?.bankDetails?.ifscCode || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Account Holder Name</div>
                    <div className='collection-content'>{data?.bankDetails?.accountHolderName || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Account Number</div>
                    <div className='collection-content'>{data?.bankDetails?.accountNumber || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Account Type</div>
                    <div className='collection-content'>{data?.bankDetails?.accountType || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Branch Name</div>
                    <div className='collection-content'>{data?.bankDetails?.branchName || "--"}</div>
                  </Col>
                </Row>
              </Col>
              <Col style={{ border: "1px solid lightgray", borderRadius: 6, margin: "2% 0%" }} xl={9} sm={24} lg={9} xs={24} md={9}>
                <div className='heading-collection'>
                  EMI Details
                </div>
                <Row style={{ padding: "1%" }}>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Loan Type</div>
                    <div className='collection-content'>{data?.EmiDetails?.loanType?.value || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Loan Tenure</div>
                    <div className='collection-content'>{`${data?.EmiDetails?.loanTenure} Months` || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Total Installment</div>
                    <div className='collection-content'>{data?.EmiDetails?.totalInstallment || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Loan Start Date</div>
                    <div className='collection-content'>{dayjs(data?.EmiDetails?.loanStartDate).format("DD MMM YYYY") || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Due Date</div>
                    <div className='collection-content'>{dayjs(data?.EmiDetails?.dueDate).format("DD MMM YYYY") || "--"}</div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Outstanding Loan Amount</div>
                    <div className='collection-content'><CurrencyFormat thousandSpacing='2s' value={data?.EmiDetails?.outStandingLoanAmount || 0} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></div>
                  </Col>
                  <Col className='column-collection' xl={12} sm={24} xs={24} lg={12} md={12}>
                    <div className='collection-title'>Repayment Frequency</div>
                    <div className='collection-content'>{`${data?.EmiDetails?.repaymentFrequency} Days` || "--"}</div>
                  </Col>
                </Row>
              </Col>
              <Col style={{ border: "1px solid lightgray", borderRadius: 6, margin: "2% 0%" }} xl={18} sm={24} lg={18} xs={24} md={18}>
                <div className='heading-collection'>
                  <div>
                    Amortization Schedule
                  </div>
                  <div>
                    <Button onClick={viewCollectionTable} className='view-btn'>
                      View
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </> :
          <>
            <div className="collection-header">
              <div>Collection Details</div>
              <div style={{ cursor: "pointer" }} onClick={() => setShow(true)}><CloseOutlined /></div>
            </div>
            <div style={{ padding: "3%" }}>
              <Row>
                <Col className='row-data-collection' xl={8} md={8} xs={12} sm={12} lg={8}>
                  <div className='title-view'>Applicant Name</div>:
                  <div className='content-view'>{CollectionView?.name || "--"}</div>
                </Col>
                <Col className='row-data-collection' xl={8} md={8} xs={12} sm={12} lg={8}>
                  <div className='title-view'>Outstanding Loan Amount</div>:
                  <div className='content-view'><CurrencyFormat thousandSpacing='2s' value={CollectionView?.loanAmount || 0} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></div>
                </Col>
                <Col className='row-data-collection' xl={8} md={8} xs={12} sm={12} lg={8}>
                  <div className='title-view'>Installment Amount</div>:
                  <div className='content-view'><CurrencyFormat thousandSpacing='2s' value={CollectionView?.installmentAmount || 0} displayType={'text'} thousandSeparator={true} prefix={'₹'} /></div>
                </Col>
                <Col className='row-data-collection' xl={8} md={8} xs={12} sm={12} lg={8}>
                  <div className='title-view'>Disbursement Date</div>:
                  <div className='content-view'>{dayjs(CollectionView?.disbursementDate).format("DD-MM-YYYY") || "--"}</div>
                </Col>
                <Col className='row-data-collection' xl={8} md={8} xs={12} sm={12} lg={8}>
                  <div className='title-view'>Frequency</div>:
                  <div className='content-view'>{CollectionView?.frequency || "--"}</div>
                </Col>
                <Col className='row-data-collection' xl={8} md={8} xs={12} sm={12} lg={8}>
                  <div className='title-view'>Interest</div>:
                  <div className='content-view'>{CollectionView?.interest || "--"}</div>
                </Col>
              </Row>
              <Table className='table-wrap-view' style={{ marginTop: 30 }} dataSource={collectionData} columns={columns} />
            </div>
          </>
        }
      </div>
      <Modal
        visible={previewVisible}
        onCancel={handleCancelPreview}
        footer={null}
      >
        {previewUrl && previewUrl.includes(".pdf") ? (
          <embed
            src={previewUrl}
            type="application/pdf"
            width="100%"
            height="600px"
          />
        ) : (
          <img
            alt="Preview"
            style={{ width: "100%", height: "300px", padding: 20 }}
            src={previewUrl}
          />
        )}
      </Modal>
      <Modal
        visible={pdfView}
        onCancel={handleCancelPreviewPdf}
        footer={null}
      >
        <embed width="100%"
          height="600px" src={pdfReceipt} frameborder="0"></embed>
      </Modal>
    </>
  )
}

export default CollectionView