import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import "../components/EmpManage.css";
import {
  Table,
  Button,
  Spinner,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Chip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ExcelExport from "./ExcelExport";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ChartBar from "./ChartBar";
import { toast } from "react-toastify";
// import PDFReport from "./components/PDFReport";
// import { PDFDownloadLink } from "@react-pdf/renderer";
const ProjectsReport = () => {
  const [project, setProject] = React.useState([]);
  const [status, setStatus] = React.useState("all");
  const [data, setData] = React.useState([]); //all emps of admin
  const [loading, setLoading] = React.useState(1);
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [boards, setBoards] = React.useState([]);
  const date = new Date();
  const [value, setValue] = React.useState(dayjs(date.toJSON().slice(0, 10)));
  const [chartData, setChartData] = React.useState();

  let month = new Date(value).getMonth() + 1;
  let year = new Date(value).getFullYear();

  const getProject = async () => {
    let id = localStorage.getItem("id");

    let proj;
    await axios
      .get(
        `http://localhost:5000/report/allProjects/${id}/${status}/${month}`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.length === 0) {
          toast.info("No data available");
          setData([...response.data]);
          makeChartDate([...response.data]);
        } else {
          console.log(response.data);
          setData([...response.data]);
          makeChartDate([...response.data]);
          setLoading(1);
          proj = response.data;
        }
      });
    getBoards(proj);
  };

  const getBoards = async (projects) => {
    await axios
      .get("http://localhost:5000/report/onlymyboards", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("BOARDS:  ", response.data);
        console.log("Projects: ", projects);

        let projectID = projects?.map((p) => p._id);
        let newBoards = [];

        let boards = [...response.data];
        boards?.forEach((b) => {
          if (projectID?.includes(b.projectId)) {
            newBoards.push(b);
          }
        });

        console.log("new boards: ", newBoards);
        setBoards([...newBoards]);
      });
  };

  //kitne tasks complete hue kitne assigned they
  const getProjectProgress = (id, name) => {
    let completed = 0;
    let assinged = 0;

    boards.forEach((b) => {
      if (b.projectId === id) {
        b.boards?.forEach((cards) => {
          cards.cards?.forEach((a) => {
            // console.log("cards: ", id, " ", a.tasks);
            assinged += a.tasks.length;
            a.tasks.forEach((tasks) => {
              if (tasks.completed) completed++;
            });
          });
        });
      }
    });

    console.log(
      "project: ",
      name,
      " Complte: ",
      completed,
      " total tasks given: ",
      assinged
    );

    let progress = (completed / assinged) * 100;
    return progress.toFixed(2);
  };

  const makeChartDate = (data) => {
    let newArr = [];
    data.forEach((d) => {
      if (d.hoursWorked.length >= 1) {
        let obj = {};
        obj.projectName = d.projectName;
        obj.totalTime = calculateTotalHourForChart(d.hoursWorked);
        newArr.push(obj);
      } else {
        newArr.push({ projectName: d.projectName, totalTime: 0 });
      }
    });
    setChartData([...newArr]);
    console.log("CHAAAAAAAAAAAArt ", newArr);
  };

  const calculateTotalHourForChart = (hours) => {
    let totalSeconds = 0;
    hours.forEach((h) => {
      let time = h.time.split(":");
      totalSeconds += parseInt(time[0] * 3600 + time[1] * 60 + time[2] * 1);
    });
    let time = totalSeconds / 3600;
    return parseFloat(time.toFixed(2));
  };

  const handleChange = (event) => {
    setName(event.target.value);
    console.log(event.target.value);
  };
  const handleChange2 = (event) => {
    setStatus(event.target.value);
    console.log(event.target.value);
  };
  function calculateTotalBreak(breaks) {
    let totalSeconds = 0;
    breaks.forEach((b) => {
      b.time.forEach((h) => {
        let time = h.split(":");
        totalSeconds += parseInt(time[0] * 3600 + time[1] * 60 + time[2] * 1);
      });
    });
    let time = new Date(totalSeconds * 1000).toISOString().slice(11, 19);
    return time;
  }

  const calculateTotalHour = (hours) => {
    let totalSeconds = 0;
    hours.forEach((h) => {
      let time = h.time.split(":");
      totalSeconds += parseInt(time[0] * 3600 + time[1] * 60 + time[2] * 1);
    });

    let time = new Date(totalSeconds * 1000).toISOString().slice(11, 19);
    return time;
  };

  return (
    <div className="cnt" style={{ marginTop: "1em" }} id="download">
      <h2 style={{ marginBottom: "1em" }}>Projects Report</h2>
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
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              onChange={handleChange2}
            >
              <MenuItem value={"all"}>All</MenuItem>
              <MenuItem value={"ontrack"}>On Track</MenuItem>
              <MenuItem value={"atrisk"}>At Risk</MenuItem>
              <MenuItem value={"offtrack"}>Off Track</MenuItem>
              <MenuItem value={"completed"}>Completed</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              views={["year", "month"]}
              label="Project Creation Month"
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
            onClick={() => getProject()}
          >
            Search
          </Button>
          {/* <ExcelExport excelData={project} fileName="Demo" /> */}
        </div>
      </div>
      <div>
        {chartData?.length > 1 ? (
          <ChartBar
            chartData={chartData}
            xaxis="projectName"
            yaxis="totalTime"
          />
        ) : null}
      </div>
      <div>
        {loading === 0 ? (
          <div className="spinner">
            <Spinner animation="border" />
          </div>
        ) : null}
        {loading === 0 ? (
          <div className="spinner">{/* <Spinner animation="border" /> */}</div>
        ) : loading === 1 ? (
          <>
            <Table hover bordered striped className="table">
              <thead>
                <tr>
                  <th className="thead">Creation Date</th>
                  <th className="thead">Last Worked At</th>
                  <th className="thead">Status</th>
                  <th className="thead">Project</th>
                  <th className="thead">Members Work</th>
                  <th className="thead">Total Break Time</th>
                  <th className="thead">Worked Hours</th>
                  <th className="thead">Progress</th>
                </tr>
              </thead>
              <tbody>
                {data?.map(function (d, index) {
                  return (
                    <tr key={index}>
                      <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(d.updatedAt).toLocaleDateString()}</td>
                      <td>
                        {d.status === "ontrack" ? (
                          <Chip
                            sx={{ backgroundColor: "#58a182" }}
                            label={d.status}
                          />
                        ) : d.status === "completed" ? (
                          <Chip
                            sx={{ backgroundColor: "#2be92b" }}
                            label={d.status}
                          />
                        ) : d.status === "atrisk" ? (
                          <Chip
                            sx={{ backgroundColor: "#f1bd6c" }}
                            label={d.status}
                          />
                        ) : d.status === "offtrack" ? (
                          <Chip
                            sx={{ backgroundColor: "#de5f73" }}
                            label={d.status}
                          />
                        ) : null}
                      </td>
                      <td>{d.projectName}</td>
                      {/* new table */}
                      <td>
                        <Table hover bordered striped className="table">
                          <thead>
                            <th>Date</th>
                            <th>User</th>
                            <th>Time Worked</th>
                          </thead>
                          <tbody>
                            {d.hoursWorked?.map((h, i) => {
                              return (
                                <tr key={i}>
                                  <td style={{ width: "25%" }}>{h.date}</td>
                                  <td style={{ width: "30%" }}>{h.user} </td>
                                  <td style={{ width: "30%" }}>{h.time} </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </td>
                      <td>{calculateTotalBreak(d.numOfBreaks)}</td>
                      <td>{calculateTotalHour(d.hoursWorked)}</td>
                      <td>
                        {isNaN(getProjectProgress(d._id, d.projectName))
                          ? 0
                          : getProjectProgress(d._id, d.projectName)}
                        %
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectsReport;
