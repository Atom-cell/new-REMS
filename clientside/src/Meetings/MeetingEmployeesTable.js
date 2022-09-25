import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Alert, Form } from "react-bootstrap";

const MeetingEmployeesTable = ({
  showEmployeesTable,
  handleCloseEmployeesTable,
  handleShowEmployeesTable,
  selectedEmployees,
  setSelectedEmployees,
}) => {
  const [tableEmployees, setTableEmployees] = useState();

  const handleChange = (e) => {
    if (e.target.checked)
      setSelectedEmployees([...selectedEmployees, e.target.value]);
    else
      setSelectedEmployees(
        selectedEmployees.filter((emp) => emp !== e.target.value)
      );
  };

  const handleSearchEmployees = (e) => {
    var user = JSON.parse(localStorage.getItem("user"));
    setTimeout(() => {
      const value = e.target.value;
      if (value == null || value == "" || value == undefined) {
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
              var withoutMe = rec.data.filter((emp) => emp._id != user._id);
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
              var withoutMe = rec.data.filter((emp) => emp._id != user._id);
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
    if (localStorage.getItem("role") == "Employee") {
      const res = await axios.get(
        "http://localhost:5000/emp/getcompanyemployees",
        { params: { _id: userId } }
      );
      //   console.log(res.data);
      const response = await axios.get("http://localhost:5000/emp/getmyadmin", {
        params: { _id: userId },
      });
      var withoutMe = res.data.filter((emp) => emp._id != userId);
      setTableEmployees([...withoutMe, response.data[0]]);
    } else {
      const res = await axios.get("http://localhost:5000/emp/getmyemployees", {
        params: { _id: userId },
      });
      var withoutMe = res.data.filter((emp) => emp._id != userId);
      setTableEmployees(withoutMe);
    }
  };

  useEffect(() => {
    fetchData().catch(console.error);
  }, []);
  return (
    <div>
      <Button
        variant="primary"
        onClick={handleShowEmployeesTable}
        style={{ marginTop: "10px" }}
      >
        Set Meeting With
      </Button>
      {selectedEmployees?.length > 0 && (
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
          <Modal.Title>Employees</Modal.Title>
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
                    {selectedEmployees.includes(employee.username) ? (
                      <td>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value={employee.username}
                          onChange={handleChange}
                          checked={true}
                        />
                      </td>
                    ) : (
                      <td>
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value={employee.username}
                          onChange={handleChange}
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEmployeesTable}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedEmployees(tableEmployees.map((emp) => emp.username));
              handleCloseEmployeesTable();
            }}
          >
            Select All Employees
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MeetingEmployeesTable;