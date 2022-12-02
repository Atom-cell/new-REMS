import { MoreInfoContext } from "../Helper/Context";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Divider, Tooltip } from "@mui/material";
import { Table, Button, Spinner, Carousel, Breadcrumb } from "react-bootstrap";
import "./moreInfo.css";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      marginRight: "0.5em",
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}
function TableDate({ date }) {
  // alert("k");
  return <h4 style={{ fontWeight: "bold" }}>{date}</h4>;
}
function MoreInfo() {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = React.useState([]);
  const [value, onChange] = React.useState(new Date());

  const { moreInfo, setMoreInfo } = React.useContext(MoreInfoContext);
  const [data, setData] = React.useState({});
  const [totalTime, setTotalTime] = React.useState([]);
  const [totalTimeCopy, setTotalTimeCopy] = React.useState([]);
  const [apps, setApps] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [presents, setPresents] = React.useState(0);
  const [dayTime, setDayTime] = React.useState([]);
  const [dayTimeCopy, setDayTimeCopy] = React.useState([]);
  const [SS, setSS] = React.useState([]);
  const [showCal, setShowCal] = React.useState(false);
  const [proj, setProj] = React.useState([]);
  const [team, setTeam] = React.useState([]);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [btnOption, setBtnOption] = React.useState("info");

  //for dates of filtering
  const [from, setFrom] = React.useState(null);
  const [to, setTo] = React.useState(null);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let contextData = moreInfo;
    //console.log("CONTEXT: ", contextData);
    let a = contextData;

    setLoading(false);
    setData(a);
    setTotalTime(a.totalTime);
    setTotalTimeCopy(a.totalTime);
    setDayTime(a.separateTime);
    setDayTimeCopy(a.separateTime);
    setAllEvents([...a.attendance]);
    setApps(a.appTime);
    setSS([...a.screenshot]);

    getProjectInfo(a._id);
    getTeamInfo(a._id);
  };

  const getProjectInfo = (id) => {
    axios
      .get(`http://localhost:5000/admin/projectInfo/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setProj(response.data);
      });
  };

  const getTeamInfo = (id) => {
    axios
      .get(`http://localhost:5000/team/getMyTeam/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setTeam([...response.data.data]);
      });
  };

  const timeConvert = (s) => {
    let time = new Date(s * 1000).toISOString().slice(11, 19);
    return time;
    // let min = s / 60;
    // return min.toFixed(2);
  };

  const FilterDate = () => {
    console.log("\n");
    let newFrom = new Date(from).toLocaleDateString("fr-CA");
    let newTo = new Date(to).toLocaleDateString("fr-CA");

    console.log("FROM", typeof newFrom);
    console.log("TO", newTo);

    setTotalTime(
      totalTimeCopy.filter((tt) => {
        return tt.date.slice(0, 10) >= newFrom && tt.date.slice(0, 10) <= newTo;
      })
    );

    setApps(
      data.appTime.filter((tt) => {
        return tt.date.slice(0, 10) >= newFrom && tt.date.slice(0, 10) <= newTo;
      })
    );

    setDayTime(
      data.separateTime.filter((tt) => {
        return tt.date.slice(0, 10) >= newFrom && tt.date.slice(0, 10) <= newTo;
      })
    );

    setSS(
      data?.screenshot.filter((tt) => {
        console.log(tt);
        return tt.date.slice(0, 10) >= newFrom && tt.date.slice(0, 10) <= newTo;
      })
    );

    console.log("SSSSS", SS);
  };

  const openBase64InNewTab = (data, mimeType) => {
    var byteCharacters = window.atob(data);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], { type: mimeType + ";base64" });
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  };

  const fixTimezoneOffset = (date) => {
    if (!date) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toJSON();
  };

  const totalPresents = () => {
    console.log("MONTH", value.getMonth() + 1);
    let month = "";
    setPresents(0);
    if (value.getMonth() + 1 < 10) {
      month = `0${value.getMonth() + 1}`;
    } else {
      month = value.getMonth() + 1;
    }

    let a = 0;
    allEvents.forEach((x, index) => {
      if (x.slice(5, 7) === month) {
        a++;
      }
    });
    setPresents(a);
  };

  return (
    <div className="cnt">
      <Breadcrumb>
        <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item href="/empManage">Manage Employee</Breadcrumb.Item>
        <Breadcrumb.Item active>More Information</Breadcrumb.Item>
      </Breadcrumb>
      <div className="btn_grouop">
        <button
          className="btn_userInfo"
          onClick={() => setBtnOption("info")}
          id={btnOption === "info" ? "activeBtn" : ""}
        >
          Employee Information
        </button>
        <button
          className="btn_userAct"
          onClick={() => setBtnOption("activity")}
          id={btnOption === "activity" ? "activeBtn" : ""}
        >
          Employee Activity
        </button>
      </div>
      {btnOption === "info" ? (
        <div className="user_infoWrapper">
          <div className="user_heading">
            <Avatar
              alt={data.username}
              src={`data:image/jpeg;base64,${data?.profilePicture}`}
              sx={{
                width: 150,
                height: 150,
                marginBottom: "2em",
                marginLeft: "3em",
              }}
            />

            <button
              className="btn_userInfo"
              onClick={() => setShowCal(!showCal)}
              id={showCal ? "activeBtn" : ""}
            >
              Attendance
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {showCal ? (
              <div style={{ marginLeft: "2em", marginTop: "2em" }}>
                <h4>Attendance</h4>
                <Calendar
                  onChange={(value) => {
                    let a = 0;
                    allEvents.forEach((x) => {
                      // console.log(x, " + ", `${value.getMonth() + 1}`);
                      if (
                        x.slice(5, 7) === `${value.getMonth() + 1}` ||
                        x.slice(5, 7) === `0${value.getMonth() + 1}`
                      ) {
                        a++;
                      }
                    });
                    setPresents(a);
                    onChange(value);
                  }}
                  value={value}
                  tileClassName={({ date }) => {
                    if (
                      allEvents.find(
                        (x) =>
                          x.slice(0, 10) ===
                          fixTimezoneOffset(date).slice(0, 10)
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
                <p>Month : {monthNames[value.getMonth()]}</p>
                <p>Total Presents : {presents}</p>
              </div>
            ) : null}
            <div className="text_wrapper">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "45%",
                  marginLeft: "3em",
                }}
              >
                <div className="infoRow">
                  <h6 style={{ color: "gray", flex: "30%" }}>Username:</h6>
                  <h6 style={{ flex: "50%" }}>{data.username}</h6>
                </div>
                <Divider />
                <div className="infoRow">
                  <h6 style={{ color: "gray", flex: "30%" }}>Email:</h6>
                  <h6 style={{ flex: "50%" }}>{data.email}</h6>
                </div>
                <Divider />
                <div className="infoRow">
                  <h6 style={{ color: "gray", flex: "30%" }}>Role:</h6>
                  <h6 style={{ flex: "50%" }}>{data.role} </h6>
                </div>
                <Divider />
                <div className="infoRow">
                  <h6 style={{ color: "gray", flex: "30%" }}>Contact:</h6>
                  <h6 style={{ flex: "50%" }}>
                    {data?.contact ? data.contact : "-"}{" "}
                  </h6>
                </div>
                <Divider />
                <div className="infoRow">
                  <h6 style={{ color: "gray", flex: "30%" }}>Bank Details:</h6>
                  <h6 style={{ flex: "50%" }}>
                    {data?.bankDetails ? data.bankDetails : "-"}
                  </h6>
                </div>
              </div>
            </div>
            <div className="text_wrapper">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "60%",
                }}
              >
                {/* <div className="infoRow">
                  <h6 style={{ color: "gray", flex: "30%" }}>Manager:</h6>
                  <h6 style={{ flex: "50%" }}>{data.username}</h6>
                </div> */}
                {/* <Divider /> */}
                <div className="infoRow">
                  <h6 style={{ color: "gray", flex: "30%" }}>Teams:</h6>
                  <h6 style={{ flex: "50%", display: "flex" }}>
                    {team.map((t, index) => {
                      return (
                        <Tooltip key={index} title={t.teamName}>
                          <Avatar
                            {...stringAvatar(t.teamName)}
                            onClick={() => navigate("/team")}
                          />
                        </Tooltip>
                      );
                    })}
                  </h6>
                </div>
                <Divider />
                <div className="infoRow">
                  <h6 style={{ color: "gray", flex: "30%" }}>Projects:</h6>
                  {proj ? (
                    <h6 style={{ flex: "50%" }}>
                      {proj.map((p) => {
                        return (
                          <p>{`${p.projectName} - ${p.projectDescription}`}</p>
                        );
                      })}
                    </h6>
                  ) : (
                    <Spinner animation="border" />
                  )}
                </div>
                {/* <Divider />
                <div className="infoRow">
                  <h6 style={{ color: "gray", flex: "30%" }}>
                    Current Project:
                  </h6>
                  <h6 style={{ flex: "50%" }}>From project data</h6>
                </div> */}
                <Divider />
                <div className="infoRow">
                  <h6 style={{ color: "gray", flex: "30%" }}>Zone:</h6>
                  <h6 style={{ flex: "50%" }}>Green</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="date_selectorWrapper">
            <div style={{ marginRight: "2em" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From"
                  value={from}
                  onChange={(newValue) => {
                    setFrom(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
            <div style={{ marginRight: "2em" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To"
                  value={to}
                  onChange={(newValue) => {
                    setTo(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <Button
                className="submitbtn"
                onClick={() => FilterDate()}
                style={{ marginLeft: "2em" }}
              >
                Filter
                <TuneOutlinedIcon
                  style={{ fill: "white", marginLeft: "0.4em" }}
                />
              </Button>
              {/* <IconButton></IconButton> */}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: "bold", margin: "1em 0em 1em 0em" }}>
              Screen Shots
            </h4>
            {loading ? (
              <div className="spinner">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="carousel_wrapper">
                <Carousel
                  style={{
                    backgroundColor: "grey",
                    width: "80%",
                    padding: 0,
                  }}
                >
                  {SS?.map((i, index) => {
                    return (
                      <Carousel.Item>
                        <img
                          style={{ cursor: "pointer", width: "100%" }}
                          src={`data:image/jpeg;base64,${i.img}`}
                          alt="screenshot"
                          //onClick={() => openBase64InNewTab(i, "image/png")}
                        />
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              </div>
            )}
          </div>

          <h5>
            <h4 style={{ fontWeight: "bold", margin: "1em 0em 1em 0em" }}>
              Active Time:
            </h4>
            <>
              {loading ? (
                <div className="spinner">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Table hover bordered className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }}>Date</th>
                      <th style={{ width: "20%" }}>Total Time</th>
                      <th>Day Time</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {totalTime.map((time, index) => {
                      if (index > 5);
                      else {
                        return (
                          <tr>
                            <td style={{ width: "20%" }}>
                              {time.date.slice(0, 10)}
                            </td>
                            <td style={{ width: "20%" }}>
                              {timeConvert(time.activetime.Seconds)}
                            </td>
                            <td>
                              {dayTime.map((day, ind) => {
                                if (index === ind) {
                                  return day.activeDay.map((d) => {
                                    return (
                                      <span
                                        key={ind}
                                        style={{
                                          fontSize: "1rem",
                                          marginLeft: "0.5em",
                                        }}
                                      >
                                        {d} |
                                      </span>
                                    );
                                  });
                                } else {
                                }
                              })}
                              {/* <Divider /> */}
                            </td>
                            <td>
                              {dayTime.map((day, ind) => {
                                if (index === ind) {
                                  return day.active.map((d) => {
                                    return (
                                      <span
                                        key={ind}
                                        style={{
                                          fontSize: "1rem",
                                          marginLeft: "0.5em",
                                        }}
                                      >
                                        {d} |
                                      </span>
                                    );
                                  });
                                } else {
                                }
                              })}
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </Table>
              )}
            </>
          </h5>

          <h5>
            <h4 style={{ fontWeight: "bold", margin: "1em 0em 1em 0em" }}>
              Idle Time:
            </h4>
            <span>
              {loading ? (
                <div className="spinner">
                  <Spinner animation="border" />
                </div>
              ) : (
                <Table hover bordered className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }}>Date</th>
                      <th style={{ width: "20%" }}>Total Time</th>
                      <th>Day Time</th>
                      <th>Time </th>
                    </tr>
                  </thead>
                  <tbody>
                    {totalTime?.map(function (time, index) {
                      if (index > 5);
                      else {
                        return (
                          <tr>
                            <td style={{ width: "20%" }}>
                              {time.date.slice(0, 10)}
                            </td>
                            <td style={{ width: "20%" }}>
                              {timeConvert(time.idletime.Seconds)}
                            </td>
                            <td>
                              {dayTime.map((day, ind) => {
                                if (index === ind) {
                                  return day.idleDay.map((d) => {
                                    return (
                                      <span
                                        key={ind}
                                        style={{
                                          fontSize: "1rem",
                                          marginLeft: "0.5em",
                                        }}
                                      >
                                        {d} |
                                      </span>
                                    );
                                  });
                                } else {
                                }
                              })}
                              {/* <Divider /> */}
                            </td>
                            <td>
                              {dayTime.map((day, ind) => {
                                if (index === ind) {
                                  return day.idle.map((d) => {
                                    return (
                                      <span
                                        key={ind}
                                        style={{
                                          fontSize: "1rem",
                                          marginLeft: "0.5em",
                                        }}
                                      >
                                        {d} |
                                      </span>
                                    );
                                  });
                                } else {
                                }
                              })}
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </Table>
              )}
            </span>
          </h5>
          <h4 style={{ fontWeight: "bold", margin: "1em 0em 1em 0em" }}>
            Apps & Websites
          </h4>
          {loading ? (
            <div className="spinner">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table hover bordered className="table">
              <thead>
                <tr>
                  <th className="thead">#</th>
                  <th className="thead">Window Title</th>
                  <th className="thead">Time</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(function (time) {
                  // console.log("time: ", time.apps);
                  return Object.entries(time.apps || {}).map(function (
                    [key, value],
                    index
                  ) {
                    if (index === 0) {
                      return (
                        <>
                          {/* FOR DATE */}
                          <tr key={index}>
                            <td></td>
                            <td>
                              <TableDate
                                date={new Date(time.date).toLocaleDateString()}
                              />
                              {/* <TableDate date={time.date.slice(0, 10)} /> */}
                            </td>
                            <td></td>
                          </tr>
                          {/* FOR DATA */}
                          {key !== "" ? (
                            <tr key={index}>
                              <td>
                                {timeConvert(value) === "00:00:00" ? "" : index}
                              </td>
                              <td>
                                {
                                  key !== "" ? key : null
                                  // <TableDate date={time.date.slice(0, 10)} />
                                }
                              </td>
                              <td>
                                {timeConvert(value) === "00:00:00"
                                  ? ""
                                  : timeConvert(value)}
                              </td>
                            </tr>
                          ) : null}
                        </>
                      );
                    } else {
                      return (
                        <tr key={index}>
                          <td>
                            {timeConvert(value) === "00:00:00" ? "" : index}
                          </td>
                          <td>
                            {key !== "" ? (
                              key
                            ) : (
                              <TableDate date={time.date.slice(0, 10)} />
                            )}
                          </td>
                          <td>
                            {timeConvert(value) === "00:00:00"
                              ? ""
                              : timeConvert(value)}
                          </td>
                        </tr>
                      );
                    }
                  });
                })}
              </tbody>
            </Table>
          )}
        </>
      )}
    </div>
  );
}

export default MoreInfo;
