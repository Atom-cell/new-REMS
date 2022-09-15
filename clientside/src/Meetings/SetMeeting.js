import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import SearchBar from "../Componentss/SearchBar";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/DeleteForeverSharp";
import moment from "moment";
import "./setmeeting.css";
import { toast } from "react-toastify";
const { v4: uuidV4 } = require("uuid");

const SetMeetingg = ({ userId, newMeet, setNewMeet }) => {
  const [show, setShow] = useState(false);

  const [employees, setEmployees] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fixTimezoneOffset = (date) => {
    if (!date) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toJSON();
  };

  // Add a meeting
  const addMeeting = () => {
    if (
      newMeet.title &&
      newMeet.startDate &&
      newMeet.agenda &&
      employees.length > 0
    ) {
      let user = JSON.parse(localStorage.getItem("user"));
      let username = user.username;
      employees.push(username);
      var uniqueId = uuidV4();
      // console.log(newMeet.startDate);
      // console.log(employees);
      const myObj = {
        roomUrl: uniqueId,
        hostedBy: username,
        hostedById: user._id,
        title: newMeet.title,
        agenda: newMeet.agenda,
        startDate: fixTimezoneOffset(newMeet.startDate),
        // endDate: newMeet.endDate,
        employees: employees,
      };

      axios
        .post("http://localhost:5000/myVideo/addNewMeeting", myObj)
        .then((res) => {
          //   console.log("Meeting Added: " + res.data);
          toast.success("Meeting Set");
          handleClose();
          // console.log(res);
          // console.log(res.data);
        });
      setNewMeet({ title: "", agenda: "", startDate: "" });
      setEmployees([]);
    } else {
      alert("Please Fill All Required Fields");
    }
  };

  const addEmployeeToMeeting = (word) => {
    if (employees.includes(word)) {
      toast.info(`${word} already selected`);
    } else {
      setEmployees([...employees, word]);
    }
  };

  const handleRemoveEmployee = (emp) => {
    // remove employee from list
    setEmployees(employees.filter((item) => item !== emp));
  };

  return (
    <>
      <Button className="submitbtn" onClick={handleShow}>
        Set Meeting
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Set Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <input
              type="text"
              placeholder="Enter Title"
              className="inputTextFields"
              value={newMeet.title}
              onChange={(e) =>
                setNewMeet({ ...newMeet, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Enter Description"
              className="inputTextFields"
              value={newMeet.agenda}
              onChange={(e) =>
                setNewMeet({ ...newMeet, agenda: e.target.value })
              }
            />
            <DatePicker
              placeholderText="Start Date & Time"
              selected={newMeet.startDate}
              onChange={(startDate) => setNewMeet({ ...newMeet, startDate })}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm"
              showTimeSelect
              className="inputTextFields"
              minDate={new Date()}
            />
            <SearchBar
              placeholder="Search Employees"
              employees={employees}
              setEmployees={setEmployees}
              addEmployeeToMeeting={addEmployeeToMeeting}
              myId={userId}
            />
            {/* Show Selected Employees */}
            <div className="selectedEmployeesContainer">
              {employees.map((entry) => (
                <div className="selectedEmployees" style={{ display: "flex" }}>
                  {entry}{" "}
                  <div
                    onClick={() => handleRemoveEmployee(entry)}
                    style={{ marginLeft: "10px" }}
                  >
                    {" "}
                    <RemoveIcon className="remove-icon" />{" "}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => addMeeting()}>
            Add Meeting
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SetMeetingg;
