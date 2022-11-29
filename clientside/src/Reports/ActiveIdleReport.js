import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import "../components/EmpManage.css";
import { Table, Button, Spinner } from "react-bootstrap";
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
import {
  BarChart,
  Bar,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
// import PDFReport from "./components/PDFReport";
// import { PDFDownloadLink } from "@react-pdf/renderer";
const ActiveIdleReport = () => {
  const [active, setActive] = React.useState([]);
  const [separate, setSeparate] = React.useState([]);
  const [data, setData] = React.useState([]); //all emps of admin
  const [loading, setLoading] = React.useState(0);
  const [name, setName] = React.useState("");
  const date = new Date();
  const [value, setValue] = React.useState(dayjs(date.toJSON().slice(0, 10)));
  const [chartData, setChartData] = React.useState([]);

  const month = new Date(value).getMonth() + 1;
  const year = new Date(value).getFullYear();

  React.useEffect(() => {
    getData();
  }, []);

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
  };

  const getActiveIdleData = async () => {
    await axios
      .get(`http://localhost:5000/report/activeIdle/${name}/${month}/${year}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setActive([...response.data.totalTime]);
        setSeparate([...response.data.separateTime]);
        console.log(response.data.totalTime);
        console.log(response.data.separateTime);
        convertDataForChart(response.data.totalTime);
      });
  };

  const convertDataForChart = (arr) => {
    let newArr = [];
    arr.forEach((t) => {
      newArr.push({
        date: new Date(t.date).toLocaleDateString(),
        activeTime: convert(t.activetime.Seconds),
        idleTime: convert(t.idletime.Seconds),
      });
    });

    setChartData([...newArr]);
  };
  const convert = (s) => {
    let hr = s / 3600;
    return hr.toFixed(2);
  };
  const timeConvert = (s) => {
    let time = new Date(s * 1000).toISOString().slice(11, 19);
    return time;
    // let min = s / 60;
    // return min.toFixed(2);
  };

  return (
    <div className="cnt" style={{ marginTop: "1em" }} id="download">
      <h2 style={{ marginBottom: "1em" }}>Monthly Active & Idle Report</h2>
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
                  <MenuItem value={data.email} key={index}>
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
            onClick={() => name && getActiveIdleData()}
          >
            Search
          </Button>
          <ExcelExport excelData={active} fileName="Demo" />
          {/* <Button onClick={() => downloadPDF()}></Button> */}
          {/* <PDFDownloadLink document={<PDFReport />} filename="FORM">
            {({ loading }) =>
              loading ? (
                <button>Loading Document...</button>
              ) : (
                <button>Download</button>
              )
            }
          </PDFDownloadLink> */}
        </div>
      </div>
      <div>
        {chartData?.length >= 1 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              width={500}
              height={300}
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis>
                <Label
                  style={{
                    textAnchor: "middle",
                    fontSize: "130%",
                    fill: "grey",
                  }}
                  dx={-15}
                  angle={270}
                  value={"Time (Hrs)"}
                />
              </YAxis>
              <Tooltip />
              <Bar dataKey="activeTime" stackId="a" fill="#8884d8" />
              <Bar dataKey="idleTime" stackId="a" fill="#82cdff" />
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>

      {loading === 0 ? (
        <div className="spinner">
          <Spinner animation="border" />
        </div>
      ) : null}
      {loading === 0 ? (
        <div className="spinner">{/* <Spinner animation="border" /> */}</div>
      ) : loading === 1 ? (
        <>
          <h4 style={{ fontWeight: "bold", margin: "1em 0em 1em 0em" }}>
            Active Time:
          </h4>
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
              {active.map((time, index) => {
                if (index > 5);
                else {
                  return (
                    <tr>
                      <td style={{ width: "20%" }}>{time.date.slice(0, 10)}</td>
                      <td style={{ width: "20%" }}>
                        {timeConvert(time.activetime.Seconds)}
                      </td>
                      <td>
                        {separate.map((day, ind) => {
                          if (index === ind) {
                            return day.activeDay.map((d) => {
                              return (
                                <tr
                                  key={ind}
                                  style={{
                                    fontSize: "1rem",
                                    marginLeft: "0.5em",
                                  }}
                                >
                                  {d}
                                </tr>
                              );
                            });
                          } else {
                          }
                        })}
                        {/* <Divider /> */}
                      </td>
                      <td>
                        {separate.map((day, ind) => {
                          if (index === ind) {
                            return day.active.map((d) => {
                              return (
                                <tr
                                  key={ind}
                                  style={{
                                    fontSize: "1rem",
                                    marginLeft: "0.5em",
                                  }}
                                >
                                  {d}
                                </tr>
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

          <h4 style={{ fontWeight: "bold", margin: "1em 0em 1em 0em" }}>
            Idle Time:
          </h4>
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
              {active?.map(function (time, index) {
                if (index > 5);
                else {
                  return (
                    <tr>
                      <td style={{ width: "20%" }}>{time.date.slice(0, 10)}</td>
                      <td style={{ width: "20%" }}>
                        {timeConvert(time.idletime.Seconds)}
                      </td>
                      <td>
                        {separate.map((day, ind) => {
                          if (index === ind) {
                            return day.idleDay.map((d) => {
                              return (
                                <tr
                                  key={ind}
                                  style={{
                                    fontSize: "1rem",
                                    marginLeft: "0.5em",
                                  }}
                                >
                                  {d}
                                </tr>
                              );
                            });
                          } else {
                          }
                        })}
                        {/* <Divider /> */}
                      </td>
                      <td>
                        {separate.map((day, ind) => {
                          if (index === ind) {
                            return day.idle.map((d) => {
                              return (
                                <tr
                                  key={ind}
                                  style={{
                                    fontSize: "1rem",
                                    marginLeft: "0.5em",
                                  }}
                                >
                                  {d}
                                </tr>
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
        </>
      ) : null}
    </div>
  );
};

export default ActiveIdleReport;
