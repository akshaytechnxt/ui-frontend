import React, { useState } from "react";
import { Button, Card, Form, Input, Row, Col, message } from "antd";
import "./login.css";
import crediXLogo from "../../assets/image/technxt.png";
import { InputOTP } from "antd-input-otp";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../state/slices/userSlice";
import Sdloader from "../../components/Loader/FullPageLoader";
import { setLoader } from '../../state/slices/loader';
import { mockAuthService } from "../../services/mockAuthService";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [verify, setVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otpValue, setOtpValue] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (value) => {
    const otpString = value.join("");
    setOtpValue(otpString);
  };

  const maskEmail = (email) => {
    if (email.length < 6) {
      return email;
    }
    const start = email.slice(0, 3);
    const end = email.slice(-4);
    return `${start}XXX${end}`;
  };

  const onEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setMaskedEmail(maskEmail(newEmail));
  };

  const onLogin = async () => {
    try {
      setLoading(true);
      dispatch(setLoader(true));
      
      const response = await mockAuthService.verifyOTP(email, otpValue);
      
      if (response.status === 200) {
        if (response.data.errCode === -1) {
          navigate('/Dashboard');
        } else {
          dispatch(setUser(response.data.data));
          navigate('/Dashboard');
        }
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        if (error?.response?.data?.resCode === 8) {
          message.error("Please Enter Correct OTP");
        }
      }
    } finally {
      setLoading(false);
      dispatch(setLoader(false));
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      dispatch(setLoader(true));
      
      const response = await mockAuthService.requestOTP(email);
      
      if (response.status === 200) {
        message.success(response.data.data.msg);
        if (response.data.errCode === 10609) {
          setVerify(true);
        } else {
          setVerify(true);
        }
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        if (error?.response?.data?.resCode === 4) {
          message.error("Please Enter Correct User Credentials");
        }
      }
    } finally {
      setLoading(false);
      dispatch(setLoader(false));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login_wrapper">
      {loading && <Sdloader sdloader={loading} />}
      <Card className="login_card">
        <Form
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <div className="d-flex justify-content-center">
            <img src={crediXLogo} alt="CreditX Logo" />
          </div>
          <div className="textarea">
            <div className="welcome">Welcome!</div>
            {!verify ? (
              <div className="otp">
                Please Enter Mobile/Email ID for the OTP Verification
              </div>
            ) : (
              <div className="otp">
                OTP has been sent on your registered Email ID/Mobile Number
              </div>
            )}
          </div>

          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className={verify ? "enterOtp" : "label-phone"}>
              {!verify ? (
                <Form.Item
                  name="email"
                  label="Email ID/Mobile Number"
                  rules={[
                    {
                      type: 'email',
                      message: 'The Email ID is Invalid!',
                    },
                    {
                      required: true,
                      message: 'Please Enter your Email Address/Mobile Number',
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter Your Email ID/ Mobile Number"
                    onChange={onEmailChange}
                    className="phonenumber border"
                  />
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    label="Enter OTP"
                    name="otp"
                  >
                    <InputOTP 
                      autoFocus 
                      inputType="numeric" 
                      length={4} 
                      className="center-input-message" 
                      value={otpValue}
                      onChange={handleOtpChange} 
                    />
                  </Form.Item>
                  <div className="details d-flex justify-content-between">
                    <div className="otp-info">
                      Please enter 4 digit OTP sent on {maskedEmail !== "" ? <b>{maskedEmail}</b> : ""}
                    </div>
                    <div className="resend">RESEND</div>
                  </div>
                </>
              )}
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item>
                {!verify ? (
                  <Button htmlType="submit" className="otpbutton" onClick={verifyOtp}>
                    Send OTP
                  </Button>
                ) : (
                  <Button htmlType="submit" className="loginbtn" onClick={onLogin}>
                    Login
                  </Button>
                )}
              </Form.Item>
              <div className="resend1">RESEND</div>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
