import { Button, Typography } from 'antd'
import React,{useState} from 'react'
import EventCreateComponent from '../../../Contests/CalendarEvent'
import './EventCreateButton.css'

const EventCreateButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = (e) => {
    setIsModalVisible(true);
  };
  return (
    <div className='EventCreateButton'>
        <div className='newEventTag'>
            <img src='https://pocbanca.iorta.in/assets/dashboard/Group115.png'/>
            <Typography >No Event Exist</Typography>
            <button onClick={(e)=>showModal(e)}>Create an Event</button>
            {/* {console.log(isModalVisible,'is modal-------->')} */}
        </div>
        {
          isModalVisible == true ?
            <EventCreateComponent click={'data'} setIsModalVisible={setIsModalVisible} isModalVisible={isModalVisible}/>
          :""
        }
    </div>
  )

}

export default EventCreateButton