import React from "react";
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
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";
import Dropdown from "react-bootstrap/Dropdown";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ExcelExport from "./ExcelExport";
import { toast } from "react-toastify";

function TableDate({ date }) {
  // alert("k");
  return <h4 style={{ fontWeight: "bold" }}>{date}</h4>;
}

const AppsSitesReport = () => {
  const [apps, setApps] = React.useState([]);
  const [data, setData] = React.useState([]); //all emps of admin
  const [loading, setLoading] = React.useState(0);
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [from, setFrom] = React.useState(null);
  const [to, setTo] = React.useState(null);
  const [chartData, setChartData] = React.useState([]);
  const date = new Date();
  const [value, setValue] = React.useState(dayjs(date.toJSON().slice(0, 10)));
  const [filter, setFilter] = React.useState("");

  const days = [];
  var month = new Date(value).getMonth() + 1;
  var year = new Date(value).getFullYear();

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

  const getAppsData = async () => {
    let newFrom = new Date(from).toLocaleDateString("fr-CA");
    let newTo = new Date(to).toLocaleDateString("fr-CA");

    await axios
      .get(`http://localhost:5000/report/AppsSites/${name}/${month}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.length === 0) {
          toast.info("No data available");
          setApps([...response.data]);
          filterChartData(response.data);
        } else {
          console.log(response.data);
          setApps([...response.data]);
          filterChartData(response.data);
        }
      });
  };

  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const timeConvert = (s) => {
    let time = new Date(s * 1000).toISOString().slice(11, 19);
    return time;
    // let min = s / 60;
    // return min.toFixed(2);
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const filterChartData = (appsData) => {
    console.log("------------=----");
    let donutsArray = [];
    appsData.map((time) => {
      let newObj = { date: new Date(time.date).toLocaleDateString(), arr: [] };
      let singleArray = [];
      console.log("====== ", time.date);

      Object.entries(time.apps || {}).map(([key, value]) => {
        let flag = false;
        let nn = "";
        for (let i = 0; i < key.length; i++) {
          if (flag) nn += key.charAt(i);
          if (key.charAt(i) === "-") {
            let obj = {};
            flag = true;
            nn = key.split("-");
            obj.name = nn[nn.length - 1];
            value = value / 60;
            obj.time = parseFloat(value.toFixed(2));
            singleArray.push(obj);
            break;
          }
        }
        if (!flag) {
          let obj = {};
          obj.name = key;
          value = value / 60;
          obj.time = parseFloat(value.toFixed(2));
          singleArray.push(obj);
        }
      });
      newObj.arr = singleArray;
      console.log(newObj);
      donutsArray.push(newObj);
      console.log(donutsArray);
      setChartData([...donutsArray]);
    });
  };
  return (
    <div className="cnt" style={{ marginTop: "1em" }}>
      <h2 style={{ marginBottom: "1em" }}>Apps & Websites</h2>
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
              }}
              renderInput={(params) => (
                <TextField {...params} helperText={null} />
              )}
            />
          </LocalizationProvider>

          <Button
            className="submitbtn"
            style={{ marginLeft: "2em" }}
            onClick={() => name && getAppsData()}
          >
            Search
          </Button>
          {/* <ExcelExport excelData={apps} fileName="Demo" /> */}
        </div>
      </div>
      {apps.length >= 1 ? (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {chartData.map((d, i) => {
            return (
              <div style={{ margin: "0em 1em 0em 1em" }} key={i}>
                <PieChart width={150} height={150}>
                  <Tooltip />
                  <Pie
                    data={d.arr}
                    dataKey="time"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={10}
                    fill={getRandomColor()}
                  />
                </PieChart>
                <p style={{ marginLeft: "2rem" }}>{d.date}</p>
              </div>
            );
          })}
        </div>
      ) : null}
      <Table hover bordered className="table">
        <thead>
          <tr>
            <th className="thead">#</th>
            <th className="thead">Name</th>
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
                    <td>{timeConvert(value) === "00:00:00" ? "" : index}</td>
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
    </div>
  );
};

export default AppsSitesReport;

{
  /* <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Time Period
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilter("monthly")}>
                Monthly
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("custom")}>
                Custom date filter
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */
}

{
  /* {filter === "monthly" ? (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["year", "month"]}
                label="Year and Month"
                minDate={dayjs("2012-03-01")}
                maxDate={dayjs("2023-06-01")}
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} helperText={null} />
                )}
              />
            </LocalizationProvider>
          ) : filter === "custom" ? (
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
              </div>
            </div>
          ) : null} */
}
