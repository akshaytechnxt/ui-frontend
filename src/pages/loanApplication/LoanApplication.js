import {
	Button,
	Col,
	Form,
	Progress,
	Row,
	Tabs,
	Upload,
	message,
	Modal
} from "antd";
import "./LoanApplication.css";
import TabsComp from "../../pages/tabs/Tabs"
import { UploadOutlined, CloseOutlined, FileDoneOutlined } from "@ant-design/icons";
import ApplicationDetails from "./ApplicationDetails";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sdloader from "../../components/Loader/FullPageLoader";
import axiosRequest from "../../axios-request/API.request";
import moment from "moment";
import axios from "axios";
import Config from "../../config/api.config";
import { useSelector } from "react-redux";
import NoRecordsFound from "../tabs/NoRecordsFound";

const { baseURL } = Config;

const LoanApplication = () => {
	const location = useLocation();
	const { state } = location;
	const isPendingQueryList = state && state?.isPendingQueryList;
	const proposalid = state?.proposalId
	const token = useSelector((state) => state?.user?.userData?.data?.data?.jwt);
	const proposalId = useSelector(
		(state) => state?.fetchProposal?.proposal?.data?.data?._id
	);
	const [size, setSize] = useState('small');
	const [activeTab, setActiveTab] = useState("Application");
	const [loading, setLoading] = useState(false)
	const [queryData, setQueryData] = useState([]);
	const [form] = Form.useForm();
	const [files, setFiles] = useState([]);
	const [imageUrl, setImageUrl] = useState([]);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [discrepancyArray, setDisrepencyArray] = useState([])
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [viewButtonDisabled, setViewButtonDisabled] = useState(false);
	const [applicationTab, setApplicationTab] = useState(false)
	const [queriesTab, setQueriesTab] = useState(null)

	const handleTab = (key) => {
		setActiveTab(key);
		fetchQueryData()
	};

	useEffect(() => {
		if (isPendingQueryList) {
			setActiveTab("Queries & Approvals");
			setApplicationTab(true)
			fetchQueryData()
		} else {
			setActiveTab("Application");
			setApplicationTab(false)
		}
	}, [isPendingQueryList]);

	const fetchQueryData = () => {
		if (isPendingQueryList) {
			var proposalID = proposalid
		}
		else {
			var proposalID = proposalId
		}
		setLoading(true);
		axiosRequest.get(`proposal/quality-check/get-lo-queries?proposalId=${proposalID}`)
			.then((response) => {
				console.log(response?.data?.data?.length, "sriram")
				if (response?.data?.msg === "Data retrieved successfully" && response?.data?.data?.length > 0) {
					setQueriesTab(true)
				}
				else {
					setQueriesTab(false)
				}
				console.log("res", response?.data?.data);
				const data = response?.data?.data || [];
				const dataArray = Array.isArray(data) ? data : [data];
				setQueryData(dataArray);
				setDisrepencyArray(data)
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	};

	const handleChange = (info, discrepancyId) => {
		const { file } = info;
		if (!file) {
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

		setFiles(prevFiles => ({
			...prevFiles,
			[discrepancyId]: file
		}));

		setImageUrl(prevImageUrl => ({
			...prevImageUrl,
			[discrepancyId]: URL.createObjectURL(file)
		}));
	};

	const handleRemove = (discrepancyId) => {
		const updatedFiles = { ...files };
		delete updatedFiles[discrepancyId];
		const updatedImageUrl = { ...imageUrl };
		delete updatedImageUrl[discrepancyId];
		setFiles(updatedFiles);
		setImageUrl(updatedImageUrl);
		setUploadProgress(0);
	}

	const handlePreview = (discrepancyId, name) => {
		setPreviewUrl({ image: imageUrl[discrepancyId], name: name });
		setPreviewVisible(true);
		setViewButtonDisabled(true);
	};
	const handleCancelPreview = () => {
		setPreviewVisible(false);
		setPreviewUrl(null);
		setViewButtonDisabled(false);
	};

	const uploadDocumentHandler = async (item, discrepancyId) => {
		console.log(item, item?.document?.key, "item")
		if (proposalid != undefined || proposalid != null) {
			var proposalID = proposalid
		}
		else {
			var proposalID = proposalId
		}
		try {
			const formData = new FormData();
			formData.append("file", files[discrepancyId]);
			formData.append("proposalId", `${proposalID}`);
			formData.append("discrepancyId", `${item?.discrepancyId}`);

			if (item?.type === 'document') {
				formData.append("documentId", `${item?.document?.id}`);
			}

			const headers = {
				Authorization: `Bearer ${token}`,
				"Content-Type": "multipart/form-data",
			};

			if (item?.type === "document") {
				var axiosConfig = `${baseURL}proposal/quality-check/disperancy_upload_doc`
			}
			else {
				var axiosConfig = `${baseURL}proposal/quality-check/disperancy_upload_info`
			}

			const response = await axios.post(
				axiosConfig,
				formData,
				{
					headers,
				}
			);
			fetchQueryData();
			message.success(response?.data?.data?.msg);
			const updatedFiles = [...files];
			updatedFiles[discrepancyId] = null;
			setFiles(updatedFiles);
		} catch (error) {
			console.error("API Error:", error);
		}
	};

	const QueriesApprovalsDetails = () => {
		return (
			<>
				{loading && <Sdloader sdloader={loading} />}
				{queriesTab ? <Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
					<div className="loandetailstitle" style={{ padding: '15px' }}>List of Pending Queries & Approvals</div>
					{loading && <Sdloader sdloader={loading} />}
					{discrepancyArray?.map((item) => (
						<Col xs={24} sm={24} md={24} lg={24} xl={24} key={item?.discrepancyId}>
							<div style={{ margin: "1%", padding: "1% 1%", border: "1px solid #D2E1FF", borderRadius: "6px" }}>
								<Row style={{ display: "flex", alignItems: "center", alignContent: "center" }}>
									<Col xs={8} sm={8} md={2} lg={2} xl={2}>
										<div style={{ color: "#737373", fontSize: 12 }}>Case ID</div>
										<div style={{ color: "black", fontSize: 14, fontWeight: "500" }}>{queryData[0]?.caseId}</div>
									</Col>
									<Col xs={8} sm={8} md={4} lg={4} xl={4}>
										<div style={{ color: "#737373", fontSize: 12 }}>Date & Time</div>
										<div style={{ color: "black", fontSize: 14, fontWeight: "500" }}>{moment(item?.updatedAt).format('DD MMMM YYYY, h:mm A')}</div>
									</Col>
									<Col xs={8} sm={8} md={6} lg={6} xl={6}>
										<div style={{ color: "#737373", fontSize: 12 }}>Query Description</div>
										<div style={{ color: "black", fontSize: 14, fontWeight: "500" }}>{item?.description}</div>
									</Col>
									<Col xs={12} sm={12} md={7} lg={7} xl={7} style={{ marginTop: 15 }} className="uploaddata p-0">
										<Form.Item
											name={item?.document?.key}
											rules={[
												{
													required: false,
													message: `Please upload document`,
												},
											]}
										>
											<Button
												onChange={(info) => handleChange(info, item?.discrepancyId)}
												icon={files[item?.discrepancyId] ? "" : <UploadOutlined />}
												className="uploadbtn"
											>
												{uploadProgress > 0 && uploadProgress < 100 ? (
													<Progress percent={uploadProgress} />
												) : files[item?.discrepancyId] ? (
													<div className="d-flex justify-content-between">
														<div>
															{files[item?.discrepancyId].type.startsWith("image/") ? ( // Check if file type is image
																<img
																	src={imageUrl[item?.discrepancyId]}
																	alt="Uploaded"
																	className="uploaded-image"
																	onError={(e) => {
																		e.target.src = "/path/to/placeholder-image.jpg";
																	}}
																/>
															) : (
																// Display PDF instead of image
																// <img src={files[item?.discrepancyId]?.name} type="application/pdf" width="200" height="200" />
																<FileDoneOutlined style={{ fontSize: 30 }} />
															)}
														</div>
														<div className="d-flex">
															<div className="uploadtextwrapper">
																<div className="filename">
																	{files[item?.discrepancyId].name?.length > 8
																		? `${files[item?.discrepancyId].name?.substring(0, 20)}...`
																		: files[item?.discrepancyId].name}
																</div>
																<div className="clicktoview" onClick={() => handlePreview(item?.discrepancyId, files[item?.discrepancyId].name)}>
																	Click to view
																</div>
															</div>
															<CloseOutlined
																onClick={() => handleRemove(item?.discrepancyId)}
																className="remove-icon"
															/>
														</div>
													</div>
												) : (
													<Upload
														className="upload-query-icon"
														onChange={(info) => handleChange(info, item?.discrepancyId)}
														showUploadList={false}
														beforeUpload={() => false}
													>
														<div style={{ color: "#003399" }}>Upload Declaration Form
															<p className="filetypetitle">
																Only .pdf, .jpg allowed. File limit is 5MB
															</p>
														</div>
													</Upload>
												)}
											</Button>
										</Form.Item>
									</Col>
									<Col style={{ display: "flex", justifyContent: "center" }} xs={12} sm={12} md={5} lg={5} xl={5}>
										<Button className="savebtn" onClick={() => uploadDocumentHandler(item, item?.discrepancyId)}>Submit</Button>
									</Col>
								</Row>
							</div>
						</Col>
					))}
				</Row> : <NoRecordsFound />}
				<Modal
					visible={previewVisible}
					onCancel={handleCancelPreview}
					footer={null}
				>
					{previewUrl?.image && previewUrl?.name?.includes(".pdf") ? (
						<embed
							src={previewUrl?.image}
							type="application/pdf"
							width="100%"
							height="600px">
						</embed>
					) : (
						<img
							src={previewUrl?.image}
							width="100%"
							height="600px">
						</img>
					)}
				</Modal>
			</>
		);
	};

	return (
		<>
			<TabsComp header="Application" showBreadCrum={true} />
			<div style={{ margin: "3% 3%" }}>

				<Tabs className='tab-query' type="card" activeKey={activeTab} size={size} onChange={handleTab}>
					<Tabs.TabPane disabled={applicationTab} tab="Application" key="Application">
						<ApplicationDetails
							//  currentStep={currentStep}
							// handlePrevious={handlePrevious}
							form={form}
							activeTab={activeTab}
							applicantData={state?.applicantData}
						/>

					</Tabs.TabPane>

					<Tabs.TabPane tab="Queries & Approvals" key="Queries & Approvals">
						<QueriesApprovalsDetails />
					</Tabs.TabPane>
				</Tabs>

			</div>
		</>
	);
};

export default LoanApplication;
