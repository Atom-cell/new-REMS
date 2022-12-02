import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";
const CallNotification = ({
  callAccepted,
  callerName,
  answerCall,
  receivingCall,
  rejectCall,
  setCallAccepted,
  stream,
  userVideo,
  connectionRef,
  setCallerName,
  caller,
  setCaller,
  both,
  user,
  setUser,
  setStream,
  setReceivingCall,
  setCallerSignal,
  setBoth,
}) => {
  const navigate = useNavigate();
  return (
    <Modal centered show={receivingCall && !callAccepted}>
      <Modal.Header>
        <Modal.Title>
          <h1>{callerName} is calling...</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="contained" color="primary" onClick={answerCall}>
          Answer
        </Button>
        <Button variant="contained" color="secondary" onClick={rejectCall}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CallNotification;
