import React from 'react'
import './FullPageLoader.css'
import loadImg from '../../assets/image/creditx_loader.gif'
import { Spin } from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import { useSelector } from "react-redux";

const Sdloader = ({ sdloader, spinloader}) => {
  const loaderstate = useSelector((state) => state.loader.bagloader);
  const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
  return (
    <>
    {
         loaderstate ? 
        <div className='loader_data'>
            <div className='loader'>
                <img src={loadImg}  />
            </div>
        </div> : null
    }

    {
         spinloader ?
         <div className='loader_data'>
            <div className='screenLoader'>
                <Spin indicator={antIcon} />
            </div>
        </div> 
         : null
    }
        
    </>
  )
}

export default Sdloader