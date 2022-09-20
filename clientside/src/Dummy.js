import React from "react";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";
const Dummy = ({
  callAccepted,
  setCallAccepted,
  stream,
  userVideo,
  connectionRef,
  setCallerName,
  callerName,
  caller,
  setCaller,
  both,
  user,
  setUser,
  setStream,
  setReceivingCall,
  setCallerSignal,
  setBoth,
  answerCall,
  receivingCall,
  rejectCall,
}) => {
  const navigate = useNavigate();
  return (
    <div>
      {console.log("Hello")}
      {receivingCall && !callAccepted ? (
        <div className="caller">
          {console.log("Hello2")}
          <h1>{callerName} is calling...</h1>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate("/videoCall");
              answerCall();
            }}
          >
            Answer
          </Button>
          <Button variant="contained" color="secondary" onClick={rejectCall}>
            Decline
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Dummy;
