import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./videocall.css";
import { Link } from "react-router-dom";
import VideoCallControls from "./VideoCallControls";
import ChatOnline from "../Chat/ChatOnline";
const socket = io.connect("http://localhost:5000");
const VideoCall = () => {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState();
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [callerName, setCallerName] = useState("");
  const [userStream, setUserStream] = useState();
  const myVideo = useRef();
  const userVideo = useRef();
  // allows to disconnect the call
  const connectionRef = useRef();

  const [onlineUsers, setOnlineUsers] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      // console.log(user);
      setUser(user);
      setName(user?.username);

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          console.log("Hello");
          // set my stream
          setStream(stream);
          myVideo.current.srcObject = stream;
        });

      socket.on("me", (id) => {
        setMe(id);
      });

      socket.on("callUser", (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerName(data.name);
        setCallerSignal(data.signal);
      });
    }
  }, []);

  useEffect(() => {
    socket.emit("addUser", JSON.parse(localStorage.getItem("user"))._id);
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("userSocketId", (friend) => {
      // console.log(friend.socketId);
      setIdToCall(friend.socketId);
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
      setUserStream(stream);
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  const handleChatOnlineClick = (friend) => {
    socket.emit(
      "getUserSocketId",
      friend._id,
      JSON.parse(localStorage.getItem("user"))._id
    );
  };

  const rejectCall = () => {
    // receivingCall && !callAccepted ?
    setReceivingCall(false);
    setCallAccepted(false);
  };

  return (
    <div className="videocallContainer">
      <div className="video-call-container-container">
        <div className="video-container">
          <div className="video">
            <div>
              <h3>{user?.username}</h3>
            </div>
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            )}
            <VideoCallControls leaveCall={leaveCall} mystream={stream} />
          </div>
          <div className="video">
            {callAccepted && !callEnded ? (
              <>
                <h3>{callerName}</h3>
                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  style={{ width: "300px" }}
                />
                {/* <VideoCallControls
                  leaveCall={leaveCall}
                  mystream={userStream}
                /> */}
              </>
            ) : null}
          </div>
        </div>
        <ChatOnline
          onlineUsers={onlineUsers}
          currentId={user?._id}
          handleChatOnlineClick={handleChatOnlineClick}
          callUser={callUser}
          idToCall={idToCall}
          callAccepted={callAccepted}
          callEnded={callEnded}
          leaveCall={leaveCall}
        />
        {/* <div className="myId">
          <TextField
            id="filled-basic"
            label="Name"
            variant="filled"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "20px" }}
            disabled={true}
          />
          <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AssignmentIcon fontSize="large" />}
            >
              Copy ID
            </Button>
          </CopyToClipboard>

          <TextField
            id="filled-basic"
            label="ID to call"
            variant="filled"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
                End Call
              </Button>
            ) : (
              <IconButton
                color="primary"
                aria-label="call"
                onClick={() => callUser(idToCall)}
              >
                <PhoneIcon fontSize="large" />
              </IconButton>
            )}
            {idToCall}
          </div>
        </div> */}
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{callerName} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={rejectCall}
              >
                Decline
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
