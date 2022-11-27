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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ChartBar from "./ChartBar";
// import PDFReport from "./components/PDFReport";
// import { PDFDownloadLink } from "@react-pdf/renderer";
const InOutReport = () => {
  const [inOut, setInOut] = React.useState([]);
  const [data, setData] = React.useState([]); //all emps of admin
  const [loading, setLoading] = React.useState(0);
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const date = new Date();
  const [value, setValue] = React.useState(dayjs(date.toJSON().slice(0, 10)));
  const [workingDays, setWorkingDays] = React.useState(0);
  const [absents, setAbsents] = React.useState(0);
  const [chartData, setChartData] = React.useState();
  const days = [];
  var month = new Date(value).getMonth() + 1;
  var year = new Date(value).getFullYear();

  let totalDays = new Date(year, month, 0).getDate();
  for (let i = 1; i <= totalDays; i++) {
    if (i < 10) {
      days.push({
        date: `${new Date(value).getMonth() + 1}/0${i}/${year}`,
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

  const getInOutData = async () => {
    let inout = [];
    await axios
      .get(`http://localhost:5000/report/InOut/${name}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        // setInOut([...response.data]);
        console.log(response.data);
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
        console.log("NEEEEWWWWWWWWWWW: ", aa);
        getTotalWorkingDays(aa);
        convertDataForChart(aa);
      });
    data.forEach((d) => {
      if (d.email === name) setUsername(d.username);
    });
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
    setChartData([...arr]);
    console.log(arr);
  };

  const downloadPDF = () => {
    const input = document.getElementById("download");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("img/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "JPEG", 0, 60);
      pdf.save("demo.pdf");
    });
  };

  return (
    <div className="cnt" style={{ marginTop: "1em" }} id="download">
      <h2 style={{ marginBottom: "1em" }}>Monthly In-Out</h2>
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
            onClick={() => name && getInOutData()}
          >
            Search
          </Button>
          <ExcelExport excelData={inOut} fileName="Demo" />
          <Button onClick={() => downloadPDF()}></Button>
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
        {chartData?.length > 1 ? (
          <ChartBar chartData={chartData} xaxis="date" yaxis="totalTime" />
        ) : null}
      </div>
      <div>
        <h6>Worked Days: {workingDays}</h6>
        <h6>Non Worked Days: {absents}</h6>
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
          <Table hover bordered striped className="table">
            <thead>
              <tr>
                <th className="thead">Date</th>
                <th className="thead">In</th>
                <th className="thead">Out</th>
              </tr>
            </thead>
            <tbody>
              {inOut.map(function (d, index) {
                return (
                  <tr key={index}>
                    <th style={{ width: "17%" }}>{d.date}</th>
                    {d.In !== "A" ? (
                      // <th>{new Date(d.In).toLocaleTimeString()}</th>
                      <th>{d.In}</th>
                    ) : (
                      <th style={{ color: "grey" }}>A</th>
                    )}
                    {d.Out !== "A" ? (
                      <th>{d.Out}</th>
                    ) : (
                      // <th>{new Date(d.Out).toLocaleTimeString()}</th>
                      <th style={{ color: "grey" }}>A</th>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      ) : null}
    </div>
  );
};

export default InOutReport;
