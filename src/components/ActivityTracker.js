import * as React from "react";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { Radio, Button } from "antd"
import axiosRequest from "../axios-request/API.request.js";
import moment from "moment";
import "./Todo/ActivityCalendar.css"
import EventCreateComponent from "./CalendarEvent.js"
import Activity_Header from "./Activity_Tracker_Header.js";
import {
	Scheduler,
	WeekView,
	Toolbar,
	DayView,
	DateNavigator,
	Appointments,
	AllDayPanel,
	AppointmentTooltip,
	MonthView
} from "@devexpress/dx-react-scheduler-material-ui";
import { message, Row, Col } from "antd"
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
import { CloseOutlined, EditOutlined, PhoneOutlined, DeleteOutlined, CalendarOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { VideoCallOutlined } from "@mui/icons-material";


const Datescheduler = () => {
	const [data, setData] = useState([]);
	const format = "YYYY-MM-DD";
	let date = new Date();
	let today = moment(date).format(format);
	const [currentDate, setcurrentDate] = useState(today);
	const [appointmentTootip, setAppointmentTootip] = useState(false);
	const [state, setState] = useState({ currentViewName: 'Week' });
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [create_event, setCreate_event] = useState(false);
	const [editData, setEditData] = useState({});
	const [month, setMonth] = useState('');
	const [important, setImportant] = useState(false)
	const { currentViewName } = state;

	useEffect(() => {
		getScheduler();
	}, [month, isModalVisible, create_event]);

	useEffect(() => {
		const date = new Date();
		let currentMonth = date.getMonth();
		console.warn('current month-------->', currentMonth + 1);
		currentMonth++;
		if (currentMonth.toString().length == 1) {
			let num = '0' + currentMonth.toString();
			currentMonth = num;
		}
		setMonth(currentMonth);
	}, [])

	const showModal = (e) => {
		setAppointmentTootip(!appointmentTootip)
		setIsModalVisible(true);
		setEditData(e);
	};

	const getScheduler = async () => {
		if (month === '') return;
		const result = await axiosRequest.get(`activity/event/get?page=1&limit=1000&isImp=${important}`);
		const res = result?.data?.event_data?.map((item) => {
			const [startHours, startMinutes] = item?.meetingStartTime.split(":").map(Number);
			const startDate = new Date(item?.meetingStartDate);
			startDate.setHours(startHours);
			startDate.setMinutes(startMinutes);
			const [endHours, endMinutes] = item?.meetingEndTime.split(":").map(Number);
			const endDate = new Date(item?.meetingEndDate);
			endDate.setHours(endHours);
			endDate.setMinutes(endMinutes);

			const ret = {
				title: item.agenda,
				purposeType: item.purpose.purposeType,
				purposeSubType: item.purpose.purposeSubType,
				teamMembers: item.teamMembers,
				stackHolderName: item.stackHolders.entity_name,
				individualName: item.stackHolders.individual_name,
				stackHolderType: item.stackHolders.holderType,
				stackHolderMobile: item.stackHolders.mobile,
				startDate: startDate.toISOString(),
				endDate: endDate.toISOString(),
				id: item._id,
				location: item.location,
				mode: item.mode,
				meetingLocation: item.meetingLocation,
				Agenda: item.agenda,
				Minutes: item.duration,
				time: item.meetingStartTime,
				isImp: item.isImp
			};
			return ret;
		});
		setData(res);
	};

	useEffect(() => {
		getScheduler();
	}, [important])

	const deleteAppointment = (id) => {
		console.log(id, "akshay")
		axiosRequest.delete(`activity/event/delete/${id}`)
			.then((response) => {
				message.success("Task Deleted Successfully")
				setAppointmentTootip(!appointmentTootip);
				setImportant(!important);
				getScheduler()
			})
			.catch((error) => {
				console.error("Error fetching proposals:", error);
				throw error;
			}
			)
	}

	const handleImportant = (id) => {
		axiosRequest.put(`activity/event/update/${id}`, { isImp: true })
			.then((response) => {
				message.success("Task Updated Successfully");
				setAppointmentTootip(!appointmentTootip);
				setImportant(!important);
				getScheduler();
			})
			.catch((error) => {
				console.error("Error updating task:", error);
				throw error;
			});
	}

	const Appointment = ({
		children, style, ...restProps
	}) => {
		console.log(restProps, "akshay")
		return (
			<Appointments.Appointment
				{...restProps}
				style={{
					...style,
					backgroundColor: restProps?.data?.mode == "Phone Call" ? "#C9DAFD" : restProps?.data?.mode == "In-Person Meeting" ? "#28B1FF" : "#003399",
					color: restProps?.data?.mode == "Phone Call" ? "#003399" : restProps?.data?.mode == "In-Person Meeting" ? "white" : "white",
					borderRadius: '8px',
					textAlign: "center",
					display: "flex",
					justifyContent: "center"
				}
				}
			>
				<div style={{ display: "flex", alignItems: 'center' }} onClick={() => setAppointmentTootip(true)}>
					{restProps?.data?.mode == "Phone Call" ? <PhoneOutlined style={{ fontSize: 16, fontWeight: 500 }} /> : restProps?.data?.mode == "In-Person Meeting" ? <CalendarOutlined style={{ fontSize: 16, fontWeight: 500 }} /> : <VideoCallOutlined style={{ fontSize: 16, fontWeight: 500 }} />}
					<div className="activity-title1" style={{ marginLeft: "3px" }}>{restProps.data.title}</div>
				</div>
			</Appointments.Appointment >
		)
	};

	const Content = (({ ...restProps }) => {
		console.log(restProps, "akshay")
		return (
			<AppointmentTooltip.Content {...restProps}>
				<div style={{ display: "flex", flexDirection: "row", float: "right" }}>
					<div style={{ display: 'flex', width: "50px", cursor: "pointer", justifyContent: 'center' }} onClick={() => handleImportant(restProps?.appointmentData.id)}>
						{restProps?.appointmentData.isImp === false ? <StarOutlined style={{ fontSize: 14, backgroundColor: "white", color: "black" }} />
							: <StarFilled style={{ fontSize: 14, color: "yellow" }} />}
					</div>
					<div style={{ height: 15, width: 1, backgroundColor: 'grey' }}></div>
					<div style={{ display: 'flex', width: "50px", cursor: "pointer", justifyContent: 'center' }} onClick={() => deleteAppointment(restProps?.appointmentData.id)}>
						<DeleteOutlined style={{ fontSize: 14, color: "red" }} />
					</div>
					<div style={{ height: 15, width: 1, backgroundColor: 'grey' }}></div>
					<div style={{ display: 'flex', width: "50px", cursor: "pointer", justifyContent: 'center' }} onClick={() => showModal(restProps?.appointmentData)}>
						<EditOutlined style={{ fontSize: 14, color: "#003399" }} />
					</div>
					<div style={{ height: 15, width: 1, backgroundColor: 'grey' }}></div>
					<div style={{ display: 'flex', width: "50px", cursor: "pointer", justifyContent: 'center' }} onClick={() => { setAppointmentTootip(!appointmentTootip) }}>
						<CloseOutlined style={{ fontSize: 18 }} />
					</div>
				</div>
				<br />
				<br />
				<Row style={{ textAlign: "center" }}>
					<Col xl={12} sm={24} xs={24} md={12} lg={12}>
						<div style={{ color: "#003399", fontSize: 16, fontWeight: 500 }}>
							Location
						</div>
						<div style={{ fontSize: 14 }}>
							{restProps?.appointmentData?.location}
						</div>
					</Col>
					<Col xl={12} sm={24} xs={24} md={12} lg={12}>
						<div style={{ color: "#003399", fontSize: 16, fontWeight: 500 }}>
							Mode
						</div>
						<div style={{ fontSize: 14 }}>
							{restProps?.appointmentData?.mode}
						</div>
					</Col>
				</Row>
				<Row style={{ textAlign: "center", marginTop: 20 }}>
					<Col xl={12} sm={24} xs={24} md={12} lg={12}>
						<div style={{ color: "#003399", fontSize: 16, fontWeight: 500 }}>
							Meeting Location
						</div>
						<div style={{ fontSize: 14 }}>
							{restProps?.appointmentData?.meetingLocation}
						</div>
					</Col>
					<Col xl={12} sm={24} xs={24} md={12} lg={12}>
						<div style={{ color: "#003399", fontSize: 16, fontWeight: 500 }}>
							Duration
						</div>
						<div style={{ fontSize: 14 }}>
							{restProps?.appointmentData?.Minutes} Minutes
						</div>
					</Col>
				</Row>
			</AppointmentTooltip.Content>
		)
	});

	const currentDateChange = (currentDate) => {
		let curr_month = currentDate.getMonth();
		curr_month += 1;
		if (curr_month.toString().length == 1) {
			let num = '0' + curr_month.toString();
			curr_month = num;
		}
		console.log(curr_month, "this is the current month");
		setMonth(curr_month);
	}

	const currentViewNameChange = (e) => {
		setState({ currentViewName: e.target.value })
	}

	const handleButtonClick = (value) => {
		setState({ currentViewName: value })
	};

	const handleImportantToggle = () => {
		setImportant(!important);
	};

	const ExternalViewSwitcher = ({ currentViewName }) => (

		<div className="parent">
			<div className="event-heading">Events Calendar </div>
			<div className="buttons">
				<div style={{ display: 'flex', justifyContent: 'space-between', color: "black" }}>
					<Button
						style={{ marginLeft: 5 }}
						className={currentViewName === 'Day' ? 'active-save' : 'inactive-save'}
						onClick={() => handleButtonClick('Day')}
					>
						Today
					</Button>
					<Button
						style={{ marginLeft: 5 }}
						className={currentViewName === 'Week' ? 'active-save' : 'inactive-save'}
						onClick={() => handleButtonClick('Week')}
					>
						Week
					</Button>
					<Button
						style={{ marginLeft: 5 }}
						className={currentViewName === 'Month' ? 'active-save' : 'inactive-save'}
						onClick={() => handleButtonClick('Month')}
					>
						Month
					</Button>
					<Button
                        style={{ marginLeft: 5, display: "flex", alignItems: "center" }}
                        className={important ? 'active-save' : 'inactive-save'}
                        onClick={handleImportantToggle}
                    >
                        <StarOutlined />Important Task
                    </Button>
				</div>
			</div>
		</div>
	);

	const callback = () => {
		setCreate_event(true);
	}
	const callback1 = () => {
		getScheduler();
	}

	return (
		<div>
			<Activity_Header callback={callback} />
			<div className="main-div">
				<div className="left-div">
					<ExternalViewSwitcher
						currentViewName={currentViewName}
						onChange={currentViewNameChange}
					/>
					<div className="scheduler">
						<Paper style={{ boxShadow: "none", height: '650px', overflowY: 'scroll' }}>
							<Scheduler data={data} >
								<ViewState
									defaultCurrentDate={moment(currentDate).format('YYYY-MM-DD')}
									currentViewName={currentViewName}
									onCurrentDateChange={currentDateChange}
								/>
								<DayView startDayHour={0} endDayHour={24} />
								<WeekView startDayHour={0} endDayHour={24} />
								<MonthView />
								<Toolbar />
								<DateNavigator />
								<Appointments
									appointmentComponent={Appointment}
								/>
								<AppointmentTooltip
									visible={appointmentTootip}
									contentComponent={Content}
								/>
								<AllDayPanel />
							</Scheduler>
						</Paper>
					</div>
					{isModalVisible == true ? (
						<EventCreateComponent
							click={"UPDATE EVENT"}
							Data={editData}
							isModalVisible={isModalVisible}
							setIsModalVisible={setIsModalVisible}
							callback1={callback1}
						/>
					) : (
						""
					)}
					{create_event == true ? (
						<EventCreateComponent
							click={"CREATE AN EVENT"}
							isModalVisible={create_event}
							setIsModalVisible={setCreate_event}
							callback1={callback}
						/>
					) : (
						""
					)}
				</div>
			</div>
		</div>
	)
}

export default Datescheduler;