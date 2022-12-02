import React from "react";
import { useStopwatch } from "react-timer-hook";
import { TimerContext } from "../Helper/Context";
import { ProjectNameContext } from "../Helper/Context";
import { Pause, PlayArrow, Stop } from "@mui/icons-material";
import IconButton from "@material-ui/core/IconButton";

const PauseTimer = ({ pauseTime }) => {
  const stopwatchOffset = new Date();
  stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + 300);
  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: true });

  const secondTime = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const minuteTime = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const hourTime = hours < 10 ? `0${hours}` : `${hours}`;

  const { timer, setTimer } = React.useContext(TimerContext);
  const { name, setName } = React.useContext(ProjectNameContext);

  //[pause , play, stop]
  const [btnState, setBtnState] = React.useState([false, false, false]);

  // console.log("HRS: ", secondTime);

  //   const startBtn = () => {
  //     console.log("PROJECT: ", name);

  //     if (name) {
  //       setTimer(true);
  //       if (btnState[1] === false && btnState[2] === false) {
  //         let a = [...btnState];
  //         a[0] = false;
  //         a[1] = true;
  //         a[2] = false;
  //         setBtnState([...a]);
  //         start();
  //       } else if (btnState[2] === true) {
  //         //stopped has been pressed
  //         let a = [...btnState];
  //         a[0] = false;
  //         a[1] = true;
  //         a[2] = false;
  //         setBtnState([...a]);

  //         reset();
  //         start();
  //       }
  //     } else {
  //       alert("Please select a project");
  //     }
  //   };

  const stopBtn = () => {
    setTimer(false);
    let a = [...btnState];
    a[0] = false;
    a[1] = false; // play
    a[2] = true; //stop
    setBtnState([...a]);
    reset();
    pause();
    pauseTime(hourTime, minuteTime, secondTime);
  };

  //   const pauseBtn = () => {
  //     if (!btnState[0]) {
  //       setBreaks((prevState) => prevState + 1);
  //       let a = [...btnState];
  //       a[0] = true;
  //       a[1] = false;
  //       a[2] = false; //stop
  //       setBtnState([...a]);
  //       pause();
  //     } else {
  //       alert("paused is pressed");
  //     }
  //   };

  //   const uploadTime = () => {
  //     axios
  //       .post("/myprojects/hoursWorked", {
  //         time: `${hourTime}:${minuteTime}:${secondTime}`,
  //         breaks: breaks,
  //         _id: name.id,
  //       })
  //       .then((rec) => {})
  //       .catch((err) => console.log(err));

  //     let a = {};
  //     setName(null);
  //   };
  return (
    <div
      style={{
        fontSize: "1rem",
        textAlign: "center",
        marginTop: "0.2em",
      }}
    >
      <span>{name ? name.name : null} </span>

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

export default PauseTimer;
