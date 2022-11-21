import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Alert, Form } from "react-bootstrap";
import "./meetingemployeestable.css";
import ShowBoardMembers from "../Boards/ShowBoardMembers";
const MeetingEmployeesTable = ({
  showEmployeesTable,
  handleCloseEmployeesTable,
  handleShowEmployeesTable,
  selectedEmployees,
  setSelectedEmployees,
  handleInvite,
  bid,
  empId,
}) => {
  const [tableEmployees, setTableEmployees] = useState();

  const handleChange = (e, id) => {
    if (e.target.checked) setSelectedEmployees([...selectedEmployees, id]);
    else setSelectedEmployees(selectedEmployees.filter((emp) => emp !== id));
  };

  const handleSearchEmployees = (e) => {
    var user = JSON.parse(localStorage.getItem("user"));
    setTimeout(() => {
      const value = e.target.value;
      if (value == null || value === "" || value === undefined) {
        // console.log("hello");
        fetchData();
      } else {
        if (localStorage.getItem("role") === "Employee") {
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
        { params: { _id: userId } }
      );
      //   console.log(res.data);
      const response = await axios.get("http://localhost:5000/emp/getmyadmin", {
        params: { _id: userId },
      });
      var withoutMe = res.data.filter((emp) => emp._id !== userId);
      setTableEmployees([...withoutMe, response.data[0]]);
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

  useEffect(() => {
    if (
      handleInvite !== undefined &&
      empId === JSON.parse(localStorage.getItem("user"))._id
    ) {
      axios
        .get("/myboards/getsharewith/employees", { params: { bid: bid } })
        .then((res) => {
          // console.log(res.data[0].sharewith);
          setSelectedEmployees(res.data[0].sharewith);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div>
      {/* {handleInvite != undefined && (
        <ShowBoardMembers bid={bid} selectedEmployees={selectedEmployees} />
      )} */}
      {empId === JSON.parse(localStorage.getItem("user"))._id && (
        <Button
          variant="primary"
          onClick={handleShowEmployeesTable}
          style={{ marginTop: "10px", height: "40px" }}
        >
          {handleInvite !== undefined && "Share Board"}
        </Button>
      )}
      {handleInvite === undefined && (
        <Button
          variant="primary"
          onClick={handleShowEmployeesTable}
          style={{ marginTop: "10px", height: "40px" }}
        >
          Set Meeting With
        </Button>
      )}
      {selectedEmployees?.length > 0 && handleInvite === undefined && (
        <Alert
          variant="danger"
          onClose={() => setSelectedEmployees([])}
          dismissible
          className="alert-dismiss-custom rounded-pill font-size-12 mb-1 selected-employees-alert"
        >
          <p className="">
            {selectedEmployees?.length > 1
              ? `${selectedEmployees?.length} Employees Selected`
              : `${selectedEmployees?.length} Employee Selected`}
          </p>
        </Alert>
      )}

      <Modal show={showEmployeesTable} onHide={handleCloseEmployeesTable}>
        <Modal.Header closeButton>
          <Modal.Title>
            {handleInvite != undefined ? (
              <>
                <h3>Invite Members</h3>
                <h7 className="boards-below-title">
                  New members will gain access to the current board and will be
                  able to create,edit,update,delete this board
                </h7>
              </>
            ) : (
              "Employees"
            )}
          </Modal.Title>
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
                  <th>Select</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {tableEmployees?.map((employee) => {
                  return (
                    <tr key={employee._id}>
                      {selectedEmployees.includes(employee._id) ? (
                        <td>
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value={employee.username}
                            onChange={(e) => handleChange(e, employee._id)}
                            checked={true}
                          />
                        </td>
                      ) : (
                        <td>
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value={employee.username}
                            onChange={(e) => handleChange(e, employee._id)}
                          />
                        </td>
                      )}
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
          <Button variant="secondary" onClick={handleCloseEmployeesTable}>
            Close
          </Button>
          {handleInvite !== undefined ? (
            <Button
              variant="primary"
              onClick={() => {
                handleInvite(selectedEmployees);
                handleCloseEmployeesTable();
              }}
            >
              Invite
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                setSelectedEmployees(tableEmployees.map((emp) => emp.username));
                handleCloseEmployeesTable();
              }}
            >
              Select All Employees
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MeetingEmployeesTable;
