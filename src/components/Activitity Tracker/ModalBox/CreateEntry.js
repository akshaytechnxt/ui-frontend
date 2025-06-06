import { Button, Modal } from "antd";
import React, { useState } from "react";
import { notNullish } from "react-select/dist/declarations/src/utils";
import "./new.css";

const App = ({ isModalVisible, setIsModalVisible }) => {
  const [updateEventCheck, setUpdateCheckEvent] = useState(false);
  const [advisorCheck, setAdvisorCheck] = useState(true);
  const [prospectCheck, setProspectCheck] = useState(false);
  const [customerCheck, setCustomerCheck] = useState(false);
  const [durationButton, setDurationButton] = useState({
    select_time: true,
    all_day: false,
  });
  const [eventDurationType, setEventDurationType] = useState("");
  const [startTimeSelect, setStartTimeSelect] = useState("");
  const [endTimeSelect, setEndTimeSelect] = useState("");
  const [durationStartTimeOperation, setDurationStartTimeOperation] =
    useState();
  const [durationEndTimeOperation, setDurationEndTimeOperation] = useState();

  const [advisorCollection, setAdvisorCollection] = useState({
    appointment_advisor: true,
    phone_call_advisor: false,
    training: false,
    businessPlanning_review: true,
    unit_meeting: false,
    joint_customer_visit: false,
    servicing: false,
    inactive_agent_reactivation: false,
  });

  const [statusType, setStatusType] = useState({
    openStatus: true,
    closeStatus: false,
  });
  const [prospectCollection, setProspectCollection] = useState({
    appointment_prospect: true,
    phone_call: false,
    training_prospect: false,
    first_meeting: true,
    follow_up: false,
    document_collection: false,
  });
  const [customerCollection, setCustomerCollection] = useState({
    appointment_customer: true,
    phone_call_customer: false,
    policy_renewal: false,
  });

  const checkTeamMemberFunc = () => {
    setAdvisorCheck(true);
    setProspectCheck(false);
    setCustomerCheck(false);
  };
  const checkProspectFunc = () => {
    setAdvisorCheck(false);
    setProspectCheck(true);
    setCustomerCheck(false);
  };

  const checkCustomerFunc = () => {
    setAdvisorCheck(false);
    setProspectCheck(false);
    setCustomerCheck(true);
  };
  const DurationSelectTimeFunc = () => {
    setEventDurationType("customedatetime");
    setStartTimeSelect("");
    setEndTimeSelect("");
    setDurationStartTimeOperation();
    setDurationEndTimeOperation();
    setDurationButton({
      select_time: true,
      all_day: false,
    });
  };
  const DurationAllDayFunc = () => {
    setEventDurationType("allday");
    setDurationStartTimeOperation(32400000);
    setDurationEndTimeOperation(61200000);
    setDurationButton({
      select_time: false,
      all_day: true,
    });
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const AdvisorAppointmentFunc = () => {
    setAdvisorCollection({
      appointment_advisor: true,
      phone_call_advisor: false,
      training: false,
    });
  };
  return (
    <>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="Calendar-event-modal-header-style"
      >
        <div className="CalendarEvent-Modal-Card-style">
          <div className="CalendarEvent-Modal-Card-content">
            <h4 className="CalendarEvent-Modal-Card-header-type">Event With</h4>
            <div className="CalendarEvent-Modal-Card-button-flex">
              <button
                className={
                  advisorCheck == true
                    ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                    : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                }
                disabled={updateEventCheck == true ? true : false}
                onClick={checkTeamMemberFunc}
              >
                Advisor
              </button>
              <button
                disabled={updateEventCheck == true ? true : false}
                onClick={checkProspectFunc}
                className={
                  prospectCheck == true
                    ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                    : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                }
              >
                Prospect
              </button>
              <button
                disabled={updateEventCheck == true ? true : false}
                onClick={checkCustomerFunc}
                className={
                  customerCheck == true
                    ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                    : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                }
              >
                Customer
              </button>
            </div>
            <div className="CalendarEvent-Modal-Card-vertical-line"></div>
          </div>
          <h4 className="CalendarEvent-Modal-Card-header-type">Event Type</h4>
          {advisorCheck == true ? (
            <div
              className={
                advisorCheck == true
                  ? "CalendarEvent-Modal-Card-button-flex"
                  : "CalendarEvent-Modal-Card-button-flex"
              }
            >
              <button
                disabled={updateEventCheck == true ? true : false}
                className={
                  advisorCollection.appointment_advisor == true
                    ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                    : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                }
                onClick={AdvisorAppointmentFunc}
              >
                Appointment
              </button>
              <button
                disabled={updateEventCheck == true ? true : false}
                className={
                  advisorCollection.phone_call_advisor == true
                    ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                    : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                }
                onClick={AdvisorPhoneCallFunc}
              >
                Phone Call
              </button>
              <button
                disabled={updateEventCheck == true ? true : false}
                onClick={AdvisorTrainingFunc}
                className={
                  advisorCollection.training == true
                    ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                    : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                }
              >
                Training
              </button>
            </div>
          ) : prospectCheck == true ? (
            <div
              className={
                prospectCheck == true
                  ? "CalendarEvent-Modal-Card-button-flex"
                  : "CalendarEvent-Modal-Card-button-flex"
              }
            >
              <button
                disabled={updateEventCheck == true ? true : false}
                className={
                  prospectCollection.appointment_prospect == true
                    ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                    : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                }
                onClick={ProspectAppointmentFunc}
              >
                Appointment
              </button>
              <button
                disabled={updateEventCheck == true ? true : false}
                className={
                  prospectCollection.phone_call == true
                    ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                    : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                }
                onClick={ProspectPhoneCallFunc}
              >
                Phone Call
              </button>
              <button
                disabled={updateEventCheck == true ? true : false}
                onClick={ProspectTrainingFunc}
                className={
                  prospectCollection.training_prospect == true
                    ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                    : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                }
              >
                Training
              </button>
            </div>
          ) : customerCheck == true ? (
            <div
              className={
                customerCheck == true
                  ? "CalendarEvent-Modal-Card-customer-event-button-flex"
                  : "CalendarEvent-Modal-Card-customer-event-button-flex"
              }
            >
              <button
                disabled={updateEventCheck == true ? true : false}
                className={
                  customerCollection.appointment_customer == true
                    ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                    : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                }
                onClick={CustomerAppointmentFunc}
              >
                Appointment
              </button>
              <button
                disabled={updateEventCheck == true ? true : false}
                className={
                  customerCollection.phone_call_customer == true
                    ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                    : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                }
                onClick={CustomerPhoneCallFunc}
              >
                Phone Call
              </button>

              <button
                disabled={updateEventCheck == true ? true : false}
                onClick={CustomerPolicyRenewalFunc}
                className={
                  customerCollection.policy_renewal == true
                    ? "CalendarEvent-Modal-documentcollection-onclick-button-style"
                    : "CalendarEvent-Modal-Card-documentcollection-static-button-style"
                }
              >
                Policy Renewals
              </button>
            </div>
          ) : null}
          <div className="CalendarEvent-Modal-Card-vertical-line"></div>
          {advisorCollection.appointment_advisor == true &&
          advisorCheck == true ? (
            <div>
              <h4 className="CalendarEvent-Modal-Card-header-type">
                Appointment Type
              </h4>
              <div className="CalendarEvent-Modal-appointmenttype-businessPlanning-button-flex">
                <button
                  disabled={updateEventCheck == true ? true : false}
                  onClick={AppointmentAdvisorBusinessPlanningFunc}
                  className={
                    advisorCollection.businessPlanning_review == true
                      ? "CalendarEvent-Modal-businessPlanning-onclick-button-style"
                      : "CalendarEvent-Modal-businessPlanning-static-button-style "
                  }
                >
                  Business Planning & Review
                </button>
                <button
                  disabled={updateEventCheck == true ? true : false}
                  onClick={AppointmentAdvisorInactiveAgentFunc}
                  className={
                    advisorCollection.inactive_agent_reactivation == true
                      ? "CalendarEvent-Modal-businessPlanning-onclick-button-style"
                      : "CalendarEvent-Modal-businessPlanning-static-button-style "
                  }
                >
                  Inactive Agent re-activation
                </button>
              </div>
              <div className="CalendarEvent-Modal-appointmenttype-button-flex">
                <button
                  disabled={updateEventCheck == true ? true : false}
                  onClick={AppointmentAdvisorUnitMeetingFunc}
                  className={
                    advisorCollection.unit_meeting == true
                      ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                      : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                  }
                >
                  Unit Meeting
                </button>
                <button
                  disabled={updateEventCheck == true ? true : false}
                  onClick={AppointmentAdvisorJoint_Cust_MeetingFunc}
                  className={
                    advisorCollection.joint_customer_visit == true
                      ? "CalendarEvent-Modal-joint-customer-onclick-button-style"
                      : "CalendarEvent-Modal-joint-customer-static-button-style"
                  }
                >
                  Joint Customer Meeting
                </button>
                <button
                  disabled={updateEventCheck == true ? true : false}
                  onClick={AppointmentAdvisorServicingFunc}
                  className={
                    advisorCollection.servicing == true
                      ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                      : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                  }
                >
                  Servicing
                </button>
              </div>
            </div>
          ) : advisorCollection.phone_call_advisor == true &&
            advisorCheck == true ? (
            <div>
              <h4 className="CalendarEvent-Modal-Card-header-type">
                Client Visit
              </h4>
              <div className="CalendarEvent-Modal-appointmenttype-button-flex">
                <button
                  onClick={() => {}}
                  className="CalendarEvent-Modal-Card-clientVisit-onclick-button-style"
                >
                  Relationship Call
                </button>
              </div>
            </div>
          ) : prospectCollection.phone_call == true && prospectCheck == true ? (
            <div>
              <h4 className="CalendarEvent-Modal-Card-header-type">
                Client Visit
              </h4>
              <div className="CalendarEvent-Modal-appointmenttype-button-flex">
                <button
                  disabled={updateEventCheck == true ? true : false}
                  onClick={() => {}}
                  className="CalendarEvent-Modal-Card-clientVisit-onclick-button-style"
                >
                  Relationship Call
                </button>
              </div>
            </div>
          ) : customerCollection.phone_call_customer == true &&
            customerCheck == true ? (
            <div>
              <h4 className="CalendarEvent-Modal-Card-header-type">
                Client Visit
              </h4>
              <div className="CalendarEvent-Modal-appointmenttype-button-flex">
                <button
                  disabled={updateEventCheck == true ? true : false}
                  onClick={() => {}}
                  className="CalendarEvent-Modal-Card-clientVisit-onclick-button-style"
                >
                  Relationship Call
                </button>
              </div>
            </div>
          ) : prospectCollection.appointment_prospect == true &&
            prospectCheck == true ? (
            <div>
              <h4 className="CalendarEvent-Modal-Card-header-type">
                Appointment Type
              </h4>
              <div className="CalendarEvent-Modal-appointmenttype-button-flex">
                <button
                  disabled={updateEventCheck == true ? true : false}
                  onClick={AppointmentProspectMeetingFunc}
                  className={
                    prospectCollection.first_meeting == true
                      ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                      : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                  }
                >
                  First Meeting
                </button>
                <button
                  disabled={updateEventCheck == true ? true : false}
                  onClick={AppointmentProspectFollowUpFunc}
                  className={
                    prospectCollection.follow_up == true
                      ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                      : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                  }
                >
                  Follow Up
                </button>
                <button
                  disabled={updateEventCheck == true ? true : false}
                  onClick={AppointmentProspectDocCollectionFunc}
                  className={
                    prospectCollection.document_collection == true
                      ? "CalendarEvent-Modal-documentcollection-onclick-button-style"
                      : "CalendarEvent-Modal-Card-documentcollection-static-button-style"
                  }
                >
                  Document Collection
                </button>
              </div>
            </div>
          ) : null}

          {advisorCheck == true ? (
            <div>
              <div className="CalendarEvent-Modal-Card-vertical-line"></div>
              <h4 className="CalendarEvent-Modal-Card-header-type">
                Search Advisor
              </h4>
              <div className="CalendarEvent-Modal-Search-flex">
                <div className="CalendarEvent-Modal-search-style">
                  <Search
                    placeholder="Search By Name"
                    onSearch={searchAdvisorFunc}
                    disabled={updateEventCheck ? true : false}
                    type="text"
                    value={searchAdvisorText}
                    onChange={searchAdvisorTextFunc}
                    enterButton
                    className="CalendarEvent-Modal-textinput-style"
                  />
                  {advisorOnClickCheck == true ? (
                    <div>
                      {advisorArr !== null && Array.isArray(advisorArr) ? (
                        <div className="CalendarEvent-Modal-search-record-style">
                          {advisorArr.map((advisor) => {
                            return (
                              <div>
                                <div
                                  className="CalendarEvent-Modal-click-record-style"
                                  onClick={() =>
                                    AdvisorClickedTag(
                                      advisor._id,
                                      advisor.partnerName
                                    )
                                  }
                                >
                                  <div className="CalendarEvent-Modal-Card-searchbox-vertical-line"></div>
                                  <h4>{advisor.partnerName}</h4>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <Tag
                  closable={updateEventCheck ? false : true}
                  visible={advisorTagVisible}
                  onClose={AdvisorTagCloseFunc}
                  className="CalendarEvent-Modal-Search-tag-style"
                >
                  {advisorOnClickVal}
                </Tag>
              </div>
            </div>
          ) : (prospectCollection.phone_call == true ||
              prospectCollection.training_prospect == true ||
              prospectCollection.follow_up == true ||
              prospectCollection.document_collection == true) &&
            prospectCheck == true ? (
            <div>
              <div className="CalendarEvent-Modal-Card-vertical-line"></div>
              <h4 className="CalendarEvent-Modal-Card-header-type">
                Search Prospect
              </h4>
              <div className="CalendarEvent-Modal-Search-flex">
                <div className="CalendarEvent-Modal-search-style">
                  <Search
                    placeholder="Search By Name"
                    onSearch={searchProspect}
                    disabled={updateEventCheck ? true : false}
                    type="text"
                    value={searchProspectText}
                    onChange={searchProspectTextFunc}
                    enterButton
                    className="CalendarEvent-Modal-textinput-style"
                  />
                  {prospectOnClickCheck == true ? (
                    <div>
                      {prospectArr !== null && Array.isArray(prospectArr) ? (
                        <div className="CalendarEvent-Modal-search-record-style">
                          {prospectArr.map((prospect) => {
                            return (
                              <div>
                                <div
                                  className="CalendarEvent-Modal-click-record-style"
                                  onClick={() =>
                                    ProspectClickedTag(
                                      prospect._id,
                                      prospect.firstName
                                    )
                                  }
                                >
                                  <div className="CalendarEvent-Modal-Card-searchbox-vertical-line"></div>
                                  <h4>{prospect.fullName}</h4>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <Tag
                  closable={updateEventCheck ? false : true}
                  visible={prospectTagVisible}
                  onClose={ProspectTagCloseFunc}
                  className="CalendarEvent-Modal-Search-tag-style"
                >
                  {prospectOnClickVal}
                </Tag>
              </div>
            </div>
          ) : customerCheck == true ? (
            <div>
              <h4 className="CalendarEvent-Modal-Card-header-type">
                Search Customer
              </h4>
              <div className="CalendarEvent-Modal-Search-flex">
                <div className="CalendarEvent-Modal-search-style">
                  <Search
                    placeholder="Search By Name"
                    onSearch={searchCustomer}
                    disabled={updateEventCheck ? true : false}
                    type="text"
                    value={searchCustomerText}
                    onChange={searchCustomerTextFunc}
                    enterButton
                    className="CalendarEvent-Modal-textinput-style"
                  />
                  {customerOnClickCheck == true ? (
                    <div>
                      {customerArr !== null && Array.isArray(customerArr) ? (
                        <div className="CalendarEvent-Modal-search-record-style">
                          {customerArr.map((cust) => {
                            return (
                              <div>
                                <div
                                  className="CalendarEvent-Modal-click-record-style"
                                  onClick={() =>
                                    CustomerClickedTag(cust._id, cust.custName)
                                  }
                                >
                                  <div className="CalendarEvent-Modal-Card-searchbox-vertical-line"></div>
                                  <h4>{cust.custName}</h4>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <Tag
                  closable
                  visible={customerTagVisible}
                  onClose={CustomerTagCloseFunc}
                  className="CalendarEvent-Modal-Search-tag-style"
                >
                  {customerOnClickVal}
                </Tag>
              </div>
            </div>
          ) : null}
          {customerCheck == true && addManuallyButtonCheck == true ? (
            <div>
              <div className="CalendarEvent-Modal-datePicker-button-flex">
                <div className="CalendarEvent-Modal-date-column-flex">
                  <h4
                    className={
                      customerNameCheck == false
                        ? "CalendarEvent-Modal-Card-empty-text-header-type"
                        : "CalendarEvent-Modal-Card-header-type"
                    }
                  >
                    Name *
                  </h4>
                  <input
                    disabled={manualCustomerCheck == true ? true : false}
                    value={customerNameText}
                    onChange={CustomerNameFunc}
                    className={
                      customerNameCheck == false
                        ? "CalendarEvent-Modal-empty-customer-textbox-style"
                        : "CalendarEvent-Modal-customer-textbox-style"
                    }
                    type="text"
                    placeholder="Enter the Name"
                    required
                  />
                  {customerNameCheck == false ? (
                    <h4 className="CalendarEvent-Modal-Card-empty-text-bottom-type">
                      This field is required
                    </h4>
                  ) : null}
                </div>
                <div className="CalendarEvent-Modal-date-column-flex">
                  <h4
                    className={
                      customerMobileNoCheck == false
                        ? "CalendarEvent-Modal-Card-empty-text-header-type"
                        : "CalendarEvent-Modal-Card-header-type"
                    }
                  >
                    Mobile Number *
                  </h4>
                  <input
                    disabled={manualCustomerCheck == true ? true : false}
                    value={customerMobileNoText}
                    onChange={CustomerMobileNoFunc}
                    className={
                      customerMobileNoCheck == false
                        ? "CalendarEvent-Modal-empty-customer-textbox-style"
                        : "CalendarEvent-Modal-customer-textbox-style"
                    }
                    type="text"
                    placeholder="Enter the Mobile Number"
                    required
                  />
                  {customerMobileNoCheck == false ? (
                    <h4 className="CalendarEvent-Modal-Card-empty-text-bottom-type">
                      This field is required
                    </h4>
                  ) : null}
                </div>
              </div>
              <div className="CalendarEvent-Modal-Card-add-manual-flex">
                <button
                  disabled={updateEventCheck == true ? true : false}
                  onClick={ManualCustomerSubmitFunc}
                  className={
                    "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                  }
                >
                  Submit
                </button>
                {manualCustomerCheck ? (
                  <Tag
                    closable={updateEventCheck ? false : true}
                    visible={addCustTagVisible}
                    onClose={AddCustomerTagVisibleFunc}
                    className="CalendarEvent-Modal-Search-tag-style"
                  >
                    {customerNameText}
                  </Tag>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className="CalendarEvent-Modal-Card-vertical-line"></div>
          <h4 className="CalendarEvent-Modal-Card-header-type">Duration</h4>
          <div className="CalendarEvent-Modal-Card-time-duration-flex">
            <button
              onClick={DurationSelectTimeFunc}
              className={
                durationButton.select_time == true
                  ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                  : "CalendarEvent-Modal-Card-eventwith-static-button-style"
              }
            >
              Select Time
            </button>
            <button
              onClick={DurationAllDayFunc}
              className={
                durationButton.all_day == true
                  ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                  : "CalendarEvent-Modal-Card-eventwith-static-button-style"
              }
            >
              All Day
            </button>
          </div>
          {durationButton.select_time == true ? (
            <div>
              <div className="CalendarEvent-Modal-datePicker-button-flex">
                <div className="CalendarEvent-Modal-date-column-flex">
                  <h4
                    className={
                      durationStartDateDiffCheck == false
                        ? "CalendarEvent-Modal-Card-empty-text-header-type"
                        : "CalendarEvent-Modal-Card-header-type"
                    }
                  >
                    Start Date *
                  </h4>
                  <DatePicker
                    onChange={StartDateFunc}
                    defaultValue={durationStartDate}
                    format="YYYY-MM-DD"
                    className={
                      durationStartDateDiffCheck == false
                        ? "CalendarEvent-Modal-empty-picker-style"
                        : "CalendarEvent-Modal-picker-style"
                    }
                    // className="CalendarEvent-Modal-picker-style"
                  />
                  {durationStartDateDiffCheck == false ? (
                    <p className="CalendarEvent-Modal-Card-empty-text-bottom-type">
                      Start Date should not be after the End date
                    </p>
                  ) : null}
                </div>
                <div className="CalendarEvent-Modal-date-column-flex">
                  <h4
                    className={
                      durationStartTimeDiffCheck == false
                        ? "CalendarEvent-Modal-Card-empty-text-header-type"
                        : "CalendarEvent-Modal-Card-header-type"
                    }
                    // className="CalendarEvent-Modal-Card-header-type"
                  >
                    Start Time *
                  </h4>
                  <select
                    value={startTimeSelect}
                    onChange={StartTimeChangeFunc}
                    className={
                      durationStartTimeDiffCheck == false
                        ? "CalendarEvent-Modal-empty-TimePicker-style"
                        : "CalendarEvent-Modal-TimePicker-style"
                    }
                    // className="CalendarEvent-Modal-TimePicker-style"
                  >
                    <option value="">Select</option>
                    {timeList.map((time) => {
                      return (
                        <option value={time.value}>{time.dispValue}</option>
                        //  <option value={editStartTime} selected>{editStartDisp}</option>
                      );
                    })}
                  </select>
                  {durationStartTimeDiffCheck == false ? (
                    <p className="CalendarEvent-Modal-Card-empty-text-bottom-type">
                      Start Time should be less than end time
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="CalendarEvent-Modal-duration-style">
                <div className="CalendarEvent-Modal-datePicker-button-flex">
                  <div className="CalendarEvent-Modal-date-column-flex">
                    <h4
                      className={
                        durationEndDateDiffCheck == false
                          ? "CalendarEvent-Modal-Card-empty-text-header-type"
                          : "CalendarEvent-Modal-Card-header-type"
                      }
                      // className="CalendarEvent-Modal-Card-header-type"
                    >
                      End Date *
                    </h4>
                    <DatePicker
                      onChange={EndDateFunc}
                      defaultValue={durationEndDate}
                      format="YYYY-MM-DD"
                      value={durationEndDate}
                      className="CalendarEvent-Modal-picker-style"
                    />
                    {durationEndDateDiffCheck == false ? (
                      <p className="CalendarEvent-Modal-Card-empty-text-bottom-type">
                        End Date should not be past from the Start date
                      </p>
                    ) : null}
                  </div>
                  <div className="CalendarEvent-Modal-date-column-flex">
                    <h4
                      className={
                        durationEndTimeDiffCheck == false
                          ? "CalendarEvent-Modal-Card-empty-text-header-type"
                          : "CalendarEvent-Modal-Card-header-type"
                      }
                      // className="CalendarEvent-Modal-Card-header-type"
                    >
                      End Time *
                    </h4>
                    <select
                      value={endTimeSelect}
                      onChange={EndTimeChangeFunc}
                      className={
                        durationEndTimeDiffCheck == false
                          ? "CalendarEvent-Modal-empty-TimePicker-style"
                          : "CalendarEvent-Modal-TimePicker-style"
                      }
                    >
                      <option value="">Select</option>
                      {/* {updateEventCheck==true?<option value={editEndTime} selected={true}>{editEndDisp}</option>:null }  */}
                      {timeList.map((time) => {
                        return (
                          <option value={time.value}>{time.dispValue}</option>
                        );
                      })}
                    </select>
                    {durationEndTimeDiffCheck == false ? (
                      <p className="CalendarEvent-Modal-Card-empty-text-bottom-type">
                        End time should not be past start time
                      </p>
                    ) : durationEndTimeSameCheck == false ? (
                      <p className="CalendarEvent-Modal-Card-empty-text-bottom-type">
                        End Time should not be Same from the Start Time
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="CalendarEvent-Modal-datePicker-button-flex">
                <div className="CalendarEvent-Modal-date-column-flex">
                  <h4 className="CalendarEvent-Modal-Card-header-type">
                    Start Date *
                  </h4>
                  <DatePicker
                    onChange={onChangeDate}
                    className="CalendarEvent-Modal-picker-style"
                    value={durationStartDate}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="CalendarEvent-Modal-Card-vertical-line"></div>
          <h4 className="CalendarEvent-Modal-Card-header-type">
            Add Team Member
          </h4>
          <Search
            placeholder="Search By Name"
            disabled={updateEventCheck ? true : false}
            value={searchTeamText}
            onChange={searchTeamTextFunc}
            enterButton
            className="CalendarEvent-Modal-textinput-style"
          />
          {searchTeamText !== "" && searchTeamText.length >= 3 ? (
            <div>
              {teamArr !== null && Array.isArray(teamArr) ? (
                <div className="CalendarEvent-Modal-search-record-style">
                  {teamArr.map((team) => {
                    return (
                      <div>
                        <div
                          className="CalendarEvent-Modal-click-record-style"
                          onClick={() => {}}
                        >
                          <div className="CalendarEvent-Modal-Card-searchbox-vertical-line"></div>
                          <h4>{team.name}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : null}
          <Tag
            closable={updateEventCheck ? false : true}
            visible={teamTagVisible}
            onClose={TeamTagCloseFunc}
            className="CalendarEvent-Modal-Search-tag-style"
          >
            {teamOnClickVal}
          </Tag>
          <div className="CalendarEvent-Modal-Card-vertical-line">
            <h4 className="CalendarEvent-Modal-Card-header-type">Status</h4>
            <div className="CalendarEvent-Modal-Card-status-flex">
              <button
                onClick={StatusTypeOpenFunc}
                className={
                  statusType.openStatus == true
                    ? "CalendarEvent-Modal-Card-eventwith-onclick-button-style"
                    : "CalendarEvent-Modal-Card-eventwith-static-button-style"
                }
              >
                Open
              </button>
              <button
                onClick={StatusTypeCloseFunc}
                className={
                  statusType.closeStatus == true
                    ? "CalendarEvent-Modal-Card-status-onclick-button-style"
                    : "CalendarEvent-Modal-Card-status-static-button-style"
                }
              >
                Close
              </button>
            </div>
            {statusType.closeStatus == true ? (
              <div className="CalendarEvent-Modal-Card-close-textbox-flex">
                <input
                  value={statusReasonText}
                  onChange={StatusTypeReasonFunc}
                  className="CalendarEvent-Modal-Card-close-textbox-style"
                  type="text"
                  placeholder="Enter the reason"
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="CalendarEvent-Modal-book-appointment-flex">
          <button
            // onClick={() => { }}
            className={"CalendarEvent-Modal-book-appointment-button-style"}
            onClick={BookAppointmentFunc}
          >
            {bookEventCheck == true ? "Book Appointment" : "Update Appointment"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default App;
