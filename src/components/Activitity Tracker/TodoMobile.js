import React,{useEffect, useState} from 'react';
import { Card, Col, Row } from 'antd';
import Todo from './RightSide-Todo/Todo';
import './ActivityCalender.css'
import Tabs from '../../components/Tab/Tab'

const useWidowsSize=()=>{
    const [size,setSize]=useState([window.Width,window.height]);

    useEffect(() => {
      const handleChangeSize=()=>{
        setSize([window.innerWidth,window.innerHeight]);
      }
      window.addEventListener('resize',handleChangeSize);
    },[])
    return size;
}
const tabMenu = [
    {
      id: 'calendar',
      value: "Calendar",
    },
    {
      id: 'todo',
      value: "To Do"
    },
  
  ]

const App = () => {
    const [TeamSelf,setTeamSelf]=useState(true);
    const [width,height]=useWidowsSize();
    const [windowWidth, setWidth] = useState(window.innerWidth);
    const breakpoint = 620;
    return(

        <div className="ActivityCalender-container">
            { windowWidth < breakpoint &&
                <Tabs tabMenu={tabMenu} header="To Do" activeKey="todo"/>
            }
            <Row style={{color:"#f7f7f7",marginTop:'20px'}} justify="center">
                <Col xl={14} md={14} sm={23} xs={23}>
                    <Card>
                        <Todo/>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
export default App;