import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import Peer from "simple-peer";
// import io from "socket.io-client";
import "./videocall.css";
import { Link, useNavigate } from "react-router-dom";
import VideoCallControls from "./VideoCallControls";
import ChatOnline from "../Chat/ChatOnline";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8900");
const VideoCall = ({ onlineUsers, setOnlineUsers }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerName, setCallerName] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState();
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [userStream, setUserStream] = useState();
  const [both, setBoth] = useState();
  const myVideo = useRef();
  const userVideo = useRef();
  // allows to disconnect the call
  const connectionRef = useRef();

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
          // set my stream
          setStream(stream);
          myVideo.current.srcObject = stream;
        });

      socket.on("me", (id) => {
        setMe(id);
      });

      socket.on("callUser", (data) => {
        // console.log(data);
        setReceivingCall(true);
        setCaller(data.from);
        setCallerName(data.name);
        setCallerSignal(data.signal);
      });

      socket.on("setBothCallers", (data) => {
        // console.log("Both callers Id:");
        // console.log(data);
        setBoth([data.to, data.from]);
      });
    }
  }, []);

  const callUser = (id) => {
    // console.log(id);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: JSON.parse(localStorage.getItem("user"))._id,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
      setUserStream(stream);
    });
    socket.on("callAccepted", (signal, name) => {
      setCallAccepted(true);
      setCallerName(name);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  useEffect(() => {
    socket.emit("addUser", JSON.parse(localStorage.getItem("user"))._id);
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("leaveCallId", (friend, name) => {
      // callAccepted && !callEnded
      // console.log(name);
      toast.info(`${name} Ended the call`);
      // window.location.reload();
      navigate("/dashboard");
    });

    // socket.on("userSocketId", (friend) => {
    //   console.log(friend.socketId);
    //   setIdToCall(friend.socketId);
    // });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      // console.log("Signal");
      // console.log(data);
      socket.emit("answerCall", { signal: data, to: caller, name: name });
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
    let otherId = "";
    if (!caller) {
      otherId = both.find((usr) => usr != user._id);
      socket.emit("leaveCall", otherId, user._id, name);
    } else socket.emit("leaveCall", caller, user._id, name);
    // window.location.reload();
    navigate("/dashboard");
  };

  // const handleChatOnlineClick = (friend) => {
  //   socket.emit(
  //     "getUserSocketId",
  //     friend._id,
  //     JSON.parse(localStorage.getItem("user"))._id
  //   );
  // };

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
            <VideoCallControls
              leaveCall={leaveCall}
              mystream={stream}
              callAccepted={callAccepted}
              callEnded={callEnded}
            />
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
          // handleChatOnlineClick={handleChatOnlineClick}
          callUser={callUser}
          idToCall={idToCall}
          callAccepted={callAccepted}
          callEnded={callEnded}
          leaveCall={leaveCall}
        />
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
