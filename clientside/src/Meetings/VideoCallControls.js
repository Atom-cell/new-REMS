import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import "./videocallcontrol.css";

const VideoCallControls = ({
  leaveCall,
  mystream,
  callAccepted,
  callEnded,
}) => {
  // console.log("mystream"+mystream);
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
    // console.log(enabled);
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
    //   console.log("Hello");
    const html = `
          <i class="stop fas fa-video-slash"></i>
            <span>Play Video</span>
          `;
    document.querySelector(".main__video_button").innerHTML = html;
  };
  return (
    <div className="mutestop">
      <div className="mute main__mute_button" onClick={() => muteUnmute()}>
        <i className="fas fa-microphone"></i>
        <span>Mute</span>
      </div>
      <div className="stop main__video_button" onClick={() => stopVideo()}>
        <i className="fas fa-video"></i>
        <span>Stop Video</span>
      </div>
      <div className="main__controls__button">
        {/* <Link
          to="/dashboard"
          className="leave_meeting"
          onClick={() => leaveCall()}
        >
          Leave
        </Link> */}
        {callAccepted && !callEnded && (
          <Button variant="contained" color="secondary" onClick={leaveCall}>
            End Call
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoCallControls;
