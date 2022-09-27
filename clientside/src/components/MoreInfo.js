import { MoreInfoContext } from "../Helper/Context";
import React from "react";
import { Avatar, IconButton } from "@mui/material";
import {
  Table,
  Button,
  Row,
  Container,
  Col,
  Spinner,
  Carousel,
  Breadcrumb,
} from "react-bootstrap";
import "./moreInfo.css";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function TableDate({ date }) {
  // alert("k");
  return <h4 style={{ fontWeight: "bold" }}>{date}</h4>;
}
function MoreInfo() {
  const [allEvents, setAllEvents] = React.useState([]);
  const [value, onChange] = React.useState(new Date());

  const { moreInfo, setMoreInfo } = React.useContext(MoreInfoContext);
  const [data, setData] = React.useState({});
  const [totalTime, setTotalTime] = React.useState([]);
  const [totalTimeCopy, setTotalTimeCopy] = React.useState([]);
  const [apps, setApps] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [btnOption, setBtnOption] = React.useState("info");

  //for dates of filtering
  const [from, setFrom] = React.useState(null);
  const [to, setTo] = React.useState(null);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    let contextData = moreInfo;
    console.log("CONTEXT: ", contextData);
    let a = contextData;
    //console.log(a);
    // if (a.screenshot && a.appTime && a.totalTime) {

    //console.log(a.totalTime);
    setLoading(false);
    setData(a);
    setTotalTime(a.totalTime);
    setTotalTimeCopy(a.totalTime);
    setAllEvents([...a.attendance]);
    setApps(a.appTime);
    //console.log("Data: " + data);

    // }
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

    console.log("temp", totalTime);
  };

  const openBase64InNewTab = (data, mimeType) => {
    var byteCharacters = atob(data);
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
          User Information
        </button>
        <button
          className="btn_userAct"
          onClick={() => setBtnOption("activity")}
          id={btnOption === "activity" ? "activeBtn" : ""}
        >
          User Activity
        </button>
      </div>
      {btnOption === "info" ? (
        <div className="user_infoWrapper">
          <div className="user_heading">
            <Avatar
              src={data.profilePicture}
              // src="https://unsplash.com/photos/jzY0KRJopEI"
              sx={{ width: 100, height: 100, marginBottom: "2em" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="text_wrapper">
              <div className="box1">
                <h6>Username:</h6>
                <h6>Email:</h6>
                <h6>Role:</h6>
                <h6>Contact:</h6>
                <h6>Bank Details:</h6>
              </div>
              <div className="box2">
                <h6>{data.username}</h6>
                <h6>{data.email}</h6>
                <h6>{data.role}</h6>
                <h6>{data.contact ? data.contact : "-"}</h6>
                <h6>{data.bankDetails ? data.bankDetails : "-"}</h6>
              </div>
            </div>

            <div style={{ marginRight: "2em" }}>
              <h4>Attendance</h4>
              <Calendar
                onChange={onChange}
                value={value}
                tileClassName={({ date }) => {
                  if (
                    allEvents.find(
                      (x) =>
                        x.slice(0, 10) == fixTimezoneOffset(date).slice(0, 10)
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
            </div>
          </div>
          {/* <h1>Selected date: {value.toJSON().slice(0, 10)}</h1>
          {allEvents.map((e) => {
            return <p>{e}</p>;
          })} */}
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
                  {data.screenshot?.map((i, index) => {
                    return (
                      <Carousel.Item>
                        <img
                          style={{ cursor: "pointer", width: "100%" }}
                          src={`data:image/jpeg;base64,${i}`}
                          onClick={() => openBase64InNewTab(i, "image/png")}
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
                      <th>Date</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {totalTime?.map(function (time, index) {
                      if (index > 5);
                      else {
                        return (
                          <tr>
                            <td>{time.date.slice(0, 10)}</td>
                            <td>
                              {time.activetime.Hours +
                                " : " +
                                time.activetime.Minutes +
                                " : " +
                                time.activetime.Seconds}
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
                      <th>Date</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {totalTime?.map(function (time, index) {
                      if (index > 5);
                      else {
                        return (
                          <tr>
                            <td>{time.date.slice(0, 10)}</td>
                            <td>
                              {time.idletime.Hours +
                                " : " +
                                time.idletime.Minutes +
                                " : " +
                                time.idletime.Seconds}
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
                  console.log("time: ", time.apps);
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
                              <TableDate date={time.date.slice(0, 10)} />
                            </td>
                            <td></td>
                          </tr>
                          {/* FOR DATA */}
                          <tr key={index}>
                            <td>
                              {timeConvert(value) == "00:00:00" ? "" : index}
                            </td>
                            <td>
                              {key != "" ? (
                                key
                              ) : (
                                <TableDate date={time.date.slice(0, 10)} />
                              )}
                            </td>
                            <td>
                              {timeConvert(value) == "00:00:00"
                                ? ""
                                : timeConvert(value)}
                            </td>
                          </tr>
                        </>
                      );
                    } else {
                      return (
                        <tr key={index}>
                          <td>
                            {timeConvert(value) == "00:00:00" ? "" : index}
                          </td>
                          <td>
                            {key != "" ? (
                              key
                            ) : (
                              <TableDate date={time.date.slice(0, 10)} />
                            )}
                          </td>
                          <td>
                            {timeConvert(value) == "00:00:00"
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
