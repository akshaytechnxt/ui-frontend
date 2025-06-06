import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import CalendarEvent from '../../Contests/CalendarEvent';
import CreateAdvisorModal from '../../Partners/CreateAdvisorModal';


const App = ({isModalVisible, setIsModalVisible}) => {
  // const [isModalVisible, setIsModalVisible] = useState(false);

  // const showModal = () => {
  //   setIsModalVisible(true);
  // };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {/* <Button type="primary" onClick={showModal}>
        Open Modal
      </Button> */}
      <Modal title="Basic Modal" 
      visible={isModalVisible} 
      onOk={handleOk} onCancel={handleCancel}>
      <CalendarEvent />
      </Modal>
    </>
  );
};

export default App;