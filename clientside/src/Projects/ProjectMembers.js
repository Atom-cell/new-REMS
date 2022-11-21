import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast } from "react-toastify";
import { SocketContext } from "../Helper/Context";
const ProjectMembers = ({
  showInviteModal,
  setShowInviteModal,
  handleClose,
  handleShow,
  myProject,
  setMyProject,
  selectedEmployees,
  setSelectedEmployees,
  user,
}) => {
  const [tableEmployees, setTableEmployees] = useState();
  const { sock, setSocket } = React.useContext(SocketContext);

  const handleChange = (e, id) => {
    if (e.target.checked) setSelectedEmployees([...selectedEmployees, id]);
    else setSelectedEmployees(selectedEmployees?.filter((emp) => emp !== id));
  };

  const handleInvite = (emps) => {
    // console.log(emps);

    sock.emit("ProjectShared", {
      pName: myProject.projectName,
      emps: emps,
      oldMembers: myProject.projectAssignedTo,
    });
    axios.post("/notif/addedInProjectNotif", {
      projectId: myProject._id,
      emps: emps,
    });
    axios
      .post("/myprojects/addmemberstoproject", {
        projectId: myProject._id,
        emps: emps,
      })
      .then((res) => {
        setMyProject(res.data);
        // console.log(res.data);
      })
      .catch((err) => console.log(err + "project members 32"));
  };

  const handleSearchEmployees = (e) => {
    var user = JSON.parse(localStorage.getItem("user"));
    setTimeout(() => {
      const value = e.target.value;
      if (value == null || value === "" || value === undefined) {
        // console.log("hello");
        fetchData();
      } else {
        if (localStorage.getItem("role") == "Employee") {
          axios
            .get(`/emp/getallusersbyname/${value}`, {
              params: { _id: user._id },
            })
            .then((rec) => {
              // console.log(rec.data);
              var withoutMe = rec.data.filter((emp) => emp._id !== user._id);
              setTableEmployees(withoutMe);
            })
            .catch((err) => console.log(err));
        } else {
          axios
            .get(`/emp/getallmyusersbyname/${value}`, {
              params: { _id: user._id },
            })
            .then((rec) => {
              // console.log(rec.data);
              var withoutMe = rec.data.filter((emp) => emp._id !== user._id);
              setTableEmployees(withoutMe);
            })
            .catch((err) => console.log(err));
        }
      }
    }, 1000);
  };

  const fetchData = async () => {
    // get the data from the api
    var userId = JSON.parse(localStorage.getItem("user"))._id;
    if (localStorage.getItem("role") === "Employee") {
      const res = await axios.get(
        "http://localhost:5000/emp/getcompanyemployees",
        {
          params: { _id: userId },
        }
      );
      var withoutMe = res.data.filter((emp) => emp._id !== userId);
      setTableEmployees(withoutMe);
    } else {
      const res = await axios.get("http://localhost:5000/emp/getmyemployees", {
        params: { _id: userId },
      });
      var withoutMe = res.data.filter((emp) => emp._id !== userId);
      setTableEmployees(withoutMe);
    }
  };

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);
  return (
    <>
      <Modal show={showInviteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Share {myProject?.projectName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="input-group mb-3 chat-menu-search-bar">
              <input
                type="text"
                //   className="form-control bg-light border-0 pe-0 chat-search"
                className="form-control bg-light border-0 pe-0"
                placeholder="Search Employee.."
                aria-label="Example text with button addon"
                aria-describedby="searchbtn-addon"
                onChange={handleSearchEmployees}
              />
            </div>
          </Form>
          <div className="meeting-employees-table">
            <Table bordered hover>
              <thead>
                <tr>
                  {user?.role !== "Employee" && <th>Select</th>}
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {tableEmployees?.map((employee) => {
                  return (
                    <tr key={employee._id}>
                      <>
                        {user?.role !== "Employee" && (
                          <>
                            {selectedEmployees?.includes(employee._id) ? (
                              <td>
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  value={employee.username}
                                  onChange={(e) =>
                                    handleChange(e, employee._id)
                                  }
                                  checked={true}
                                />
                              </td>
                            ) : (
                              <td>
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  value={employee.username}
                                  onChange={(e) =>
                                    handleChange(e, employee._id)
                                  }
                                />
                              </td>
                            )}
                          </>
                        )}
                      </>
                      <td>{employee.username}</td>
                      <td>{employee.email}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleInvite(selectedEmployees);
              handleClose();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProjectMembers;
