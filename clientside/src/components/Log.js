import React from "react";
import { Table, Button, Row, Container, Col, Spinner } from "react-bootstrap";
import {
  Input,
  InputLabel,
  InputAdornment,
  Snackbar,
  Alert,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import axios from "axios";

function Log() {
  const [log, setLog] = React.useState([]);
  const [data, setData] = React.useState([]); //all emps of admin
  const [loading, setLoading] = React.useState(0);
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get("http://localhost:5000/admin/allEmps", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        // console.log(response.data.data);
        setData([...response.data.data]);
      });
  };
  const handleChange = (event) => {
    setName(event.target.value);
  };

  const getLogData = async () => {
    await axios
      .get(`http://localhost:5000/admin/logs/${name}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data.data);
        console.log(response.data.data.length);
        setLog([...response.data.data]);
        setLoading(1);
      });
    data.forEach((d) => {
      if (d.email === name) setUsername(d.username);
    });
  };
  return (
    <div className="cnt">
      <div className="search">
        <div
          style={{
            display: "flex",
            width: "30%",
          }}
        >
          <FormControl fullWidth>
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

          <Button
            className="submitbtn"
            style={{ marginLeft: "10px" }}
            onClick={() => getLogData()}
          >
            Search
          </Button>
        </div>
        <Button className="submitbtn" onClick={() => getLogData()}>
          Refresh
        </Button>
      </div>
      <div>
        <h2 style={{ position: "relative", left: "1rem" }}>
          {username}'s Activity Logs
        </h2>
      </div>
      {loading === 0 ? (
        <div className="spinner">
          <Spinner animation="border" />
        </div>
      ) : loading === 1 ? (
        <Table hover bordered className="table">
          <thead>
            <tr>
              <th className="thead">#</th>
              <th className="thead">Activity</th>
              <th className="thead">Time</th>
            </tr>
          </thead>
          <tbody>
            {log.map(function (d, index) {
              console.log(d);
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{d.app}</td>
                  <td>{d.time}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : null}
    </div>
  );
}

export default Log;
