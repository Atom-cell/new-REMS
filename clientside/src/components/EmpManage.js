import React from "react";
import axios from "axios";
import "./EmpManage.css";
import { Table, Button, Dropdown, Spinner } from "react-bootstrap";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  Input,
  InputLabel,
  InputAdornment,
  Snackbar,
  Alert,
  ToggleButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddEmpModal from "./AddEmpModal";

function Online() {
  return <p style={{ color: "green" }}>✅Online</p>;
}

function Offline() {
  return <p style={{ color: "red" }}>⭕Offline</p>;
}

function EmpManage() {
  // fetching data

  const [mod, setMod] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [copy, setCopy] = React.useState([...data]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(0);
  const [eNum, setENum] = React.useState(0);
  const [msg, setMsg] = React.useState(9);
  const [open, setOpen] = React.useState(false);

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
        setData([...response.data.data]);
        //console.log([...response.data.data]);
        setLoading(response.data.msg);
        setENum(response.data.data.length);
      });
  };

  const submit = (id) => {
    // confirmAlert({
    //   title: "Confirm to Delete",
    //   message: "Do you want to delete this employee?",
    //   buttons: [
    //     {
    //       label: "Yes",
    //       onClick: () => deleteEmp(id),
    //     },
    //     {
    //       label: "No",
    //     },
    //   ],
    // });
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
      //setData([...copy]);
    } else {
      console.log([...data]);
      let temp = data.filter((d) => {
        return d.username.includes(search);
      });
      console.log(temp);
      setData([...temp]);
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
          <Input
            id="input-with-icon-adornment"
            placeholder="Employee Name"
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <Button
            className="submitbtn"
            onClick={() => SearchEmp()}
            style={{ marginLeft: "10px" }}
          >
            Search
          </Button>
        </div>
        <Button
          className="submitbtn"
          //style={{ marginBottom: "20px" }}
          onClick={() => setMod(true)}
        >
          Add new Employee
        </Button>
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
              <th className="thead">Username</th>
              <th className="thead">Email</th>
              <th className="thead">Role</th>
              <th className="thead">More Info</th>
              <th className="thead">Action</th>
              <th className="thead">Status</th>
              <th className="thead">SS</th>
            </tr>
          </thead>
          <tbody>
            {data.map(function (data, index) {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data.username} ❌ </td>
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
                    <Dropdown>
                      <Dropdown.Toggle
                        style={{ all: "unset", cursor: "pointer" }}
                      >
                        {/* <MoreVertIcon /> */}
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
                  <td>{data.desktop ? <Online /> : <Offline />}</td>
                  <td>
                    <ToggleButton
                      value="check"
                      // selected={selected}
                      // onChange={() => {
                      //   setSelected(!selected);
                      // }}
                    >
                      <PhotoCameraIcon />
                    </ToggleButton>
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
