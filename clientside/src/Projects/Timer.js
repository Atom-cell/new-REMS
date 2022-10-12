import React from "react";
import axios from "axios";
import { useStopwatch } from "react-timer-hook";
import PauseTimer from "./PauseTimer";
import { TimerContext } from "../Helper/Context";
import { ProjectNameContext } from "../Helper/Context";
import { Pause, PlayArrow, Stop } from "@mui/icons-material";
import IconButton from "@material-ui/core/IconButton";
import { toast } from "react-toastify";

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
  const [breaks, setBreaks] = React.useState([]);

  //[pause , play, stop]
  const [btnState, setBtnState] = React.useState([false, false, false]);

  const pauseTime = (h, m, s) => {
    console.log(h, ":", m, ":", s);
    let a = [...breaks];
    a.push(`${h}:${m}:${s}`);
    setBreaks([...a]);
    startBtn();
  };

  const startBtn = () => {
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
    if (name && secondTime > 0) {
      console.log("UPLoadings Timez");
      uploadTime();
    }

    setTimer(false);
    setBreaks([]);
    let a = [...btnState];
    a[0] = false;
    a[1] = false; // play
    a[2] = true; //stop
    setBtnState([...a]);
    reset();
    pause();
  };

  const pauseBtn = () => {
    if (!btnState[0]) {
      let a = [...btnState];
      a[0] = true;
      a[1] = false;
      a[2] = false; //stop
      setBtnState([...a]);
      pause();
    } else {
      //alert("paused is pressed");
    }
  };

  const Uname = () => {
    return JSON.parse(localStorage.getItem("user"));
  };
  const uploadTime = () => {
    const { username } = Uname();
    axios
      .post("http://localhost:5000/myProjects/hoursWorked", {
        time: `${hourTime}:${minuteTime}:${secondTime}`,
        breaks: breaks,
        _id: name.id,
        username: username,
      })
      .then((rec) => {})
      .catch((err) => console.log(err));

    let a = {};
    setName(null);
    toast.success("WellDone!!");
  };
  return (
    <>
      {btnState[0] ? (
        <PauseTimer pauseTime={pauseTime} />
      ) : (
        <div
          style={{
            fontSize: "1.7rem",
            textAlign: "center",
            marginTop: "0.2em",
          }}
        >
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
      )}
    </>
  );
};

export default Timer;
