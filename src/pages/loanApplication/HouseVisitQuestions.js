import React, { useEffect, useState } from 'react';
import {
	Card,
	Col,
	Form,
	Input,
	Progress,
	Row,
	Radio
} from "antd";
import './HouseVisitQuestions.css'
import { useSelector } from "react-redux";

const HouseVisitQuestions = ({ setProposalAssessment, form }) => {
	const storedata = useSelector(
		(state) => state?.fetchProposal?.proposal?.data?.data?.proposalAssessment
	);

	const [mandatory, setmandatory] = useState(false)
	const [customerId, setCustomerId] = useState(null)

	useEffect(() => {
		const initialValues = {};
		storedata?.forEach((item) => {
			const score = calculateScore(item.qID, item.value);
			initialValues[item.qID] = { value: item?.value, qID: item.qID, score: score };
		});
		if (storedata?.length === 0) {
			setProposalAssessment({})
			setmandatory(true)
		} else {
			setmandatory(false)
			setProposalAssessment(initialValues)
		}
		if (storedata.find(item => item.qID === "11")?.value == "Yes") {
			setCustomerId(true)
		}
		else {
			setCustomerId(false)
		}
	}, [storedata]);

	const calculateScore = (qID, value) => {
		switch (qID) {
			case "1":
				return getScore(value);
			case "2":
				return getScore2(value);
			case "3":
				return getScore3(value);
			case "4":
				return getScore4(value);
			case "5":
				return getScore5(value);
			case "6":
				return getScore6(value);
			case "7":
				return getScore7(value);
			case "8":
				return getScore8(value);
			case "9":
				return getScore9(value);
			case "10":
				return getScore10(value);
			case "11":
				return getScore11(value);
			case "13":
				return getScore13(value);
			case "14":
				return getScore14(value);
			default:
				return 0;
		}
	};

	const handleChange = (qID, value, score) => {
		if (qID === '11' && value === 'Yes') {
			setCustomerId(true)
		}
		else if (qID === '11' && value === 'No') {
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

	const getScore = (value) => {
		switch (value) {
			case "None":
				return 25;
			case "One":
				return 20;
			case "Two":
				return 15;
			case "Three":
				return 10;
			case "Four":
				return 5;
			case "Five and More":
				return 0;
			default:
				return 0;
		}
	};

	const getScore2 = (value) => {
		switch (value) {
			case "Labourers":
				return 0;
			case "Other":
				return 10;
			case "Professionals":
				return 15;
			default:
				return 0; // Default score
		}
	};

	const getScore3 = (value) => {
		switch (value) {
			case "Rented House / Kachha House":
				return 0;
			case "Pakka":
				return 5;
			default:
				return 0; // Default score
		}
	};

	const getScore4 = (value) => {
		switch (value) {
			case "Firewood and chips, charcol, or none":
				return 0;
			case "Others":
				return 5;
			case "LPG":
				return 15;
			default:
				return 0;
		}
	};

	const getScore5 = (value) => {
		switch (value) {
			case "Yes":
				return 5;
			case "No":
				return 0;
			default:
				return 0;
		}
	};

	const getScore6 = (value) => {
		switch (value) {
			case "No":
				return 0;
			case "Cycle":
				return 3;
			case "Scooter or Motor Cycle":
				return 6;
			default:
				return 0;
		}
	};

	const getScore7 = (value) => {
		switch (value) {
			case "Yes":
				return 3;
			case "No":
				return 0;
			default:
				return 0;
		}
	};

	const getScore8 = (value) => {
		switch (value) {
			case "No":
				return 0;
			case "Governament School":
				return 3;
			case "Private Schools / College":
				return 6;
			default:
				return 0; // Default score
		}
	};

	const getScore9 = (value) => {
		switch (value) {
			case "None":
				return 0;
			case "Feature Phone":
				return 5;
			case "Smart Phone":
				return 10;
			default:
				return 0; // Default score
		}
	}

	const getScore10 = (value) => {
		switch (value) {
			case "None":
				return 0;
			case "One":
				return 5;
			case "Two or more / AC / Cooler":
				return 10;
			default:
				return 0; // Default score
		}
	};

	const getScore11 = (value) => {
		switch (value) {
			case "Yes":
				return 5;
			case "No":
				return 0;
			default:
				return 0;
		}
	};

	const getScore14 = (value) => {
		switch (value) {
			case "Yes":
				return 0;
			case "No":
				return 5;
			default:
				return 0;
		}
	};

	const getScore13 = (value) => {
		if (value >= 3 && value < 10) {
			return 5;
		} else if (value >= 10) {
			return 10;
		} else {
			return 0;
		}
	};

	console.log(customerId, storedata, "akshay")

	return (
		<>
			<Row gutter={[16, { xs: 16, sm: 10, md: 16, lg: 16 }]}>
				<Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ display: window.innerWidth >= 768 ? 'flex' : 'block', flexDirection: window.innerWidth >= 768 ? 'row' : '', justifyContent: window.innerWidth >= 768 ? 'space-between' : 'inherit' }}>
					<div className="loandetailstitle">5- House Visit Review </div>
					<div className={`${window.innerWidth >= 768 ? 'd-flex flex-column' : ''}`} style={{ width: window.innerWidth >= 768 ? "40%" : "100%" }}>
						<div className={window.innerWidth >= 768 ? 'currentprogress' : 'currentprogress-hide'}>
							Current Progress
						</div>
						<div style={{ display: window.innerWidth >= 768 ? 'flex' : 'block' }}>
							<Progress percent={60} strokeColor="#68BA7F" />
						</div>
					</div>
				</Col>
				<Col xs={24} sm={24} md={24} lg={24} xl={24}>
					<Form layout='vertical' form={form}>
						<Card className='card-shadow'>
							<Form.Item name="1" label={<label className="loandetailstitle">1. How many people aged less than 18 years are in the household?"</label>}
								rules={[
									{
										required: mandatory ? true : false,
										message: "Please Select",
									},
								]}>
								<div className='radio-btns'>
									<Radio.Group defaultValue={storedata.find(item => item.qID === "1")?.value || ""} onChange={(e) => handleChange("1", e.target.value, getScore(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
										<Radio.Button value="None">None</Radio.Button>
										<Radio.Button value="One">One</Radio.Button>
										<Radio.Button value="Two">Two</Radio.Button>
										<Radio.Button value="Three">Three</Radio.Button>
										<Radio.Button value="Four">Four</Radio.Button>
										<Radio.Button value="Five and More">Five and More</Radio.Button>
									</Radio.Group>
								</div>
							</Form.Item>
						</Card>
						<Card className='card-shadow'>
							<Form.Item name="2" label={<label className="loandetailstitle">2. What is the household's principal occupation? </label>}
								rules={[
									{
										required: mandatory ? true : false,
										message: "Please Select",
									},
								]}>
								<div className='radio-btns'>
									<Col sm={24} xs={24} md={24} lg={24} xl={24} >
										<Radio.Group defaultValue={storedata.find(item => item.qID === "2")?.value || ""} onChange={(e) => handleChange("2", e.target.value, getScore2(e.target.value))} buttonStyle="solid" className="vertical-radio-group" size="large">
											<Radio.Button value="Labourers">
												<div style={{ display: "flex" }}>
													<div>a.</div>
													<div>Labourers (agricultural, plantation, other farm), hunters, tobacco preparers and tobacco product makers,and other labourers</div>
												</div>
											</Radio.Button>
											<Radio.Button value="Other">b.&nbsp;Other</Radio.Button>
											<Radio.Button value="Professionals">
												<div style={{ display: "flex" }}>
													<div>c.</div>
													<div style={{ overflow: "hidden", wordWrap: "break-word", height: "auto" }}>Professionals,technicians,clerks,administrators,managers,executives,directors,supervisors, and teachers</div>
												</div>
											</Radio.Button>
										</Radio.Group>
									</Col>
								</div>
							</Form.Item>
						</Card>
						<Card className='card-shadow'>
							<Form.Item name="3" label={<label className="loandetailstitle">3. Is the residence of rented house/ kachha or pakka (burnt bricks, stone, cement, concrete,jackboard / cement-plastered reeds, timber, tiles, galvanised tin or asbestos cement sheets)? </label>}
								rules={[
									{
										required: mandatory ? true : false,
										message: "Please Select",
									},
								]}>
								<div className='radio-btns'>
									<Radio.Group defaultValue={storedata.find(item => item.qID === "3")?.value || ""} onChange={(e) => handleChange("3", e.target.value, getScore3(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
										<Radio.Button value="Rented House / Kachha House">Rented House / Kachha House</Radio.Button>
										<Radio.Button value="Pakka">Pakka</Radio.Button>
									</Radio.Group>
								</div>
							</Form.Item>
						</Card>
						<Card className='card-shadow'>
							<Form.Item name="4" label={<label className="loandetailstitle">4. What is the household's primary source of energy for cooking?</label>}
								rules={[
									{
										required: mandatory ? true : false,
										message: "Please Select",
									},
								]}>
								<div className='radio-btns'>
									<Radio.Group defaultValue={storedata.find(item => item.qID === "4")?.value || ""} onChange={(e) => handleChange("4", e.target.value, getScore4(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
										<Radio.Button value="Firewood and chips, charcol, or none">Firewood and chips, charcol, or none</Radio.Button>
										<Radio.Button value="Others">Others</Radio.Button>
										<Radio.Button value="LPG">LPG</Radio.Button>
									</Radio.Group>
								</div>
							</Form.Item>
						</Card>
						<Card className='card-shadow'>
							<Form.Item name="5" label={<label className="loandetailstitle">5. Does the household own a television? </label>}
								rules={[
									{
										required: mandatory ? true : false,
										message: "Please Select",
									},
								]}>
								<div className='radio-btns'>
									<Radio.Group defaultValue={storedata.find(item => item.qID === "5")?.value || ""} buttonStyle="solid" onChange={(e) => handleChange("5", e.target.value, getScore5(e.target.value))} className='horizantal-btns' size="large">
										<Radio.Button value="Yes">Yes</Radio.Button>
										<Radio.Button value="No">No</Radio.Button>
									</Radio.Group>
								</div>
							</Form.Item>
						</Card>
						<Card className='card-shadow'>
							<Form.Item name="6" label={<label className="loandetailstitle">6. Does the household own a, cycle,scooter, or motor cycle? </label>}
								rules={[
									{
										required: mandatory ? true : false,
										message: "Please Select",
									},
								]}>
								<div className='radio-btns'>
									<Radio.Group defaultValue={storedata.find(item => item.qID === "6")?.value || ""} onChange={(e) => handleChange("6", e.target.value, getScore6(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
										<Radio.Button value="No">No</Radio.Button>
										<Radio.Button value="Cycle">Cycle</Radio.Button>
										<Radio.Button value="Scooter or Motor Cycle">Scooter or Motor Cycle</Radio.Button>
									</Radio.Group>
								</div>
							</Form.Item>
						</Card>
						<Card className='card-shadow'>
							<Form.Item name="7" label={<label className="loandetailstitle">7. Does the household own aalmirah / dressing table?</label>}
								rules={[
									{
										required: mandatory ? true : false,
										message: "Please Select",
									},
								]}>
								<div className='radio-btns'>
									<Radio.Group defaultValue={storedata.find(item => item.qID === "7")?.value || ""} buttonStyle="solid" onChange={(e) => handleChange("7", e.target.value, getScore7(e.target.value))} className='horizantal-btns' size="large">
										<Radio.Button value="Yes">Yes</Radio.Button>
										<Radio.Button value="No">No</Radio.Button>
									</Radio.Group>
								</div>
							</Form.Item>
						</Card>
						<Card className='card-shadow'>
							<Form.Item label={<label className='loandetailstitle'>8. Does anyone study at home? </label>} name="8"
								rules={[
									{
										required: mandatory ? true : false,
										message: "Please Select",
									},
								]}>
								<div className='radio-btns'>
									<Radio.Group defaultValue={storedata.find(item => item.qID === "8")?.value || ""} buttonStyle="solid" onChange={(e) => handleChange("8", e.target.value, getScore8(e.target.value))} className='horizantal-btns' size="large">
										<Radio.Button value="No">No</Radio.Button>
										<Radio.Button value="Government School">Government School</Radio.Button>
										<Radio.Button value="Private Schools / College">Private Schools / College</Radio.Button>
									</Radio.Group>
								</div>
							</Form.Item>
						</Card>
						<Card className='card-shadow'>
							<Form.Item name="9" label={<label className="loandetailstitle">9. What kind of phones does the household own? </label>}
								rules={[
									{
										required: mandatory ? true : false,
										message: "Please Select",
									},
								]}>
								<div className='radio-btns'>
									<Radio.Group defaultValue={storedata.find(item => item.qID === "9")?.value || ""} buttonStyle="solid" onChange={(e) => handleChange("9", e.target.value, getScore9(e.target.value))} className='horizantal-btns' size="large">
										<Radio.Button value="None">None</Radio.Button>
										<Radio.Button value="Feature Phone">Feature Phone</Radio.Button>
										<Radio.Button value="Smart Phone">Smart Phone</Radio.Button>
									</Radio.Group>
								</div>
							</Form.Item>
						</Card>
						<Card className='card-shadow'>
							<Form.Item name="10" label={<label className="loandetailstitle">10. How many electric fans does the household own? </label>}
								rules={[
									{
										required: mandatory ? true : false,
										message: "Please Select",
									},
								]}>
								<div className='radio-btns'>
									<Radio.Group defaultValue={storedata.find(item => item.qID === "10")?.value || ""} buttonStyle="solid" onChange={(e) => handleChange("10", e.target.value, getScore10(e.target.value))} className='horizantal-btns' size="large">
										<Radio.Button value="None">None</Radio.Button>
										<Radio.Button value="One">One</Radio.Button>
										<Radio.Button value="Two or more / AC / Cooler">Two or more / AC / Cooler</Radio.Button>
									</Radio.Group>
								</div>
							</Form.Item>
						</Card>

						<Card className='card-shadow'>
							<Form.Item name="11" label={<label className="labletitle">11. Are you an existing Customer?</label>}
								rules={[
									{
										required: mandatory ? true : false,
										message: "Please Select",
									},
								]}>
								<div className='radio-btns'>
									<Radio.Group defaultValue={storedata.find(item => item.qID === "11")?.value || ""} onChange={(e) => handleChange("11", e.target.value, getScore11(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
										<Radio.Button value="Yes">Yes</Radio.Button>
										<Radio.Button value="No">No</Radio.Button>
									</Radio.Group>
								</div>
							</Form.Item>
						</Card>
						{customerId === true && (storedata.find(item => item.qID === "11")?.value == "Yes" || storedata.find(item => item.qID === "11")?.value == undefined || storedata.find(item => item.qID === "11")?.value == "" || storedata.find(item => item.qID === "11")?.value == "No") ? <>
							<Card className='card-shadow'>
								<Form.Item name="12" label={<label className="labletitle">12. If Yes, Please provide your existing Customer ID/Loan ID?</label>}
									rules={[
										{
											required: mandatory ? true : false,
											message: "Please Select",
										},
									]}>
									<Input defaultValue={storedata.find(item => item.qID === "12")?.value || ""}
										onChange={(e) => handleChange("12", e.target.value, 0)} size="large" placeholder='Enter' />
								</Form.Item>
							</Card>

							<Card className='card-shadow'>
								<Form.Item name="13" label={<label className="labletitle">13.Since how many years have you been associated with this financial institution?</label>}
									rules={[
										{
											required: mandatory ? true : false,
											message: "Please Select",
										},
									]}>
									<Input defaultValue={storedata.find(item => item.qID === "13")?.value || ""}
										onChange={(e) => handleChange("13", e.target.value, getScore13(e.target.value))} size="large" placeholder='Enter' />
								</Form.Item>
							</Card>

							<Card className='card-shadow'>
								<Form.Item name="14" label={<label className="labletitle">14. Have you or any of the directors/partners defaulted on any loans?</label>}
									rules={[
										{
											required: mandatory ? true : false,
											message: "Please Select",
										},
									]}>
									<div className='radio-btns'>
										<Radio.Group defaultValue={storedata.find(item => item.qID === "14")?.value || ""} onChange={(e) => handleChange("14", e.target.value, getScore14(e.target.value))} buttonStyle="solid" className='horizantal-btns' size="large">
											<Radio.Button value="Yes">Yes</Radio.Button>
											<Radio.Button value="No">No</Radio.Button>
										</Radio.Group>
									</div>
								</Form.Item>
							</Card>
						</> : ""}
					</Form>
				</Col>
			</Row>
		</>
	)
}


export default HouseVisitQuestions