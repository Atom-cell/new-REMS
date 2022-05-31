import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import "./ConferenceCall.css";
import Peer from "peerjs";
import io from "socket.io-client";
import SendIcon from "@material-ui/icons/Send";

const peer = new Peer(undefined, {
  host: "/",
  port: 5000,
  path: "/peerjs",
  // pingInterval: 5000,
});

const socket = io.connect("http://localhost:5000");
const peers = {};
const ConferenceCall = ({ username }) => {
  const { roomId } = useParams();
  const [mystream, setMyStream] = useState();
  const myVideo = useRef();
  const [text, setText] = useState("");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Hello");
        // getting my own local stream first
        setMyStream(stream);
        // play the local stream on my video
        myVideo.current.srcObject = stream;

        peer.on("call", (call) => {
          console.log("IN CALLLL");
          // answer the call that the new user joins
          call.answer(stream);
          const video = document.createElement("video");
          // add video stream from the new user to front end
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-connected", (userId) => {
          // whenever new user connects
          setTimeout(connectNewUser, 1000, userId, stream);
        });

        // when user disconnects
        socket.on("user-disconnected", (userId) => {
          if (peers[userId]) peers[userId].close();
        });
      });

    //Listen on peer connection
    peer.on("open", (id) => {
      // id is for the specific person who is connecting or joining the room
      // pass that specific person id who joined the room to server
      // console.log("My Peer Id"+id);

      // emit join room signal so that server can listen on this event
      // Join room with a specific room id and a user id coming from the peer id
      socket.emit("join-room", roomId, id);

      // get message from server

      socket.on("createMessage", (message) => {
        const messageBox = document.getElementById("unorderedListMessage");
        // messageBox.append(`<li class="message"><b>user</b><br/>${message}</li>`);
        const msgItem = document.createElement("li");
        const boldItem = document.createElement("b");
        msgItem.setAttribute("class", "message");
        boldItem.innerHTML = username;
        msgItem.innerHTML = message;
        messageBox.appendChild(boldItem);
        messageBox.append(msgItem);

        // scrollToBottom()
        // alert(message);
      });
    });
  }, []);

  const connectNewUser = (userId, stream) => {
    console.log("New User:" + userId);
    // Now use peer connection to call a user
    // call user with the id and send him my stream
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    video.setAttribute("class", "myVideo");
    // when called add that stream on the front end
    call.on("stream", (userVideoStream) => {
      // userVideoStream is the person joining the call stream
      addVideoStream(video, userVideoStream);
    });

    call.on("close", () => {
      video.remove();
    });

    peers[userId] = call;
  };

  const addVideoStream = (video, stream) => {
    console.log("ADD VIDEO STREAM");
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    const videoGrid = document.getElementById("video-grid");
    videoGrid.append(video);
    console.log(videoGrid);
  };

  const muteUnmute = () => {
    // get current stream
    const enabled = mystream.getAudioTracks()[0].enabled;
    // if its enabled disable it
    if (enabled) {
      mystream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    }
    // if its disabled enable it
    else {
      setMuteButton();
      mystream.getAudioTracks()[0].enabled = true;
    }
  };

  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `;
    document.querySelector(".main__mute_button").innerHTML = html;
  };

  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `;
    document.querySelector(".main__mute_button").innerHTML = html;
  };

  // stop or play video

  const stopVideo = () => {
    let enabled = mystream.getVideoTracks()[0].enabled;
    if (enabled) {
      mystream.getVideoTracks()[0].enabled = false;
      setPlayVideo();
    } else {
      setStopVideo();
      mystream.getVideoTracks()[0].enabled = true;
    }
  };

  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `;
    document.querySelector(".main__video_button").innerHTML = html;
  };

  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `;
    document.querySelector(".main__video_button").innerHTML = html;
  };

  // scroll bar for messages window
  // const scrollToBottom = () => {
  //   var d = $('.main__chat_window');
  //   d.scrollTop(d.prop("scrollHeight"));
  // }

  // handling messaging
  const handleSendMessage = (msg) => {
    // alert(msg);
    socket.emit("message", msg);
    setText("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage(text);
    }
  };

  const handleLeave = () => {
    const vid = document.getElementsByClassName("myVideo");
    vid.pause();
    vid.src = "";
    mystream.stop();
  };

  return (
    <div className="main">
      <div className="main__left">
        <div className="main__videos">
          <div id="video-grid">
            {mystream && (
              <video
                className="myVideo"
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: "300px" }}
              />
            )}
          </div>
        </div>
        <div className="main__controls">
          <div className="main__controls__block">
            <div
              onClick={() => muteUnmute()}
              className="main__controls__button main__mute_button"
            >
              <i className="fas fa-microphone"></i>
              <span>Mute</span>
            </div>
            <div
              onClick={() => stopVideo()}
              className="main__controls__button main__video_button"
            >
              <i className="fas fa-video"></i>
              <span>Stop Video</span>
            </div>
          </div>
          <div className="main__controls__block">
            <div className="main__controls__button">
              <i className="fas fa-shield-alt"></i>
              <span>Security</span>
            </div>
            <div className="main__controls__button">
              <i className="fas fa-user-friends"></i>
              <span>Participants</span>
            </div>
            <div className="main__controls__button">
              <i className="fas fa-comment-alt"></i>
              <span>Chat</span>
            </div>
          </div>
          <div className="main__controls__block">
            <div className="main__controls__button">
              <Link
                to="/allMeetings"
                className="leave_meeting"
                onClick={() => handleLeave()}
              >
                Leave Meeting
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="main__right">
        <div className="main__header">
          <h2>Chat</h2>
        </div>
        <div className="main__chat_window">
          <ul className="messages" id="unorderedListMessage"></ul>
        </div>
        <div className="main__message_container">
          <input
            id="chat_message"
            type="text"
            placeholder="Type message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e)}
          />
          <SendIcon
            style={{ fill: "#fff", fontSize: "30px" }}
            onClick={() => handleSendMessage(text)}
          />
          {/* <button onClick={() => handleSendMessage(text)}>Send Message</button> */}
        </div>
      </div>
    </div>
  );
};

export default ConferenceCall;

// connectToNewUser()
// first we call user using peer.call() then
// Connect to new user and send to the new user our own stream

// IN useEffect, peer.on("call")
// whenever a new user calls us we answer it and add it to video stream
