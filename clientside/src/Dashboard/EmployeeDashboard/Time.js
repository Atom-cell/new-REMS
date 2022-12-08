import React from "react";
import axios from "axios";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

const Time = () => {
  const [data, setData] = React.useState();
  const [avg, setAvg] = React.useState(); //for showing in 11:11:11 format
  const [avgNum, setAvgNum] = React.useState();
  const [difference, setDifference] = React.useState();

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("/emp/dash/activeTime", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    setData([...res.data.totalTime]);
    console.log("TMEEEEE: ", res.data.totalTime);
    findAvg(res.data.totalTime);
  };

  const findAvg = (arr) => {
    let sum = 0;
    arr.forEach((a) => {
      sum += a.activetime.Seconds;
    });
    console.log("TOTAL SUM: ", Math.ceil(sum / arr?.length));
    setAvgNum(Math.ceil(sum / arr?.length));

    setAvg(timeConvert(Math.ceil(sum / arr?.length)));
  };

  const timeConvert = (s) => {
    if (s) {
      let time = new Date(s * 1000).toISOString().slice(11, 19);
      return time;
    } else return 0;
  };

  const yesterday = () => {
    if (data) {
      const time = data[data?.length - 1];
      return timeConvert(time?.activetime.Seconds);
    } else return "00:00:00";
  };

  const yesterdaySeconds = () => {
    if (data) {
      const time = data[data?.length - 1];
      if (time?.activetime.Seconds > avgNum) return true;
    } else return false;
  };

  return (
    <div className="featuredItem">
      <span className="featuredTitle">Average Online Time</span>
      <div className="featuredMoneyContainer">
        <span className="featuredMoney">{avg}</span>
      </div>
      <span className="featuredSub">Previous Session</span>
      <span style={{ fontSize: "15px", marginLeft: "0.5em" }}>
        {yesterday()}
      </span>
      <span style={{ fontSize: "22px", marginLeft: "0.9em" }}>
        {yesterdaySeconds() ? (
          <>
            <span>+</span>
            <ArrowUpward
              className="featuredIcon negative"
              style={{ fill: "green" }}
            />
          </>
        ) : (
          <>
            <span>-</span>
            <ArrowDownward
              className="featuredIcon negative"
              style={{ fill: "red" }}
            />
          </>
        )}
      </span>
      {/* <span>{difference}</span> */}
    </div>
    // <div className="featuredItem">
    //   <span className="featuredTitle">Total Hours Worked</span>
    //   <div className="featuredMoneyContainer">
    //     <span className="featuredMoney">30:25 hrs </span>
    //     <span className="featuredMoneyRate">
    //       -11.4{" "}
    //       <ArrowDownward
    //         className="featuredIcon negative"
    //         style={{ fill: "red" }}
    //       />
    //     </span>
    //   </div>
    // </div>
  );
};

export default Time;
