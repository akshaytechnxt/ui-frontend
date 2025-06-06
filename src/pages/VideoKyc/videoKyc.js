import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Webcam from "react-webcam";
import { Button, message } from 'antd';
import successScreen from "../../assets/kycsuccess.png"
import failScreen from "../../assets/kycFail.png"
import axios from 'axios';

const VideoKyc = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const countdownRef = useRef(null);
  const startTimeRef = useRef(null);
  const elapsedTimeRef = useRef(0);
  const [userData, setUserData] = useState("");
  const [capturing, setCapturing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [screenView, setScreenView] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const refId = queryParams.get('refId');

  const videoConstraints = {
    facingMode: "user",
  };

  const audioConstraints = {
    suppressLocalAudioPlayback: true,
    noiseSuppression: true,
    echoCancellation: true,
  };

  const startCountdown = () => {
    countdownRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdownRef.current);
          handleStopCaptureClick();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    setPaused(false);
    setTimeLeft(20);
    elapsedTimeRef.current = 0;
    startTimeRef.current = Date.now();
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
    mediaRecorderRef.current.start();
    startCountdown();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => prev.concat(data));
    }
  }, [setRecordedChunks]);

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
    clearInterval(countdownRef.current);
    setTimeLeft(20);
  }, [mediaRecorderRef, setCapturing]);

  const handlePauseCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setPaused(true);
      clearInterval(countdownRef.current);
      elapsedTimeRef.current += (Date.now() - startTimeRef.current) / 1000;
    } else if (mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setPaused(false);
      startTimeRef.current = Date.now();
      startCountdown();
    }
  }, [mediaRecorderRef]);

  const handleRetakeClick = useCallback(() => {
    setRecordedChunks([]);
    setTimeLeft(20);
    setCapturing(false);
    setPaused(false);
    clearInterval(countdownRef.current);
  }, []);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, [recordedChunks]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://creditx-node-dev.salesdrive.app/proposal/expose/getVideoKycDetail', {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`
          },
          params: { refId: refId }
        });
        setUserData(response.data);
        setRecordedChunks([]);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Error fetching user data');
      }
    };

    fetchData();
  }, [token, refId]);

  const handleSubmit = useCallback(async () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const formData = new FormData();
    formData.append('video', blob, 'video.webm');
    formData.append('otp', userData?.data?.kycDetail?.otp);
    formData.append('proposalId', userData?.data?.proposalDetail?._id);

    try {
      await axios.post('https://creditx-node-dev.salesdrive.app/service/karza/kyc/video/request', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      message.success('Video uploaded successfully');
      setScreenView(true)
      setRecordedChunks([]);
    } catch (error) {
      setScreenView(null)
      console.error('Error uploading video:', error);
      message.error('Error uploading video');
    }
  }, [recordedChunks, userData, token]);

  return (
    <>
      {screenView === false ? <>
        <div>
          <div style={{ padding: 15 }}>
            <h5 style={{ textAlign: "center", display: "flex", justifyContent: "center", flexDirection: "column", color: "#003399", fontWeight: 'bold', fontSize: 23, padding: "10px 0px" }}>Video KYC</h5>
            <div className='video-width'>
              <Webcam muted={true} style={{ width: '100%', height: 'auto' }} audio={true} ref={webcamRef} videoConstraints={videoConstraints} audioConstraints={audioConstraints} />
            </div>
            <div style={{ padding: "10px", display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", justifyContent: "center" }}>
              <div style={{ fontSize: 16, fontWeight: "bold", color: "#003399" }}>The video will stop in:</div>
              <div style={{ fontSize: 23, fontWeight: "bold", color: "#003399" }}>{timeLeft === 0 ? "0:00" : timeLeft}</div>
            </div>
            <div style={{ padding: "10px", display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", justifyContent: "center" }}>
              <div style={{ fontSize: 16, fontWeight: "bold", color: "#003399" }}>
                Kindly Read This OTP :
              </div>
              <div style={{ fontSize: 26, fontWeight: "bold", color: "#003399" }}>
                {userData?.data?.kycDetail?.otp}
              </div>
            </div>
            <div style={{ padding: "20px", display: "flex", flexDirection: "row", justifyContent: "center", gap: 5 }}>
              {capturing ? (
                <>
                  <Button className='button-video1' onClick={handlePauseCaptureClick}>
                    {paused ? 'Resume Capture' : 'Pause Capture'}
                  </Button>
                  <Button className='button-video1' onClick={handleStopCaptureClick}>Stop Capture</Button>
                  <Button className='button-video1' onClick={handleRetakeClick}>Retake</Button>
                </>
              ) : (
                <Button className='button-video1' onClick={handleStartCaptureClick}>Start Capture</Button>
              )}
              {recordedChunks.length > 0 && (
                <Button style={{ marginLeft: 5 }} className='button-video' onClick={handleDownload}>Download</Button>
              )}
            </div>
            <div style={{ margin: "5px 20px" }}>
              {recordedChunks.length > 0 && (
                <Button style={{ width: "100%" }} onClick={handleSubmit} className='button-video1'>Submit</Button>
              )}
            </div>
          </div>
        </div>
      </> : screenView === true ? 
      <div style={{
        display: "flex",
        flexDirection:"column",
        gap:30,
        alignItems: "center",
        justifyContent: "center",
        marginTop: "50%"
      }}><img src={successScreen} />
      <div style={{fontSize:"18px",fontWeight:"bold",color:"#003399"}}>Thank you for the Video KYC</div></div> : <>
      <div style={{
        display: "flex",
        flexDirection:"column",
        gap:30,
        alignItems: "center",
        justifyContent: "center",
        marginTop: "50%"
      }}><img src={failScreen} />
      <div style={{fontSize:"18px",fontWeight:"bold",color:"#003399"}}>Video KYC Failed</div></div>
      </>}
    </>
  );
};

export default VideoKyc;
