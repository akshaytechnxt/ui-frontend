import React from 'react'
import './Pagenation.css'
import 'antd/dist/antd.css';
import { Pagination } from 'antd';

const Pagenation = ({postPerPage,totalPost,paginate,total}) => {
    const onChange=(page)=>{
        paginate(page);
    }
    return (
        <div className='Pagenation-ActivityTracker'>
            <div className='Pagenation-Content'>
                <p className='Pagenation-RecordsData'>Showing 1 to {total}</p>
                <p className='Pagenation-OutOfData'>Out of {total} records</p>
            </div>
            <div className='Pagenation-Number'>
            <Pagination defaultCurrent={1} 
            total={totalPost} 
            onChange={onChange}
            pageSize={Math.ceil(totalPost/postPerPage)}
            />
            </div>
        </div>
    )
    }

export default Pagenation