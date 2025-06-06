import { Button, Card, Modal,PageHeader } from 'antd';
import React, { useState } from 'react';
import './ModalBox-Open.css'
const App = ({isModalVisible,setIsModalVisible}) => {
  const [visible, setVisible] = useState(false);

//   const handleClick=()=>{
//     setIsModalVisible(false)
//   }
//   const handleCancel=()=>{
//     setIsModalVisible(true)
//   }
  return (
    <div className='ModalBox-Open'>
      {/* <Button type="primary" onClick={() => setVisible(true)}>
        Open Modal of 1000px width
      </Button> */}
      <Modal
        title="Modal 1000px width"
        centered
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Card className='ModalBox-Open-Card'
            title='Event With'
        >
            <div className='ModalBox-Open-Btn'>
                <Button style={{background:"#1890ff !important"}}>Procedure</Button>
                <Button>Customer</Button>
            </div>
        </Card>
            <div className='ModalBox-Open-Update'>
                <Button style={{background:"#1890ff !important"}}>Update Appointment</Button>
            </div>
      </Modal>
    </div>
  );
};

export default App;