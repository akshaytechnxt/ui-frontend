import React from "react";
import { Select } from "antd"
import "./sdwidgetcom.css";
import { Link } from "react-router-dom";
import exportoutlined from "../../assets/image/Group 427318820.png"

const SdWidgetCom = ({
  backgroundColorToDo,
  title_header,
  toRoute,
  children,
  headerIcon,
  headeColor,
  count,
  headerImgSrc,
  dropdownValue,
  dropdownData,
  setDropdownData
}) => {

  const handleDate = (value) => {
    console.log(value,"akshay")
    setDropdownData(value)
  }
  return (
    <>
      <div
        className="activityTrackerWidget3"
        style={{
          backgroundColor: backgroundColorToDo ? backgroundColorToDo : "#000",
        }}
      >

        <div className="header2" style={{ background: "#DEE9FF" }}>
          {headerIcon ? (
            headerIcon
          ) : (
            <img
              className="activity1Icon2"
              alt=""
              src={headerImgSrc ? headerImgSrc : "/activity-11.svg"}
            />
          )}
          <div
            className={dropdownValue ? "widgetInfo1" : "widgetInfo"}
            style={{
              // backgroundColor: backgroundColorToDo,
              color: headeColor,
            }}
          >
            <div className="title">
              <Link
                to={toRoute}
                className="text-muted1"
              >
                {title_header ? title_header : "To Do"}
              </Link>
            </div>
            {count && (
              <div
                className="counter"
                style={{ color: "#039", background: "#fff" }}
              >
                <b className="rajatMishra">{count ? count : 10}</b>
              </div>
            )}
            <img className="launch1Icon2" alt="" src="/launch-1.svg" />
            {dropdownValue && (
              <Select onChange={handleDate} defaultValue="3" value={dropdownData} style={{ height: "24px", width: 85 }}>
                <Select.Option value="3">3 days</Select.Option>
                <Select.Option value="6">6 days</Select.Option>
                <Select.Option value="9">9 days</Select.Option>
                <Select.Option value="12">12 days</Select.Option>
                <Select.Option value="15">15 days</Select.Option>
              </Select>
            )}
          </div>
          <Link
            to={toRoute}
            className="text-muted1"
          >
            <div style={{ float: "right" }}>
              <img src={exportoutlined} />
            </div>
          </Link>
        </div>
        <div className="body">
          {/* <div
            // horizontal scroll using ref
            // ref={scrollRef}
            className="hScroll"
          >
            <div className="mainColumn11">
              <div className="toDoList6">
                <div className="toDoListInner">
                  <div className="overdue121220191230PParent">
                    <div className="overdue121220196">
                      12/01/2023 : 12:30 PM
                    </div>
                    <div className="alerts">
                      <div className="alertsChild" />
                      <div className="high">High</div>
                    </div>
                  </div>
                </div>
                <div className="frameParent2">
                  <div className="frameWrapper">
                    <div className="groupWrapper">
                      <img
                        className="frameChild11"
                        alt=""
                        src="/rectangle-1719.svg"
                      />
                    </div>
                  </div>
                  <div className="itIsA6">
                    Design meeting arrangement for TaTa B2B and promote sales
                    drive with tata.
                  </div>
                </div>
              </div>
              <div className="toDoList6">
                <div className="toDoListInner">
                  <div className="overdue121220191230PParent">
                    <div className="overdue121220196">
                      12/01/2023 : 12:30 PM
                    </div>
                    <div className="alerts">
                      <div className="alertsChild" />
                      <div className="high">High</div>
                    </div>
                  </div>
                </div>
                <div className="frameParent2">
                  <div className="frameWrapper">
                    <div className="groupWrapper">
                      <img
                        className="frameChild11"
                        alt=""
                        src="/rectangle-1719.svg"
                      />
                    </div>
                  </div>
                  <div className="itIsA6">
                    Design meeting arrangement for TaTa B2B and promote sales
                    drive with tata.
                  </div>
                </div>
              </div>
              <div className="toDoList6">
                <div className="toDoListInner">
                  <div className="overdue121220191230PParent">
                    <div className="overdue121220196">
                      12/01/2023 : 12:30 PM
                    </div>
                    <div className="alerts">
                      <div className="alertsChild" />
                      <div className="high">High</div>
                    </div>
                  </div>
                </div>
                <div className="frameParent2">
                  <div className="frameWrapper">
                    <div className="groupWrapper">
                      <img
                        className="frameChild11"
                        alt=""
                        src="/rectangle-1719.svg"
                      />
                    </div>
                  </div>
                  <div className="itIsA6">
                    Design meeting arrangement for TaTa B2B and promote sales
                    drive with tata.
                  </div>
                </div>
              </div>
            </div>
            <div className="mainColumn11">
              <div className="toDoList6">
                <div className="toDoListInner">
                  <div className="overdue121220191230PParent">
                    <div className="overdue121220196">
                      12/01/2023 : 12:30 PM
                    </div>
                    <div className="alerts">
                      <div className="alertsChild" />
                      <div className="high">High</div>
                    </div>
                  </div>
                </div>
                <div className="frameParent2">
                  <div className="frameWrapper">
                    <div className="groupWrapper">
                      <img
                        className="frameChild14"
                        alt=""
                        src="/launch-1.svg"
                      />
                    </div>
                  </div>
                  <div className="itIsA6">
                    Design meeting arrangement for TaTa B2B and promote sales
                    drive with tata.
                  </div>
                </div>
              </div>
              <div className="toDoList6">
                <div className="toDoListInner">
                  <div className="overdue121220191230PParent">
                    <div className="overdue121220196">
                      12/01/2023 : 12:30 PM
                    </div>
                    <div className="alerts">
                      <div className="alertsChild" />
                      <div className="high">High</div>
                    </div>
                  </div>
                </div>
                <div className="frameParent2">
                  <div className="frameWrapper">
                    <div className="groupWrapper">
                      <img
                        className="frameChild14"
                        alt=""
                        src="/launch-1.svg"
                      />
                    </div>
                  </div>
                  <div className="itIsA6">
                    Design meeting arrangement for TaTa B2B and promote sales
                    drive with tata.
                  </div>
                </div>
              </div>
              <div className="toDoList6">
                <div className="toDoListInner">
                  <div className="overdue121220191230PParent">
                    <div className="overdue121220196">
                      12/01/2023 : 12:30 PM
                    </div>
                    <div className="alerts">
                      <div className="alertsChild" />
                      <div className="high">High</div>
                    </div>
                  </div>
                </div>
                <div className="frameParent2">
                  <div className="frameWrapper">
                    <div className="groupWrapper">
                      <img
                        className="frameChild14"
                        alt=""
                        src="/launch-1.svg"
                      />
                    </div>
                  </div>
                  <div className="itIsA6">
                    Design meeting arrangement for TaTa B2B and promote sales
                    drive with tata.
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <Hscroll /> */}
          {children}
        </div>
      </div>
    </>
  );
};

export default SdWidgetCom;
