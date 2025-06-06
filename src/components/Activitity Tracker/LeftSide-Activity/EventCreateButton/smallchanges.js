{
    DataContainer?.map((element,index)=>{
      console.log(element.event_description);
    //   return(
    //     <div className='dataField-Card' key={index}>
    //         <div className='dataContainer'>
    //             <div className='bodyData'>
    //                 <div className='bodyData-Date'>
    //                     {/* <p>{element.Data.Date.date.day}</p> */}
    //                     <p>
    //                         {/* {element.Data.Date.date.Days} */}
    //                     </p>
    //                 </div>
    //                 <div className='bodyData-centerContent'>
    //                     <div className='TimeToEnd'>
    //                         <Typography>
    //                             {/* {element.Data.Timing.start} */}
    //                         </Typography>
    //                         <Typography>
    //                             To
    //                         </Typography>
    //                         <Typography>
    //                         {/* {element.Data.Timing.End} */}
    //                         </Typography>
    //                     </div>
    //                     <div className='EventType'>
    //                         <Typography style={{color:"#189eb4",fontSize:'12px'}}>
    //                         {/* {element.Data.centerData.firstData} */}
    //                         </Typography>
    //                         <Typography style={{fontSize:'11px'}}>
    //                             {/* {element.event_description} */}
    //                         </Typography>
    //                         <Typography style={{fontSize:'11px'}}>
    //                             {/* {element.Data.centerData.AprovalData} */}
    //                         </Typography>
    //                     </div>
    //                     <div className='EventName' >
    //                         <Typography style={{fontSize:'11px'}}>
    //                             {/* {element.Data.centerData.EventName} */}
    //                         </Typography>
    //                         <Typography style={{color:'#acacb4',fontSize:'11px'}}>
    //                             {/* {element.Data.centerData.TextData} */}
    //                         </Typography>
    //                     </div>
    //                 </div>
    //                 <div className='bodyData-side'>
    //                     {/* <Typography className={`closeOpen ${element.Data.side =='Close' ?'Close':"Open"}`}>
    //                         {element.Data.side}
    //                     </Typography> */}
    //                     <FormOutlined onClick={()=> showModal()}/>
    //                 </div>
    //             </div>
    //             <div className='footer'>
    //                 {/* {element.Data.footer.length >1 ?
    //                     <Typography>
    //                         <MessageOutlined style={{color:'orange',marginRight:"10px"}}/>
    //                         {element.Data.footer}
    //                     </Typography>
    //                     :""
    //                 } */}
    //             </div>
    //         </div>
    //     </div>
    // )
    })
}