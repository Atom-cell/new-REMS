import React from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Pagination,
} from "@mui/material";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert"; // Import

function Log() {
  const [log, setLog] = React.useState([]);
  const [data, setData] = React.useState([]); //all emps of admin
  const [loading, setLoading] = React.useState(0);
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");

  const [currentPage, setCurrentPage] = React.useState(1);
  const [postsPerPage, setPostsPerPage] = React.useState(10);

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

  const getLogData = async () => {
    await axios
      .get(`http://localhost:5000/admin/logs/${name}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("LOG ", response.data.data);
        console.log("LEN: ", response.data.data.length);
        setLog([...response.data.data]);
        setLoading(1);
      });
    data.forEach((d) => {
      if (d.email === name) setUsername(d.username);
    });
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = log.slice(indexOfFirstPost, indexOfLastPost);
  console.log("current: ", currentPosts);

  const confirm = () => {
    confirmAlert({
      title: "Do you want to delete all logs?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteLogData(),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const deleteLogData = () => {
    axios
      .delete(`http://localhost:5000/admin/deletelog/${name}`)
      .then((response) => {});

    getLogData();
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
        <Button className="submitbtn" onClick={() => confirm()}>
          CLEAR
        </Button>
        <h2 style={{ position: "relative", left: "1rem" }}>
          {username ? `${username}'s Activity Logs` : null}
        </h2>
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
          <Table hover bordered className="table">
            <thead>
              <tr>
                <th className="thead">#</th>
                <th className="thead">Activity</th>
                <th className="thead">Time</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map(function (d, index) {
                //console.log(d);
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
          <Pagination
            count={Math.ceil(log.length / postsPerPage)}
            variant="outlined"
            color="primary"
            onChange={(event, pageNumber) => setCurrentPage(pageNumber)}
            sx={{ float: "right" }}
          />
        </>
      ) : null}
    </div>
  );
}

export default Log;
