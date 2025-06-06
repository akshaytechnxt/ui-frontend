import { Button, Col, Row } from 'antd';
import React, { useState } from 'react';
import success from "../../assets/image/Rectangle 215.png";
import { Checkmark } from 'react-checkmark'
import { useNavigate } from 'react-router-dom';
import "./LoanApplication.css"
import { useSelector } from 'react-redux';
const SuccessApplication = ({ id }) => {
  const navigate = useNavigate();
  const message = useSelector((state) => state?.proposalApplication?.proposal)
  const [status, setStatus] = useState(2)
  console.log('msg=====>', message)


  return (
    <Row justify="center" align="middle">
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className='savebuttons'>
        <div className='d-flex flex-column justify-content-center align-items-center'>
          {status === 2 ? (<Checkmark color='rgb(114, 231, 114)' className="check-mark-selected" />) : ("")}
          <div style={{ padding: 5 }} className={status === 1 ? "error" : "success"}>{message?.data?.title}</div>
          <div className='loansuccesstext' style={{ padding: 5 }}>
            {status === 2
              ? "You have successfully submitted the application."
              : status === 1 ? "Your application has been rejected as it does not meet our current lending criteria." :
                status === 3 ? "Your Application has been Sanctioned." : "Proposal assessment not found."}
          </div>
          {status === 2 && (
            <div style={{ padding: 10 }} className='eval'>
              We are evaluating your Application
            </div>
          )}

          <Button style={{ margin: 10 }} className='applicationlisting ' onClick={() => navigate("/Application-Listing")}>Back to Application Listing</Button>
        </div>
      </Col>

    </Row>
  );
}

export default SuccessApplication;
