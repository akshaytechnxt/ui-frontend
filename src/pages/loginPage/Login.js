import React, { useState, useEffect } from "react";
import { Button, Card, Form, Input, Row, Col, message, Typography, Divider } from "antd";
import "./login.css";
import crediXLogo from "../../assets/image/technxt.png";
import { InputOTP } from "antd-input-otp";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../state/slices/userSlice";
import Sdloader from "../../components/Loader/FullPageLoader";
import { setLoader } from '../../state/slices/loader';
import { mockAuthService } from "../../services/mockAuthService";
import { UserOutlined, LockOutlined, MailOutlined, MobileOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [verify, setVerify] = useState(false);
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otpValue, setOtpValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onLogin = async () => {
    try {
      setLoading(true);
      dispatch(setLoader(true));

      const response = await mockAuthService.verifyOTP(email, otpValue);

      if (response.status === 200) {
        if (response.data.errCode === -1) {
          message.success("Login successful!");
          navigate('/Dashboard');
        } else {
          dispatch(setUser(response.data.data));
          message.success("Login successful!");
          navigate('/Dashboard');
        }
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        if (error?.response?.data?.resCode === 8) {
          message.error("Invalid OTP. Please try again.");
        }
      } else {
        message.error("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      dispatch(setLoader(false));
    }
  };

  const verifyOtp = async () => {
    try {
      if (!email) {
        message.warning("Please enter your Email or Mobile number");
        return;
      }
      
      setLoading(true);
      dispatch(setLoader(true));

      const response = await mockAuthService.requestOTP(email);

      if (response.status === 200) {
        message.success(response.data.data.msg);
        setVerify(true);
        setCountdown(60);
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        if (error?.response?.data?.resCode === 4) {
          message.error("User not found. Please check your credentials.");
        }
      } else {
        message.error("Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
      dispatch(setLoader(false));
    }
  };

  const handleResend = () => {
    if (countdown === 0) {
      verifyOtp();
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
          <div className="logo-container">
            <img src={crediXLogo} alt="CreditX Logo" className="login-logo" />
          </div>
          
          <div className="welcome-container">
            <Title level={3} className="welcome-title">Welcome!</Title>
            <Text className="welcome-subtitle">
              {!verify 
                ? "Sign in to access your account" 
                : "OTP Verification"}
            </Text>
          </div>

          <Divider className="login-divider" />

          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className={verify ? "enterOtp" : "label-phone"}>
              {!verify ? (
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      message: 'Invalid Email format!',
                    },
                    {
                      required: true,
                      message: 'Please enter your Email Address or Mobile Number',
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="input-icon" />}
                    placeholder="Email ID / Mobile Number"
                    onChange={onEmailChange}
                    className="login-input"
                    size="large"
                  />
                </Form.Item>
              ) : (
                <>
                  <div className="otp-header">
                    <Text className="otp-sent-text">
                      A verification code has been sent to
                    </Text>
                    <Text className="masked-email">
                      {maskedEmail !== "" ? maskedEmail : "your device"}
                    </Text>
                  </div>
                  
                  <Form.Item
                    name="otp"
                    className="otp-form-item"
                  >
                    <InputOTP
                      autoFocus
                      inputType="numeric"
                      length={4}
                      className="otp-input"
                      value={otpValue}
                      onChange={handleOtpChange}
                    />
                  </Form.Item>
                  
                  <div className="otp-footer">
                    <Text className="otp-hint">Enter the 4-digit verification code</Text>
                    <Button 
                      type="link" 
                      className={`resend-btn ${countdown > 0 ? 'resend-disabled' : ''}`}
                      onClick={handleResend}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                    </Button>
                  </div>
                </>
              )}
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item className="action-button-container">
                {!verify ? (
                  <Button 
                    htmlType="submit" 
                    className="login-button" 
                    onClick={verifyOtp}
                    size="large"
                  >
                    Continue with OTP
                  </Button>
                ) : (
                  <Button 
                    htmlType="submit" 
                    className="login-button" 
                    onClick={onLogin}
                    size="large"
                  >
                    Verify & Login
                  </Button>
                )}
              </Form.Item>
              
              {verify && (
                <div className="back-option">
                  <Button 
                    type="link" 
                    className="back-btn"
                    onClick={() => setVerify(false)}
                  >
                    Back to Login
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
