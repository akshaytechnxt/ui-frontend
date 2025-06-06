import React,{useState,useEffect} from 'react'
import TodoClock from '../../icons/todoclock.png'
import TodoData from '../../JSON/TodoData'
import Pagenation from '../../Pagenation/Pagenation'
import truecheckbox from '../../icons/truecheckbox.png'
import '../Todo&Archive-Css/TodoCards.css'
import axiosRequest from '../../../../axios-request/request.methods';
import { Card, Col,Collapse,Pagination  } from 'antd'

import moment from 'moment'
import {stoageGetter} from '../../../../helpers'
import noDataIcon from '../../../../assets/078e54aa9d@2x.png'

const Archive = () => {
    const [ShowMore,setShowMore]=useState(false);

    const [currentPage,setCurrentPage]=useState(1);
    const [postPerPage,setPostPerPage]=useState(5);
    //get Current Post

    const [showData, setShowData] = useState(false);
    const [getArchiveDataArray, setGetArchiveDataArray] = useState([]);

    const [totolDataCount, setTotolDataCount] = useState(0);

    const [totalPage, setTotalPage] = useState(0);
    const [current, setCurrent] = useState(1);
    const [minIndex, setMinIndex] = useState(0);
    const [maxIndex, setMaxIndex] = useState(0);
    const [isHamburger,setHamburger]=useState(false);
    const [skipVal,setSkipVal] = useState(0);
    const [fval,setFval] = useState(0);
    const [sval,setSval] = useState(0);
    const [swap_final_count,setSwap_final_count]=useState(false);

    //change pages
    const paginate=(pageNumber)=> setCurrentPage(pageNumber)

    useEffect(()=> {
        // console.log('showData________',showData)
        getArchiveData(0)
    },[])
    let setTodoStatus = (reminderDate, reminderTime) => {
        try{
            let reminderDay = reminderDate + reminderTime;
            let current_date = Date.now();

            let soon_time_ = reminderDay - ((60000 * 60) * 24);
            let start_time = new Date(current_date).setHours(0, 0, 0, 0)
            let end_time = new Date(current_date).setHours(23, 59, 59, 999)

            if (current_date > reminderDay) {
                return 'Overdue';  
            } else if (start_time < soon_time_ && soon_time_ < end_time ) {
                return 'Soon';  
            } else {
                return '';
            }
        }catch(err){
            console.log(err , '837270dc-c0d0-4049-b3cf-0ba00b631b8b');
        }
    }

    let getArchiveData = async (skip) =>{
        try{
            const {id} = stoageGetter('user')
            let arrData = []
            
            let _resp = await axiosRequest.get(`user/fetch_todo_list?user_id=${id}&filter=archive&skip=${skip}`, { secure: true })
            // console.log('TODO__GETTTT___RESPPPP',_resp)
            let respData = _resp[0]

            setTotalPage(_resp[1][0].count / 5)
            
            setTotolDataCount(_resp[1][0].count)
            var less_enough = _resp[1][0].count
            var checkless_init = false
            less_enough < 5 ?  checkless_init = false : checkless_init = true

            // if less than 15 we have second value same as total value as no pagination will occur
            if (checkless_init) {
                // checkinit is true means the final count is more than 15
                var traverse = skip + 5
                setFval(traverse - 4)
                swap_final_count ? setSval(totolDataCount) : setSval(traverse)
            } else {
                setFval(1)
                setSval(totolDataCount)
            }
            // setGetArchiveDataArray([])
            // getArchiveDataArray = []
            for(let _data of respData){
                // console.log('DATATATATA',_data)
                let _textOverline = {}
                if(_data.taskOwner._id !== id){
                    _textOverline = _data.owernersCollectionDetails[0].taskDone === false ? {textDecorationLine: '',opacity: '0'}:{textDecorationLine: 'line-through',opacity: '0'}
                }else{
                    _textOverline = _data.taskDone === false ? {textDecorationLine: '',opacity: '0'}:{textDecorationLine: 'line-through',opacity: '0'}
                }


                let objstrct = {
                    content: _data.description,
                    removeBtn: _data.taskDone,
                    icon: truecheckbox,
                    createdByName: checkValidity(_data.taskOwner.first_name + ' ' + _data.taskOwner.last_name),
                    archiveddate: checkValidity(moment(_data.archiveDate).format('L')),
                    createddate: checkValidity(_data.createdDate),
                    dateofreminder: checkValidity(moment(_data.dateOfReminder).format('L')),
                    timeofreminder: checkValidity(parseInt(_data.timeOfReminder)),
                    ownername: checkValidity(_data.taskOwner.first_name + ' ' + _data.taskOwner.last_name),
                    stringtimeofreminder: checkValidity(_data._stringVersionTimeOfReminder),
                    todoid: _data._id,
                    taskOwner_id:_data.taskOwner._id, 
                    taskPriority:_data.taskPriority,
                    priorityIndicatorColor:_data.priorityIndicatorColor,
                    showMemberRemark:false,
                    showMemText:'Show More',
                    textOverLine : _textOverline,
                    showarchiedpopup: false
                }
                arrData.push(objstrct)
                // getArchiveDataArray.filter(Boolean)
            }
            setGetArchiveDataArray(arrData)
            // console.warn('getArchiveDataArray____DATAA',getArchiveDataArray)
            setShowData(true)
        }catch(err){

        }
    }
    let checkValidity = (data)=>{
        try{
            if(data === "" || data === null || data === undefined || data === 'undefined' || data === '-' || data === Infinity){
                return 0;
            }else{
                return data;
            }
        }catch(err){}
    }

    let fetchArchive = () =>{
        return getArchiveDataArray.map((element,index)=>{
            return(
                <div className='TodoCard-Container' key={index}>
                    <div className='TodoCards-Top'>
                        <div className='TodoCards-TimedateArchive'>
                            <div className='TodoCards-TopClock'>
                                <div className='todoCard-mr15'>
                                    <img src={TodoClock} alt='alarm'/>
                                </div>
                                <div>
                                    <text className='TimedateArchive-Time' style={{color:"#000",opacity:".9",fontSize:"12px",fontWeight:"700",}}>
                                        {element.stringtimeofreminder} : {element.dateofreminder}
                                    </text>
                                </div>
                                
                            </div>
                            
                            <div >
                                <text style={{color:"#000",opacity:".9",fontSize:"12px",fontWeight:"700",}}>
                                    Archive : {element.archiveddate}
                                </text>
                            </div>
                        </div>
                    </div>
                    <div className='TodoCards-Body'>
                        <div className='TodoCard-Body-CheckBox'>
                            <img src={element.icon} className='archive-trueCheckBox' alt='trueCheckBox'/>
                        </div>
                        {/* <p style={{marginLeft:'20px'}}>{element.content}</p> */}
                        <p style={{textDecorationLine : element.textOverLine.textDecorationLine,marginLeft:'20px'}} >{element.content}</p>
                    </div>
                    <div className='Todo-Footer'>
                        <p style={{textTransform: 'capitalize',fontWeight:'bolder'}}>{element.ownername}</p>
                        {
                            element.taskPriority =="high" ?
                            <button style={{backgroundColor:"#ff5252"}}>{element.taskPriority}</button>
                            :element.taskPriority =="low" ?
                            <button style={{backgroundColor:"#4caf50"}}>{element.taskPriority}</button>
                            :<button >{element.taskPriority}</button>
                        }
                    </div>
                </div>
            )
    
        })
    }
    const indexOfLastPost=currentPage*postPerPage;
    const indexOfFirstPost=indexOfLastPost-postPerPage;
    const currentPost= getArchiveDataArray.slice(indexOfFirstPost,indexOfLastPost)
    console.log(currentPost);

    const onChangePagination = (page) => {
        console.log(page);
        let _decrement = 0
        let _increment = 0

        if(current > page){
            _decrement = skipVal - 5
            setSkipVal(_decrement)
            getArchiveData(_decrement)
        }else if(current < page) {
            _increment = skipVal + 5
            setSkipVal(_increment)
            getArchiveData(_increment)
        }
        setCurrent(page)
    };


    return (
        <div className="site-card-border-less-wrapper">
            { showData === true &&
                <div>
                    <div>{ fetchArchive() }</div>

                    <div className='TodoCard-Pagenation'>
                        <div className='Pagenation-Content'>
                            <p className='Pagenation-RecordsData'>Showing {fval} to {sval}</p>
                            <p className='Pagenation-OutOfData'>Out of {totolDataCount} records</p>
                        </div>

                        <div style={{display:'flex',justifyContent:'flex-end'}}>
                            <Pagination
                                pageSize={5}
                                current={current}
                                total={totolDataCount}
                                onChange={onChangePagination}
                            />
                        </div>
                    </div>
                </div>
            }

            {showData === false  &&
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',padding:50}} >  
                    <img src={noDataIcon} style={{height:150,width:100}}/>
                    <div style={{marginTop:10}}>
                        <text  style={{  textAlign:'center',fontSize:14}} > No records found </text>
                    </div>
                </div>
            }
        </div>
    )
}

export default Archive