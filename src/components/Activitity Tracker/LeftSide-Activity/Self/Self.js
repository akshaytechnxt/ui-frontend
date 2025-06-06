import React,{useState,useEffect, useRef} from 'react'
import {Typography} from 'antd'
import './Self.css'
import PastFutureData from '../History-showedData'
import JSONData from '../../JSON/json'
import DataField from '../DataField/DataField'
import EventCreate from '../EventCreate/EventCreate'
import axios from 'axios';
import axiosRequest from '../../../../axios-request/request.methods'
import {stoageGetter} from '../../../../helpers'

const Self = () => {
  const _date = new Date();
  let currentMonth = _date.getMonth();
  let currentyear = _date.getFullYear();
  const [month,setMonth]=useState(currentMonth+1)
  const [DataContainer,setDataContainer]=useState();
  const [year,setyear]=useState(currentyear)
  const [PastDataContainer,setPastDataContainer]=useState();
  const [CurentOrPast,setCurentOrPast]=useState()
  const [pastEventLenght,setPastEventLength]=useState();
  const [getshow, setGetShow] = useState();
  const [currentpastdata, setCurrentPastData] = useState();
  const [currentpastdataln, setCurrentPastDataLn] = useState();
  let getdata = false;
 
  
  useEffect(()=>{
    // api();
  },[]);
useEffect(() => {
  console.log(DataContainer,"this is the data");
}, [month])


// },[month,year,CurentOrPast]);
  let {id}=stoageGetter('user');
  // const api = async ()=>{
  //   let data = await axiosRequest.get(`user/fetch_appointments/${id}?teamdata=0&filter=${month}/${year}&category=upcoming`);
  //   setPastDataContainer(data);
  //   setDataContainer(data)
  // }


  useEffect(()=>{
    if(PastDataContainer){
      for(let i = 0; i < PastDataContainer?.length; i++){
        let a = 1+new Date(PastDataContainer[i].start_time_MS).getMonth();
        let b = 1+ new Date().getMonth();
        if(a==b){
          const filterCurrentData = PastDataContainer?.filter((element,index,arr)=>((1 + new Date(element?.start_time_MS).getDate()) <= (1 + new Date().getDate())))
          if(filterCurrentData){
            setPastEventLength(filterCurrentData?.length);
          }
        }
      }
    } 
  },[])

  useEffect(()=>{

   if(month.toString().length >1){
    setMonth(month)
   }else{
    let num =  month.toString()
    let add = '0' + num
    setMonth(add)
   }
  
  },[])
 
  return (
    <div className='Self-Container'>
      <EventCreate monthData={setMonth} yearData={setyear}  
      // getFunc = {api}  
      getdata = {setGetShow} />
        <div className='eventChange'>
            {
              (month == 1+new Date().getMonth() && year == new Date().getFullYear())
              ?
                <PastFutureData CurentOrPast={setCurentOrPast}
                pastDataln={currentpastdataln}
                pastData={currentpastdata}/>
              :""
            }
        </div>
        <DataField SelfMonthYear = {month +'/'+ year}
          history={CurentOrPast}
          SelfHere='self'
          // getFunc={api}
          getdata = {getshow}
          Dataupdate = {DataContainer}
        />
    </div>
  )
}

export default Self;