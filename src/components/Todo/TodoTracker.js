import React, { useEffect, useState } from 'react';
import { Button, Breadcrumb, Table, message, Modal } from 'antd';
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useDispatch } from "react-redux"
import Sdloader from "../../components/Loader/FullPageLoader";
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import axiosRequest from "../../axios-request/API.request";
import './ActivityCalendar.css'
import add_white from "../../assets/leadicon/plus.png";
import TodoTabCreate from './Todo-Tab.js'
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { setLoader } from '../../state/slices/loader'

const useWidowsSize = () => {
  const [size, setSize] = useState([window.Width, window.height]);

  useEffect(() => {
    const handleChangeSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', handleChangeSize);
  }, [])
  return size;
}

const TodoTracker = ({ props }) => {
  const [statusCounts, setStatusCounts] = useState([]);
  const [todoDataList, setTodoDataList] = useState([])
  const [statusUpdate, setStatusUpdate] = useState("")
  const [loading, setLoading] = useState(true)
  const [totalData, setTotalData] = useState("")
  const [deleteId, setDeleteId] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [todoButtonType, setTodoButtonType] = useState('Create')
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10)
  const [recordData, setRecordData] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    handleTabClick()
  }, [currentPage, statusUpdate]);

  const showModal = (record) => {
    setIsModalOpen(true);
    setDeleteId(record?._id)
  };
  const handleOk = () => {
    setLoading(true)
    dispatch(setLoader(true))
    axiosRequest.delete(`activity/todo/delete/${deleteId}`)
      .then((response) => {
        message.success("Task Deleted Successfully")
        handleTabClick()
        setIsModalOpen(false);
        setLoading(false)
        dispatch(setLoader(false))
      })
      .catch((error) => {
        console.error("Error fetching proposals:", error);
        throw error;
      }
      )
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCreateOrUpdate = () => {
    setIsModalVisible(false);
    handleTabClick()
  };

  const handlePagination = (pagination) => {
    console.log(pagination, currentPage, "akshay")
    setCurrentPage(parseInt(pagination));
    handleTabClick()
  }

  const handleTabClick = () => {
    setLoading(true)
    dispatch(setLoader(true))
    if (statusUpdate != "") {
      var config = `activity/todo/get?page=${currentPage}&limit=${pageSize}&sortType=ASC&status=${statusUpdate}`
    }
    else {
      var config = `activity/todo/get?page=${currentPage}&limit=${pageSize}&sortType=ASC`
    }
    axiosRequest.get(config)
      .then((response) => {
        let result = response?.data?.todo_data
        setTodoDataList(result)
        setLoading(false)
        dispatch(setLoader(false))
        setStatusCounts(response?.data?.count)
        setTotalData((response?.data?.count[0]?.count) + (response?.data?.count[1]?.count) + (response?.data?.count[2]?.count) + (response?.data?.count[3]?.count) + (response?.data?.count[4]?.count))
      })
      .catch((error) => {
        console.error("Error fetching proposals:", error);
        throw error;
      }
      )
  };

  const showCreateModal = (event, ind, type) => {
    setTodoButtonType(type)
    setIsModalVisible(true);
  };

  const moment = require('moment');

  function formatDate(dateString) {
    const date = moment.utc(dateString);
    if (date.isValid()) {
      return date.format("YYYY-MM-DD");
    } else {
      return "Invalid date";
    }
  }

  const dateFormat = "MM/DD/YYYY";
  dayjs.extend(customParseFormat)
  dayjs.extend(advancedFormat)
  dayjs.extend(weekday)
  dayjs.extend(localeData)
  dayjs.extend(weekOfYear)
  dayjs.extend(weekYear)

  const columns = [
    // {
    //   title: 'ID',
    //   dataIndex: '_id',
    //   key: '_id',
    // },
    {
      title: 'Stake Holder Type',
      dataIndex: ['stackHolder', 'holderType'],
      key: 'holderType',
      render: (text, record) => (
        <>
          {console.log(record,"akshay")}
          <div style={{ textTransform: "capitalize" }}>{record?.stackHolder?.holderType}</div>
        </>
      ),
    },
    {
      title: 'Stake Holder Name',
      dataIndex: ['stackHolder', 'entity_name'],
      key: 'entity_name',
    },
    {
      title: 'Name',
      dataIndex: ['stackHolder', 'individual_name'],
      key: 'individual_name',
    },
    {
      title: 'Mobile Number',
      dataIndex: ['stackHolder', 'mobile'],
      key: 'mobile',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Target Date',
      key: 'targetDate',
      render: (text, record) => (
        <div style={{ inlineSize: "max-content" }}>{formatDate(record?.targetDate)}</div>
      ),
    },
    {
      title: 'Priority',
      key: 'priority',
      render: (text, record) => (
        <div style={{ fontWeight: 500, color: record?.priority === "High" ? "red" : record?.priority === "Medium" ? "orange" : "#20c520" }}>{record?.priority}</div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'delete',
      render: (text, record) => (
        <>
          <div style={{ display: "flex", flexDirection: "row", rowGap: 10 }}>
            <EditOutlined style={{ color: "#003399",marginRight:10 }} type="primary" onClick={() => handleUpdate(record)} />
            <DeleteOutlined style={{ color: "#003399" }} type="primary" onClick={() => showModal(record)} />
          </div>
        </>
      ),
    }
  ];

  const handleUpdate = (record) => {
    setIsModalVisible(true)
    setTodoButtonType('Update')
    setRecordData(record)
  }

  return (
    <>
      {loading && <Sdloader sdloader={loading} />}
      <TodoTabCreate
        onTodoCreateOrUpdate={handleCreateOrUpdate}
        button={todoButtonType}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        recordData={recordData}
      />
      <div className='top-card'>
        <Breadcrumb  separator=">" style={{ marginLeft: '5px',marginBottom:20 }}>
          <Breadcrumb.Item href="/dashboard"><div className='todo-text'>Dashboard</div></Breadcrumb.Item>
          <Breadcrumb.Item>To Do Listing</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div className='toDo-txt'>To Do Listing</div>
          <div style={{ paddingRight: '50px' }}>
            <Button onClick={() => showCreateModal(null, null, 'Create')} style={{ border: "1px solid #28B1FF", borderRadius: '6px', color: '#fff', backgroundColor: "#28B1FF" }} >
              <img
                src={add_white}
                className="addToDo"
                alt="person_png"

              /> Create To Do</Button>

          </div>

        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className='count-container'>
            <div onClick={() => setStatusUpdate("")} className={`count-box ${statusUpdate === "" ? "active" : ""}`}>
              <p className='count-text' style={{ marginBottom: 0 }}><b>ALL</b></p>
              <p className='count-numbers'>
                {totalData ? totalData : '0'}
              </p>
            </div>
            <div onClick={() => setStatusUpdate("Closed")} className={`count-box ${statusUpdate === "Closed" ? "active" : ""}`}>
              <p className='count-text' style={{ marginBottom: 0 }}><b>{statusCounts[0]?._id}</b></p>
              <p className='count-numbers'>
                {statusCounts[0]?.count ? statusCounts[0]?.count : '0'}
              </p>
            </div>
            <div onClick={() => setStatusUpdate("In-Progress")} className={`count-box ${statusUpdate === "In-Progress" ? "active" : ""}`}>
              <p className='count-text' style={{ marginBottom: 0 }}><b>{statusCounts[1]?._id}</b></p>
              <p className='count-numbers'>
                {statusCounts[1]?.count ? statusCounts[1]?.count : '0'}
              </p>
            </div>
            <div onClick={() => setStatusUpdate("Open")} className={`count-box ${statusUpdate === "Open" ? "active" : ""}`}>
              <p className='count-text' style={{ marginBottom: 0 }}><b>{statusCounts[2]?._id}</b></p>
              <p className='count-numbers'>
                {statusCounts[2]?.count ? statusCounts[2]?.count : '0'}
              </p>
            </div>
            <div onClick={() => setStatusUpdate("Hold")} className={`count-box ${statusUpdate === "Hold" ? "active" : ""}`}>
              <p className='count-text' style={{ marginBottom: 0 }}><b>{statusCounts[3]?._id}</b></p>
              <p className='count-numbers'>
                {statusCounts[3]?.count ? statusCounts[3]?.count : '0'}
              </p>
            </div>
            <div onClick={() => setStatusUpdate("Overdue")} className={`count-box ${statusUpdate === "Overdue" ? "active" : ""}`}>
              <p className='count-text' style={{ marginBottom: 0 }}><b>{statusCounts[4]?._id}</b></p>
              <p className='count-numbers'>
                {statusCounts[4]?.count ? statusCounts[4]?.count : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='table-top-div' >
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10 }}>

          <span><b style={{ fontSize: 21, marginTop: 10, color: "#003399" }}>To-Do List
          </b></span>
        </div>

        <Table
        className='todo-table-content'
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalData,
            onChange: handlePagination,
          }}
          dataSource={todoDataList} columns={columns} />

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '15px', padding: '6px', paddingBottom: 0 }}>
          <span><b><span style={{ color: '#E46A25' }}>
            Showing {currentPage === 1
              ? '1'
              : (currentPage - 1) * itemsPerPage + 1}{' '}
            to{' '}
            {currentPage === 1
              ? Math.min(totalData, itemsPerPage)
              : Math.min(currentPage * itemsPerPage, totalData)}{' '}
            out of {totalData} records
          </span>
          </b></span>
        </div>
      </div>
      <Modal title="Delete Status" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Do You Want To Delete This Task?</p>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
          <Button style={{ backgroundColor: "white", color: "#003399", width: 70, border: "1px solid white",border:"1px solid #003399" }} onClick={handleCancel}>No</Button>
          <Button style={{ backgroundColor: "#003399", color: "white", width: 70, border: "1px solid white",marginLeft:5 }} onClick={handleOk}>Yes</Button>
        </div>
      </Modal>
    </>
  );
}
export default TodoTracker;