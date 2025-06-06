import React, { useEffect, useState } from 'react';
import { Checkbox, message, Image } from "antd";
import axiosRequest from "../../../axios-request/API.request";
import Sdloader from "../../../components/Loader/FullPageLoader";
import noData from "../../../assets/image/nodataavailable.svg"
import moment from 'moment';
import { useDispatch } from "react-redux";
import "./TodoListItem.css";
import { setLoader } from '../../../state/slices/loader'

const TodoListItem = () => {

  const [todoDataList, setTodoDataList] = useState([])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    handleTabClick()
  }, []);

  const onChange = (checkedItem) => {
    setLoading(true)
    dispatch(setLoader(true))
    const payload = {
      status: "Closed",
    };
    const apiConfig = `activity/todo/update/${checkedItem._id}`
    axiosRequest.put(apiConfig, payload)
      .then((res) => {
        if (res?.resCode === -1) {
          setTodoDataList([]);
          setLoading(false)
          dispatch(setLoader(false))
          handleTabClick()
          message.success("Task Updated Successfully")
        }
      })
      .catch((error) => {
      });
  };


  function formatDate(dateString) {
    const date = moment.utc(dateString);
    if (date.isValid()) {
      return date.format("DD-MM-YYYY");
    } else {
      return "Invalid date";
    }
  }

  const handleTabClick = () => {
    setLoading(true)
    dispatch(setLoader(true))
    axiosRequest.get(`activity/todo/get?page=1&limit=10&status=Open%2CIn-Progress%2COverdue%2CHold`)
      .then((response) => {
        let result = response?.data?.todo_data || []
        setTodoDataList(result)
        setLoading(false)
        dispatch(setLoader(false))
      })
      .catch((error) => {
        console.error("Error fetching proposals:", error);
        throw error;
      }
      )
  };

  return (
    <>
      {loading && <Sdloader sdloader={loading} />}
      {todoDataList != "" ? <>
          <div style={{ cursor: "pointer" }} className="list_item_card">
            {todoDataList?.map((item, index) => (
              <div class="list-card" key={index}>
                <div class="list-card-inner">
                  <div class="overdue-12122019-1230-p-parent">
                    <div class="overdue-12122019">{formatDate(item?.targetDate)}</div>
                    <div class="alerts">
                      <div style={{
                        backgroundColor: item?.priority == "High" ? "red" :
                          item?.priority === "Medium" ? "orange" :
                            "#003399"
                      }} class="alerts-child"></div>
                      <div style={{
                        color: item?.priority == "High" ? "red" :
                          item?.priority === "Medium" ? "orange" :
                            "#003399"
                      }} class="high">{item.priority}</div>
                    </div>
                  </div>
                </div>
                <div class="frame-parent">
                  <Checkbox
                    style={{ display: "flex", alignItems: "flex-start" }}
                    className="list_card_checkbox"
                    onChange={() => onChange(item)}
                  >
                    {item.description}
                  </Checkbox>
                </div>
              </div>
            ))}
          </div>
      </> :
        <div style={{ padding: "20%", display: "flex", justifyContent: "center",height:200,overflow:"hidden" }}><Image style={{width:"70%",marginLeft:"20%"}} preview={false} src={noData} /></div>}
    </>
  )
};

export default TodoListItem;
