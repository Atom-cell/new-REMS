import React from "react";
import "./ProductivityReport.css";
import { Avatar, Divider } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import "../components/EmpManage.css";
import { Table, Button } from "react-bootstrap";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ExcelExport from "./ExcelExport";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ChartBar from "./ChartBar";
import { toast } from "react-toastify";

const ProductivityReport = () => {
  const [user, setUser] = React.useState();
  const [allEvents, setAllEvents] = React.useState([]); //for attendance
  const [valueCal, onChangeCal] = React.useState(new Date());
  const [inOut, setInOut] = React.useState([]);
  const [data, setData] = React.useState([]); //all emps of admin
  const [active, setActive] = React.useState([]);
  const [boards, setBoards] = React.useState([]);
  const [chartDataProject, setchartDataProject] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  const [totalTimeofProjects, setTotalTimeOfProjects] = React.useState();
  const [projectTime, setProjectTime] = React.useState();
  const [productivity, setProductivity] = React.useState();
  const [totalActive, setTotalActive] = React.useState({});
  const [loading, setLoading] = React.useState(0);
  const [name, setName] = React.useState("");
  const date = new Date();
  const [value, setValue] = React.useState(dayjs(date.toJSON().slice(0, 10)));
  const [workingDays, setWorkingDays] = React.useState(0);
  const [absents, setAbsents] = React.useState(0);
  const [chartDataInOut, setChartDataInOut] = React.useState();
  const [chartDataApps, setChartDataApps] = React.useState();
  const days = [];
  var month = new Date(value).getMonth() + 1;
  var year = new Date(value).getFullYear();

  let totalDays = new Date(year, month, 0).getDate();
  for (let i = 1; i <= totalDays; i++) {
    if (i < 10) {
      days.push({
        date: `${new Date(value).getMonth() + 1}/${i}/${year}`,
        In: "A",
        Out: "A",
        totalTime: 0,
      });
    } else {
      days.push({
        date: `${new Date(value).getMonth() + 1}/${i}/${year}`,
        In: "A",
        Out: "A",
        totalTime: 0,
      });
    }
  }
  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    getActiveIdleData();
    getProject();
  }, [user]);

  React.useEffect(() => {
    filterBoards();
  }, [projects, boards]);

  const getAllData = () => {
    getInOutData();
    getTeams();
    // calculateProductivity();
  };

  const getData = async () => {
    await axios
      .get("http://localhost:5000/admin/getLogEmps", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        // console.log(response.data.data);
        setData([...response.data.data]);
        setLoading(1);
      });
  };

  const handleChange = (event) => {
    setName(event.target.value);
    console.log(event.target.value);
  };

  const getInOutData = async () => {
    data.forEach((d) => {
      if (d._id === name) {
        setUser(d);
        // console.log("USER: ", d);
        setAllEvents([...d.attendance]);
      }
    });
    let inout = [];
    await axios
      .get(`http://localhost:5000/report/InOutLast/${name}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        inout = [...response.data];
        console.log("INOOOOOUT ", response.data);
        let aa = [];
        for (let i = 0; i < days.length; i++) {
          let flag = false;
          for (let j = 0; j < inout.length; j++) {
            if (days[i].date === inout[j].date) {
              flag = true;
              if (days[i].In === undefined) {
                let obj = { ...inout[j] };
                obj.In = new Date(inout[j].In).toLocaleTimeString();
                obj.Out = new Date(inout[j].Out).toLocaleTimeString();
                delete obj._id;
                aa.push(obj);
              } else if (days[i].In || days[i].Out) {
                let obj = { ...inout[j] };
                obj.In = new Date(inout[j].In).toLocaleTimeString();
                obj.Out = new Date(inout[j].Out).toLocaleTimeString();
                delete obj._id;
                aa.push(obj);
              }
            }
          }
          if (!flag) aa.push(days[i]);
        }

        setInOut([...aa]);
        console.log("INOUUT ARRY : ", aa);
        getTotalWorkingDays(aa);
        convertDataForChart(aa);
      });

    await axios
      .get("http://localhost:5000/report/onlymyboards", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("BOARDS :;  ", response.data);
        let a = response.data.map((b) => {
          return b.boards;
        });

        console.log("NNNNNNNNNNNN: ", a);
        setBoards([...response.data]);
      });
  };

  const getTeams = async () => {
    await axios
      .get(`http://localhost:5000/report/empTeams/${name}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setTeams([...response.data]);
      });
  };

  const getProject = async () => {
    let data = [];
    await axios
      .get(`http://localhost:5000/report/employeeprojects/${name}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("projects ", response.data);
        setProjects([...response.data]);
        data = [...response.data];
        setLoading(1);
      });
    filterProjectDataForChart([...data]); //for chart
    filterProjectData([...data], month); //for total time spent in projects
  };

  //time spent doing the projects
  const filterProjectData = (arr, m) => {
    const name = user?.username;
    let totalTime = 0;
    let secs = [];

    arr.forEach((a) => {
      a.hoursWorked.forEach((h) => {
        if (h.user === name && h.date.slice(3, 5) == m) {
          console.log("Hours worked Array: ", h);
          let str = h.time.split(":");
          str = str[0] * 3600 + str[1] * 60 + str[2] * 1;
          secs.push(str);
          totalTime += str;
          console.log("SECS:  ", str);
        }
      });
    });

    setTotalTimeOfProjects(totalTime);
    console.log("Total time workedon : ", totalTime);
    setProjectTime(timeConvert(totalTime));
  };

  const filterProjectDataForChart = (arr) => {
    const name = user?.username;

    let newArr = [];
    arr.forEach((d) => {
      if (d.hoursWorked.length >= 1) {
        let obj = {};
        obj.projectName = d.projectName;
        obj.totalTime = calculateTotalHourForChart(d.hoursWorked, name);
        newArr.push(obj);
      } else {
        newArr.push({ projectName: d.projectName, totalTime: 0 });
      }
    });
    setchartDataProject([...newArr]);
    console.log("new arr for proj chart ", newArr);
  };

  // only selected months projects boards//
  ////////////////////////////////////////
  const filterBoards = () => {
    console.log("filterProjsfilterprojs: ", projects);
    console.log("filterBoardsfilterBoards: ", boards);
    let projectID = projects.map((p) => p._id);
    let newBoards = [];

    boards.forEach((b) => {
      if (projectID.includes(b.projectId)) {
        newBoards.push(b);
      }
    });

    newBoards = newBoards.map((b) => {
      return b.boards;
    });

    console.log("new boards: ", newBoards);

    let empcards = [];
    let completed = 0;
    let assigned = 0;
    newBoards.forEach((b) => {
      b?.forEach((cards) => {
        cards.cards?.forEach((a) => {
          if (a.assignedTo === name) {
            empcards.push(a.tasks);
            assigned += a.tasks.length;
            a.tasks.forEach((tasks) => {
              if (tasks.completed) completed++;
            });
          }
        });
      });
    });

    let percent = totalTimeofProjects * 0.3 + (completed / assigned) * 0.7;
    console.log("total time of projects: ", totalTimeofProjects);
    console.log("completed ", completed);
    console.log("assingned: ", assigned);
    console.log("percent ", percent);
    setProductivity(percent);
  };

  const calculateTotalHourForChart = (hours, n) => {
    let totalSeconds = 0;
    hours.forEach((h) => {
      if (h.user === n) {
        let time = h.time.split(":");
        totalSeconds += parseInt(time[0] * 3600 + time[1] * 60 + time[2] * 1);
      }
    });
    let time = totalSeconds / 3600;
    return parseFloat(time.toFixed(2));
  };

  const getTotalWorkingDays = (aa) => {
    let arr = aa.reduce((unique, o) => {
      if (!unique.some((obj) => obj.date === o.date)) {
        unique.push(o);
      }
      return unique;
    }, []);

    let ab = arr.filter((a) => a.In !== "A");
    setWorkingDays(ab.length);
    setAbsents(arr.length - ab.length);
  };

  const convertDataForChart = (arr) => {
    arr = arr.map((a) => {
      if (a.In !== "A") {
        let str1 = a.In.split(":");
        let str2 = a.Out.split(":");

        let totalSeconds1 = parseInt(
          str1[0] * 3600 + str1[1] * 60 + str2[2] * 1
        );
        let totalSeconds2 = parseInt(
          str2[0] * 3600 + str2[1] * 60 + str2[2] * 1
        );
        let secs = (totalSeconds2 - totalSeconds1) / 3600;
        // console.log({ ...a, diff: secs });
        return { ...a, totalTime: secs.toFixed(2) };
      } else {
        return { ...a };
      }
    });
    let chartObj = {
      labels: arr.map((d) => d.date),
      datasets: [{ label: "Total Work Time", data: arr.map((d) => d.diff) }],
    };
    setChartDataInOut([...arr]);
    console.log(arr);
  };
  //////////////////////////////

  const getActiveIdleData = async () => {
    await axios
      .get(
        `http://localhost:5000/report/activeIdleLast/${name}/${month}/${year}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        setActive([...response.data.totalTime]);
        // console.log(response.data.totalTime);
        // console.log(response.data.separateTime);
        totalActiveIdleHours(response.data.totalTime);
        appsSitesFilter(response.data.appTime);
        // setUser(response.data);
      });
  };

  const totalActiveIdleHours = (arr) => {
    let active = 0;
    let idle = 0;

    arr.forEach((a) => {
      active += a.activetime.Seconds;
      idle += a.idletime.Seconds;
    });

    active = timeConvert(active);
    idle = timeConvert(idle);

    setTotalActive({ active: active, idle: idle });
  };

  const convert = (s) => {
    let hr = s / 60;
    return hr.toFixed(2);
  };

  const timeConvert = (s) => {
    let time = new Date(s * 1000).toISOString().slice(11, 19);
    return time;
    // let min = s / 60;
    // return min.toFixed(2);
  };

  const appsSitesFilter = (arr) => {
    let filter = [];
    arr.map((time) => {
      Object.entries(time.apps || {}).map(([key, value]) => {
        let flag = false;
        let nn = "";

        for (let i = 0; i < key.length; i++) {
          //if (flag) nn += key.charAt(i);
          if (key.charAt(i) === "-") {
            flag = true;
            nn = key.slice(i + 1, key.length);
            break;
          }
        }
        //if no dash in name
        if (!flag) {
          let ob = { name: key, time: value };
          for (let i = 0; i < filter.length; i++) {
            if (filter[i].name === key) {
              ob.time = filter[i].time + value;
              filter.splice(i, 1);
            }
          }
          filter.push(ob);
        } else {
          let ob = { name: nn, time: value };

          for (let i = 0; i < filter.length; i++) {
            if (filter[i].name === nn) {
              ob.time = filter[i].time + value;
              filter.splice(i, 1);
            }
          }
          filter.push(ob);
        }
      });
    });
    setChartDataApps([...filter]);
  };

  const calculateProductivity = async () => {};

  const aa = () => {
    let bb = [];
    boards.forEach((b) => {
      b.forEach((c) => {
        c.cards?.forEach((d) => {
          if (d.assignedTo === name) bb.push(d);
        });
      });
    });

    console.log(bb);
  };
  const fixTimezoneOffset = (date) => {
    if (!date) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toJSON();
  };
  return (
    <div>
      {/* <button
        onClick={() => {
          filterBoards();
        }}
      >
        clcick
      </button> */}
      {/* <h2 style={{ marginBottom: "1em" }}>Monthly In-Out</h2> */}
      <h2 style={{ marginBottom: "1em" }}>Monthly Productivity Report</h2>
      <div
        style={{
          display: "flex",
          marginBottom: "2rem",
          width: "100%",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <FormControl style={{ width: "20%", marginRight: "2em" }}>
            <InputLabel id="demo-simple-select-label">Employees</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={name}
              onChange={handleChange}
            >
              {data.map((data, index) => {
                return (
                  <MenuItem value={data._id} key={index}>
                    {data.username}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={["year", "month"]}
              label="Year and Month"
              minDate={dayjs("2012-03-01")}
              maxDate={dayjs("2023-06-01")}
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
                console.log("MOOOOOOOOnth: ", newValue.toLocaleDateString());
              }}
              renderInput={(params) => (
                <TextField {...params} helperText={null} />
              )}
            />
          </LocalizationProvider>
          <Button
            className="submitbtn"
            style={{ marginLeft: "2em" }}
            onClick={() => name && getAllData()}
          >
            Search
          </Button>
          {/* <ExcelExport excelData={inOut} fileName="Demo" /> */}
        </div>
      </div>

      <Divider />
      <div className="report_wrapper">
        <div className="name_email_wrapper">
          {/* <Avatar
            sx={{
              width: 80,
              height: 80,
            }}
            alt={user?.username}
            src={user?.profilePicture}
          /> */}
          <Avatar
            alt={user?.username}
            src={`data:image/jpeg;base64,${user?.profilePicture}`}
            sx={{ width: 80, height: 80 }}
          />

          <div className="name_email">
            <h3>{user?.username}</h3>
            <p>{user?.email}</p>
          </div>
        </div>
        <div className="time_box_wrapper">
          <div className="time_box1">
            <p>Total Hours Worked</p>
            <h4>{projectTime}</h4>
          </div>
          <div className="time_box">
            <p>Total Active Hours</p>
            <h4>{totalActive?.active}</h4>
          </div>
          <div className="time_box">
            <p>Total Idle Hours</p>
            <h4>{totalActive?.idle}</h4>
          </div>
          <div className="time_box">
            <p>Productivity %</p>
            <h4>{productivity ? productivity.toFixed(2) : null}%</h4>
          </div>
        </div>
        <div className="inout_chart">
          <h4>Monthly Check-In Check-Out</h4>
          {chartDataInOut?.length > 1 ? (
            <ChartBar
              chartData={chartDataInOut}
              xaxis="date"
              yaxis="totalTime"
            />
          ) : null}
        </div>

        <div className="inout_chart">
          <h4>Applications and Sites </h4>
          {chartDataApps?.length > 1 ? (
            <ChartBar chartData={chartDataApps} xaxis="name" yaxis="time" />
          ) : null}
        </div>
        <div className="inout_chart">
          <h4>Projects</h4>
          {chartDataProject?.length > 1 ? (
            <ChartBar
              chartData={chartDataProject}
              xaxis="projectName"
              yaxis="totalTime"
            />
          ) : null}
        </div>
        <div className="team_and_attendance">
          <div>
            <h4>Teams</h4>
            <Table hover bordered striped className="table">
              <thead>
                <tr>
                  <th className="thead">Team Name</th>
                  <th className="thead">Team Description</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t, i) => {
                  return (
                    <tr key={i}>
                      <td>{t.teamName}</td>
                      <td>{t.teamDesp}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          <div style={{ marginLeft: "2em", paddingTop: "1em" }}>
            <h4>Attendance</h4>
            {allEvents ? (
              <Calendar
                // onChange={(value) => {
                //   allEvents.forEach((x) => {
                //     console.log(x, " + ", `${value.getMonth() + 1}`);
                //     if (
                //       x.slice(5, 7) === `${value.getMonth() + 1}` ||
                //       x.slice(5, 7) === `0${value.getMonth() + 1}`
                //     ) {
                //     }
                //   });
                //   onChangeCal(value);
                // }}
                value={valueCal}
                tileClassName={({ date }) => {
                  if (
                    allEvents.find(
                      (x) =>
                        x.slice(0, 10) === fixTimezoneOffset(date).slice(0, 10)
                    )
                  ) {
                    // console.log(
                    //   "ERROR: ",
                    //   fixTimezoneOffset(date).slice(0, 10)
                    // );
                    return "present";
                  }
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityReport;
