import { MoreInfoContext } from "../Helper/Context";
import LoadingModal from "./LoadingModal";
import RecoverEmps from "./RecoverEmps";
import React from "react";
import axios from "axios";
import "./EmpManage.css";
import {
  Table,
  Button,
  Dropdown,
  Spinner,
  Badge,
  Modal,
} from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import {
  Input,
  TextField,
  Snackbar,
  Alert,
  ToggleButton,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddEmpModal from "./AddEmpModal";
import { baseURL } from "../Request";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8900");

function Online() {
  return (
    <p>
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

function Zone({ color }) {
  return (
    <span
      style={{
        height: "2em",
        width: "2em",
        backgroundColor: color,
        borderRadius: "50%",
        display: "inline-block",
      }}
    ></span>
  );
}

function EmpManage() {
  // fetching data

  const navigate = useNavigate();

  const [mod, setMod] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [copy, setCopy] = React.useState([...data]);
  const [copy2, setCopy2] = React.useState([...data]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(0);
  const [eNum, setENum] = React.useState(0);
  const [msg, setMsg] = React.useState(9);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState([false]); //for showing that ss is toggled on off
  const [currentPage, setCurrentPage] = React.useState(1);
  const [postsPerPage, setPostsPerPage] = React.useState(10);
  const [loadingModal, setLoadingModal] = React.useState(false);
  const [productivity, setProductivity] = React.useState();
  const [show, setShow] = React.useState(false); //for showing productivity
  const [recover, setRecover] = React.useState(false);

  const handleCloseModal = () => setShow(false); //for showing productivity in modal
  const handleShow = () => setShow(true); //for showing productivity in modal

  const { moreInfo, setMoreInfo } = React.useContext(MoreInfoContext);
  const month = new Date().getMonth() + 1;

  const monthName = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };
  React.useEffect(() => {
    getData();
  }, [eNum]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingModal(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [loadingModal]);

  const getData = async () => {
    await axios
      .get(`${baseURL}/admin/allEmps`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("response from server ", response.data.data);
        setData([...response.data.data]);
        setCopy2([...response.data.data]);
        //console.log([...response.data.data]);
        setLoading(response.data.msg);
        setENum(response.data.data.length);
      });
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
  // socketconsole.log("Current", currentPosts);

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
    axios
      .delete(`${baseURL}/emp/deleteEmp/${id}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => toast.success("User deleted"));

    getData();
  };

  const closeMod = () => {
    setMod(false);
  };

  const activeUser = () => {
    setRecover(false);
    getData();
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
    socket.emit("StartSS", email);
    if (selected[index] === true) {
      socket.emit("StopSS", email);
      let temp = [...selected];
      temp[index] = false;
      setSelected([...temp]);
    } else {
      socket.emit("StartSS", email);
      let temp = [...selected];
      temp[index] = true;
      setSelected([...temp]);
    }
  };

  const setInfo = (data) => {
    setMoreInfo(data);
    navigate("/moreInfo");
  };

  const calculateProductivity = async (id, name) => {
    let data = [];
    let boards = [];
    await axios
      .get(`http://localhost:5000/report/employeeprojects/${id}/${11}`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("proj ", response.data);
        data = [...response.data];
        setLoading(1);
      });

    let timeWorked = filterProjectData([...data], name);

    await axios
      .get("http://localhost:5000/report/onlymyboards", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("BOARDS :;  ", response.data);
        boards = [...response.data];
      });

    filterBoards(data, boards, id, timeWorked);
  };

  //time spent doing the projects
  const filterProjectData = (arr, name) => {
    let totalTime = 0;
    let secs = [];

    arr.forEach((a) => {
      a.hoursWorked.forEach((h) => {
        if (h.user === name) {
          let str = h.time.split(":");
          str = str[0] * 3600 + str[1] * 60 + str[2] * 1;
          secs.push(str);
          totalTime += str;
        }
      });
    });

    console.log("Total time workedon : ", totalTime);
    return totalTime;
  };

  const filterBoards = (projects, boards, id, timeWorked) => {
    console.log("filterProjsfilterprojs: ", projects);
    console.log("filterBoardsfilterBoards: ", boards);
    let projectID = projects.map((p) => p._id);
    let newBoards = [];

    boards.forEach((b) => {
      if (projectID.includes(b.projectId)) {
        newBoards.push(b);
      }
    });

    newBoards = newBoards.map((b) => {
      return b.boards;
    });

    console.log("new boards: ", newBoards);

    let completed = 0;
    let assigned = 0;
    newBoards.forEach((b) => {
      b?.forEach((cards) => {
        cards.cards?.forEach((a) => {
          if (a.assignedTo === id) {
            assigned += a.tasks.length;
            a.tasks.forEach((tasks) => {
              if (tasks.completed) completed++;
            });
          }
        });
      });
    });

    let percent = timeWorked * 0.3 + (completed / assigned) * 0.7;
    console.log(timeWorked);
    console.log("completed ", completed);
    console.log("assigned ", assigned);
    console.log(percent);
    setProductivity(percent);
    if (isNaN(percent)) {
      toast.info("Not enough data");
    } else {
      setLoadingModal(true);
      sendNotification(percent, id);
    }
  };

  const sendNotification = (zone, id) => {
    axios
      .put("/admin/updateZone", { zone: zone, id: id })
      .then((response) => {})
      .catch((error) => {});

    axios.post(`/notif/zone/${id}`).then((response) => {
      getData();
    });
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
      {loadingModal ? (
        <LoadingModal closeMod={closeMod} prod={productivity} />
      ) : null}
      <h2 style={{ marginBottom: "1em" }}>Employee Management</h2>

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
        <div>
          {!recover ? (
            <Button className="submitbtn" onClick={() => setRecover(true)}>
              <SettingsBackupRestoreIcon
                style={{ fill: "white", marginRight: "0.5em" }}
              />
              Archive
            </Button>
          ) : (
            <Button className="submitbtn" onClick={() => setRecover(false)}>
              Active
            </Button>
          )}
          <Button
            className="submitbtn"
            onClick={() => setMod(true)}
            style={{ marginLeft: "0.7em" }}
          >
            <PersonAddIcon style={{ fill: "white", marginRight: "0.5em" }} />
            Add new Employee
          </Button>
        </div>
      </div>

      {loading === 0 ? (
        <div className="spinner">
          <Spinner animation="border" />
        </div>
      ) : loading === 1 && !recover ? (
        <>
          <Table className="table">
            <thead>
              <tr>
                <th className="thead">#</th>
                <th className="thead">Username</th>
                <th className="thead">Email</th>
                <th className="thead">Sreenshot</th>
                <th className="thead">Status</th>
                <th className="thead">Action</th>
                <th className="thead">Zone</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map(function (data, index) {
                // if (data.active) {
                return (
                  <tr key={index}>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => setInfo(data)}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => setInfo(data)}
                    >
                      {data.username}{" "}
                    </td>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => setInfo(data)}
                    >
                      {data.email}
                    </td>
                    <td>
                      <ToggleButton
                        value="check"
                        selected={selected[index]}
                        onClick={() =>
                          data.desktop && data.zone === "red"
                            ? Screenshots(index, data.email)
                            : toast.info(
                                "Screenshots only for red zone and online users"
                              )
                        }
                        style={{ padding: "0.5em" }}
                      >
                        <PhotoCameraIcon />
                      </ToggleButton>
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
                          <Dropdown.Item
                            onClick={() =>
                              calculateProductivity(data._id, data.username)
                            }
                          >
                            Calculate Productivity for {monthName[month]}
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => submit(data._id)}>
                            Delete
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() =>
                              navigate("/coach", { state: { emp: data } })
                            }
                          >
                            Add Strengths & Weaknesses
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => setInfo(data)}
                    >
                      {data.zone === "green" ? (
                        <Zone color="#1fd655" />
                      ) : data.zone === "yellow" ? (
                        <Zone color="yellow" />
                      ) : data.zone === "red" ? (
                        <Zone color="#f70d1a" />
                      ) : null}
                    </td>
                  </tr>
                );
                // }
              })}
            </tbody>
          </Table>
          <Pagination
            count={Math.ceil(data.length / postsPerPage)}
            variant="outlined"
            color="primary"
            onChange={(event, pageNumber) => setCurrentPage(pageNumber)}
            sx={{ float: "right" }}
          />
        </>
      ) : (
        <RecoverEmps activeUser={activeUser} />
      )}
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Calculated Productivity</Modal.Title>
        </Modal.Header>
        <Modal.Body>{productivity}</Modal.Body>
      </Modal>
    </div>
  );
}

export default EmpManage;
