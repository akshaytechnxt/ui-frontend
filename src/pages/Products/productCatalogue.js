
import { React, useEffect, useState } from "react"
import { Breadcrumb, Radio, Row, Col, Card, Button, Image, Modal, Spin } from "antd";
import "../../components/Todo/ActivityCalendar.css"
import "../loanApplication/LoanApplication.css";
import axiosRequest from "../../axios-request/API.request"
import { ShareOutlined } from "@mui/icons-material";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import { saveAs } from 'file-saver';

function ProductCatalogue() {
    const [pdfDataUrl, setPdfUrl] = useState("");
    const [productType, setProductType] = useState([])
    const [selectedValue, setSelectedValue] = useState(null);
    const [loading, setLoading] = useState(false)
    const [selectedKey, setSelectedKey] = useState(null);
    const [selectedValue1, setSelectedValue1] = useState(null);
    const [selectedKey1, setSelectedKey1] = useState(null);
    const [productSubType, setProductSubType] = useState([])
    const [imageView, setImageView] = useState(true)

    const handleChange = (e) => {
        const selectedValue = e.target.value;
        const selectedItem = productType.find(item => item.productCategoryName === selectedValue);
        const selectedKey = selectedItem ? selectedItem._id : null;
        setSelectedValue(selectedValue);
        setSelectedKey(selectedKey);
    };

    const handleChange1 = (e) => {
        const selectedValue1 = e.target.value;
        const selectedItem = productSubType.find(item => item._id === selectedValue1);
        const selectedKey1 = selectedItem ? selectedItem : null;
        setSelectedValue1(selectedValue1);
        setSelectedKey1(selectedKey1);
        console.log(selectedKey1, "akshaysriram")
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosRequest.get("proposal/products/productTypes");
                setProductType(response?.data || [])
                setSelectedValue(response?.data?.[0] || [])
                setSelectedKey(response?.data?.[0] || [])
            } catch (error) {
            }
        };
        fetchProduct();
    }, []);

    useEffect(() => {
        const fetchProductSubType = async () => {
            if (!selectedValue) return;
            try {
                setLoading(true)
                const response = await axiosRequest.get(`proposal/products/getProductWithUrls/${selectedValue}`);
                setProductSubType(response?.data || [])
                setSelectedValue1(response?.data?.[0]._id || [])
                setSelectedKey1(response?.data?.[0] || [])
                const byteCharacters = atob(response?.data?.[0]?.brochuresFileData);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                setLoading(false)
            } catch (error) {
            }
        }
        fetchProductSubType()
    }, [selectedValue])

    const navigateLeft = () => {
        // setCurrentImageIndex(prevIndex => Math.max(prevIndex - 1, 0));
        setImageView(true)
    };

    const navigateRight = () => {
        setImageView(false)
        // setCurrentImageIndex(prevIndex => Math.min(prevIndex + 1, selectedKey1?.imgFileUrl?.length - 1));
    };

    const download = (base64Data, filename) => {
        const byteCharacters = atob(base64Data || "");
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        saveAs(blob, filename);
    };

    return (
        <>
            <Spin spinning={loading}>
                <div className="product-div-1">
                    <div style={{ paddingTop: '15px' }}>
                        <Breadcrumb style={{ color: "white" }} separator=">" className="breadcrumb">
                            <Breadcrumb.Item href="/dashboard"><div className='todo-text'>Dashboard</div></Breadcrumb.Item>
                            <Breadcrumb.Item ><div className='todo-text'>Resources</div></Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <div className="product-div-2">Products</div>
                    <div className="product-div-3">
                        <Radio.Group
                            style={{ display: "flex" }}
                            onChange={handleChange}
                            value={selectedValue}
                            className="radio-product"
                        >
                            {productType !== undefined ? productType?.map((item) => (
                                <Radio.Button key={item} value={item}>
                                    {item}
                                </Radio.Button>
                            )) : []}
                        </Radio.Group>
                    </div>
                </div>

                <div style={{ padding: "2%" }}>
                    <Row style={{ display: "flex", columnGap: 10 }}>
                        <Col xl={5} sm={24} md={5} xs={24} lg={5}>
                            <Card style={{ height: "100%" }} className="card-title-product">
                                <div className="title-card-product">
                                    {selectedValue}
                                </div>
                                <Radio.Group
                                    onChange={handleChange1}
                                    value={selectedValue1}
                                    className="radio-product1"
                                >
                                    {productSubType !== undefined ? productSubType?.map((item) => (
                                        <Radio.Button style={{}} key={item._id} value={item?._id}>
                                            {item.productName}
                                        </Radio.Button>
                                    )) : []}
                                </Radio.Group>
                                {/* {productSubType?.map((item) => (
                                <div className="title-card-sub-product">
                                    {item?.productName}
                                </div>
                            ))} */}
                            </Card>
                        </Col>
                        <Col xl={11} sm={24} md={11} xs={24} lg={11}>
                            <Card>
                                <div>
                                    <h4 style={{ color: "#003399" }}>{selectedKey1?.productName}</h4>
                                    <div className="title-subproduct">Description</div>
                                    <div dangerouslySetInnerHTML={{ __html: selectedKey1?.productDescription }} />
                                </div>
                            </Card>
                        </Col>
                        <Col xl={6} sm={24} md={6} xs={24} lg={6}>
                            <Card style={{ height: "100%" }}>
                                <div className="video-container">
                                    <div className="image-carousel-container">
                                        <div onClick={navigateLeft} className="arrow left-arrow">
                                            <LeftCircleOutlined />
                                        </div>
                                        <div className="video-wrapper">
                                            <div className="share-link">
                                                <ShareOutlined />
                                            </div>
                                            <div
                                                className="image-container"
                                                style={{
                                                    border: "10px solid #D2E1FF",
                                                    padding: "10px",
                                                    overflow: "scroll",
                                                    position: "relative",
                                                    height: 200,
                                                    width: "100%"
                                                }}
                                            >
                                                {imageView === true ?
                                                    <>
                                                        <img
                                                            src={selectedKey1?.imgFileUrl}
                                                            style={{ width: "100%", height: "100%" }}
                                                        />
                                                    </> :
                                                    <>
                                                        <video style={{ width: "100%", height: "100%" }} controls>
                                                            <source src={selectedKey1?.videoFileUrl} type="video/webm" />
                                                        </video>
                                                    </>}
                                                <>
                                                </>
                                            </div>
                                        </div>
                                        <div onClick={navigateRight} className="arrow right-arrow">
                                            <RightCircleOutlined />
                                        </div>
                                    </div>
                                </div>
                                <Row style={{ marginTop: 10 }}>
                                    <Col xl={22} md={22} lg={22} xs={22} sm={22}>
                                        <div>{selectedKey1?.brochuresTitle}</div>
                                        <iframe
                                            src={pdfDataUrl}
                                            type="application/pdf"
                                            width="100%"
                                            height="100%"
                                        />
                                        <Button onClick={() => download(selectedKey1?.brochuresFileData, selectedKey1?.brochuresTitle)} style={{ width: "98%", backgroundColor: "#003399", color: "white", borderRadius: 20, marginTop: 10 }}>Download</Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Spin>
        </>
    )
}
export default ProductCatalogue