import React from "react";
import axios from "axios";
import { useStopwatch } from "react-timer-hook";
import { TimerContext } from "../Helper/Context";
import { ProjectNameContext } from "../Helper/Context";
import { Pause, PlayArrow, Stop } from "@mui/icons-material";
import IconButton from "@material-ui/core/IconButton";

const Timer = () => {
  const stopwatchOffset = new Date();
  stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + 300);
  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });
  const secondTime = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const minuteTime = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const hourTime = hours < 10 ? `0${hours}` : `${hours}`;

  const { timer, setTimer } = React.useContext(TimerContext);
  const { name, setName } = React.useContext(ProjectNameContext);
  const [breaks, setBreaks] = React.useState(0);

  //[pause , play, stop]
  const [btnState, setBtnState] = React.useState([false, false, false]);

  const startBtn = () => {
    console.log("PROJECT: ", name);
    if (name) {
      setTimer(true);
      if (btnState[1] === false && btnState[2] === false) {
        let a = [...btnState];
        a[0] = false;
        a[1] = true;
        a[2] = false;
        setBtnState([...a]);
        start();
      } else if (btnState[2] === true) {
        //stopped has been pressed
        let a = [...btnState];
        a[0] = false;
        a[1] = true;
        a[2] = false;
        setBtnState([...a]);

        reset();
        start();
      }
    } else {
      alert("Please select a project");
    }
  };

  const stopBtn = () => {
    if (name) {
      alert("aa");
      uploadTime();
    }

    setTimer(false);
    setBreaks(0);
    let a = [...btnState];
    a[0] = false;
    a[1] = false; // play
    a[2] = true; //stop
    setBtnState([...a]);
    reset();
    pause();
  };

  const pauseBtn = () => {
    setBreaks((prevState) => prevState + 1);
    let a = [...btnState];
    a[0] = true;
    a[1] = false;
    a[2] = false; //stop
    setBtnState([...a]);
    pause();
  };

  const uploadTime = () => {
    axios
      .post("/myprojects/hoursWorked", {
        time: `${hourTime}:${minuteTime}:${secondTime}`,
        breaks: breaks,
        _id: name.id,
      })
      .then((rec) => {})
      .catch((err) => console.log(err));

    let a = {};
    setName(null);
  };
  return (
    <div style={{ fontSize: "1.7rem", textAlign: "center" }}>
      <span>{name ? name.name : null} </span>
      <IconButton
        onClick={pauseBtn}
        style={btnState[0] ? { backgroundColor: "#fff" } : null}
      >
        <Pause />
      </IconButton>
      <IconButton
        onClick={() => {
          startBtn();
        }}
        style={isRunning ? { backgroundColor: "#fff" } : null}
      >
        <PlayArrow style={{ fill: "green" }} />
      </IconButton>
      <IconButton
        onClick={() => stopBtn()}
        style={
          btnState[2]
            ? { backgroundColor: "#fff", marginRight: "1em" }
            : { marginRight: "1em" }
        }
      >
        <Stop style={{ fill: "red" }} />
      </IconButton>
      <span style={{ marginRight: "1em" }}>
        {hourTime} : {minuteTime} : {secondTime}
      </span>
    </div>
  );
};

export default Timer;
