import React from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
const TotalWorkTime = () => {
  const [time, setTime] = React.useState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const id = localStorage.getItem("id");
    let proj;
    await axios
      .get(`/admin/dash/projects/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        proj = response.data;
      });

    filterProjectData(proj);
  };

  const filterProjectData = (arr) => {
    let totalTime = 0;
    let secs = [];

    let day = new Date().getDate();
    if (day < 10) day = `0${day}`;
    let month = new Date().getMonth() + 1;
    arr?.forEach((a) => {
      a.hoursWorked?.forEach((h) => {
        if (h.date.slice(0, 2) == day) {
          let str = h.time.split(":");
          str = str[0] * 3600 + str[1] * 60 + str[2] * 1;
          secs.push(str);
          totalTime += str;
          console.log(totalTime);
        }
      });
    });

    setTime(timeConvert(totalTime));
    setLoading(false);
  };

  const timeConvert = (s) => {
    let time = new Date(s * 1000).toISOString().slice(11, 19);
    return time;
  };
  return (
    <div>
      {loading ? (
        <Spinner animation="grow" />
      ) : (
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{time} </span>
        </div>
      )}
    </div>
  );
};

export default TotalWorkTime;
