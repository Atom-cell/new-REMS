import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "./ConferenceCall.css";
import Peer from "simple-peer";
import io from "socket.io-client";


const socket = io.connect("http://localhost:5000");
const ConferenceCall = (props) => {
  const { roomId } = useParams();
  const [mystream, setMyStream] = useState();
  const myVideo = useRef();

  const [me, setMe] = useState("");
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // getting my own local stream first
        setMyStream(stream);
        // play the local stream on my video
        myVideo.current.srcObject = stream;
      });
      
      // emit join room signal so that server can listen on this event
      // Join room with a specific room id and a user id
      socket.emit("join-room", roomId);

  }, []);


  socket.on("user-connected", ()=>{
    // whenever new user connects
    connectNewUser();
  })

  const connectNewUser = ()=>{
    console.log("New User");
  }

  return (
    <div class="main">
      <div class="main__left">
        <div class="main__videos">
          <div id="video-grid">
          {mystream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            )}
          </div>
        </div>
        <div class="main__controls">
          <div class="main__controls__block">
            <div
              onclick="muteUnmute()"
              class="main__controls__button main__mute_button"
            >
              <i class="fas fa-microphone"></i>
              <span>Mute</span>
            </div>
            <div
              onclick="playStop()"
              class="main__controls__button main__video_button"
            >
              <i class="fas fa-video"></i>
              <span>Stop Video</span>
            </div>
          </div>
          <div class="main__controls__block">
            <div class="main__controls__button">
              <i class="fas fa-shield-alt"></i>
              <span>Security</span>
            </div>
            <div class="main__controls__button">
              <i class="fas fa-user-friends"></i>
              <span>Participants</span>
            </div>
            <div class="main__controls__button">
              <i class="fas fa-comment-alt"></i>
              <span>Chat</span>
            </div>
          </div>
          <div class="main__controls__block">
            <div class="main__controls__button">
              <span class="leave_meeting">Leave Meeting</span>
            </div>
          </div>
        </div>
      </div>
      <div class="main__right">
        <div class="main__header">
          <h6>Chat</h6>
        </div>
        <div class="main__chat_window">
          <ul class="messages"></ul>
        </div>
        <div class="main__message_container">
          <input
            id="chat_message"
            type="text"
            placeholder="Type message here..."
          />
        </div>
      </div>
    </div>
  );
};

export default ConferenceCall;
