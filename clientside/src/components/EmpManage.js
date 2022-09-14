import React from "react";
import axios from "axios";
import "./EmpManage.css";
import { Table, Button, Dropdown, Spinner, Badge } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Input, TextField, Snackbar, Alert, ToggleButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddEmpModal from "./AddEmpModal";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8900");

function Online() {
  return (
    <p
    // style={{
    //   color: "green",
    //   padding: "0.7em",
    //   backgroundColor: "lightGreen",
    //   fontSize: "1rem",
    // }}
    >
      <Badge pill bg="success">
        Online
      </Badge>{" "}
    </p>
  );
}

function Offline() {
  return (
    <p>
      <Badge pill bg="danger">
        Offline
      </Badge>{" "}
    </p>
  );
}

function EmpManage() {
  // fetching data

  const [mod, setMod] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [copy, setCopy] = React.useState([...data]);
  const [copy2, setCopy2] = React.useState([...data]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(0);
  const [eNum, setENum] = React.useState(0);
  const [msg, setMsg] = React.useState(9);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState([false]);

  React.useEffect(() => {
    getData();
  }, [eNum]);

  const getData = async () => {
    await axios
      .get("http://localhost:5000/admin/allEmps", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response);
        setData([...response.data.data]);
        setCopy2([...response.data.data]);
        //console.log([...response.data.data]);
        setLoading(response.data.msg);
        setENum(response.data.data.length);
      });
  };

  const submit = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Do you want to delete this employee?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteEmp(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const deleteEmp = (id) => {
    axios.delete(`http://localhost:5000/emp/deleteEmp/${id}`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
  };
  const closeMod = () => {
    setMod(false);
  };

  const addEmpModal = (num) => {
    setENum(eNum + 1);
    setOpen(true);
    setMsg(num);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const SearchEmp = () => {
    setCopy([...data]);
    if (search === "") {
      setData([...copy2]);
    } else {
      console.log([...data]);
      let temp = data.filter((d) => {
        return d.username.includes(search);
      });
      console.log(temp);
      setData([...temp]);
    }
  };
  const SearchEmpByType = (a) => {
    console.log(a);
    setCopy([...copy2]);
    if (a === "") {
      setData([...copy2]);
    } else {
      console.log([...copy2]);

      let temp = data.filter((d) => {
        return d.username.includes(a);
      });
      console.log(temp);
      setData([...temp]);
    }
  };

  const Screenshots = (index, email) => {
    // socket.emit("StartSS", email);
    if (selected[index] === true) {
      // socket.emit("StopSS", email);
      let temp = [...selected];
      temp[index] = false;
      setSelected([...temp]);
    } else {
      // socket.emit("StartSS", email);
      let temp = [...selected];
      temp[index] = true;
      setSelected([...temp]);
    }
  };

  return (
    <div className="cnt">
      <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
        {msg === 0 ? (
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            User Already Exists!
          </Alert>
        ) : msg === 1 ? (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            User Added Successfully!
          </Alert>
        ) : null}
      </Snackbar>
      {mod ? (
        <AddEmpModal closeMod={closeMod} addEmpModal={addEmpModal} />
      ) : null}
      <h1>Employee Management</h1>

      <div className="search">
        <div>
          <TextField
            id="outlined-basic"
            label="Employee Name"
            onChange={(e) => {
              setSearch(e.target.value);
              SearchEmpByType(e.target.value);
            }}
          />
          <Button
            className="submitbtn"
            onClick={() => SearchEmp()}
            style={{ marginLeft: "10px" }}
          >
            <SearchIcon style={{ fill: "white" }} />
            Search
          </Button>
        </div>
        <Button
          className="submitbtn"
          //style={{ marginBottom: "20px" }}
          onClick={() => setMod(true)}
        >
          <PersonAddIcon style={{ fill: "white", marginRight: "0.5em" }} />
          Add new Employee
        </Button>
      </div>

      {loading === 0 ? (
        <div className="spinner">
          <Spinner animation="border" />
        </div>
      ) : loading === 1 ? (
        <Table className="table">
          <thead>
            <tr>
              <th className="thead">#</th>
              <th className="thead">Username</th>
              <th className="thead">Email</th>
              <th className="thead">Role</th>
              <th className="thead">More Info</th>
              <th className="thead">Sreenshot</th>
              <th className="thead">Status</th>
              <th className="thead">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map(function (data, index) {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data.username} </td>
                  <td>{data.email}</td>
                  <td>{data.role}</td>
                  <td>
                    <button
                      style={{ all: "unset", cursor: "pointer" }}
                      onClick={() => {
                        localStorage.setItem("info", JSON.stringify(data));
                        window.location.href = "/moreInfo";
                      }}
                    >
                      Click for more Info
                    </button>
                  </td>
                  <td>
                    <ToggleButton
                      value="check"
                      selected={selected[index]}
                      // onChange={() => {
                      //   setSelected(!selected);
                      // }}
                      onClick={() => Screenshots(index, data.email)}
                      style={{ padding: "0.5em" }}
                    >
                      <PhotoCameraIcon />
                    </ToggleButton>
                    {/* <Button onClick={() => ScreenshotStart(data.email)}>
                      SS
                    </Button>
                    <Button onClick={() => ScreenshotStop(data.email)}>
                      SStop
                    </Button> */}
                  </td>
                  <td>{data.desktop ? <Online /> : <Offline />}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        style={{ all: "unset", cursor: "pointer" }}
                      >
                        <MoreVertIcon />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => alert("action")}>
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => submit(data._id)}>
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : null}
    </div>
  );
}

export default EmpManage;
