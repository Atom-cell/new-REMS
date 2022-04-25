import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import SearchBar from "./SearchBar";
import RemoveIcon from "@material-ui/icons/Remove";
const { v4: uuidV4 } = require("uuid");

const ConferenceCall = () => {
  const [newMeet, setNewMeet] = useState({
    title: "",
    agenda: "",
    startDate: "",
    endDate: "",
  });
  const [allMeetings, setAllMeetings] = useState();
  const [employees, setEmployees] = useState([]);

  // Add a meeting
  const addMeeting = () => {
    var uniqueId = uuidV4();
    console.log(employees);
    const myObj = {
      roomUrl: uniqueId,
      hostedBy: "Naseer",
      title: newMeet.title,
      agenda: newMeet.agenda,
      startDate: newMeet.startDate,
      endDate: newMeet.endDate,
      employees: employees
    };
    console.log(myObj);

    axios
      .post("http://localhost:5000/myVideo/addNewMeeting", myObj)
      .then((res) => {
        console.log("Meeting Added: " + res.data);
        // console.log(res);
        // console.log(res.data);
      });
    setNewMeet({ title: "", agenda: "", startDate: "", endDate: "" });
    setEmployees([]);
  };

  // get all meetings
  useEffect(() => {
    fetch("http://localhost:5000/myVideo/getMyMeetings")
      .then((res) => res.json())
      .then((json) => {
        // array that has objects
        setAllMeetings(json);
      });
  }, []);

  const addEmployeeToMeeting = (word) => {
    setEmployees([...employees, word]);
    // console.log(employees);
  };

  const handleRemoveEmployee = (emp) => {
    // remove employee from list
    setEmployees(employees.filter((item) => item !== emp))
  };

  return (
    <div>
      <div className="backButtonContainer">
        <Link to="/" className="backButton">
          Back
        </Link>
      </div>
      <div className="modalContainer" style={{ marginLeft: "30%" }}>
        <h1>Set Meeting</h1>
        <input
          type="text"
          placeholder="Enter Title"
          className="inputTextFields"
          value={newMeet.title}
          onChange={(e) => setNewMeet({ ...newMeet, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Enter Description"
          className="inputTextFields"
          value={newMeet.agenda}
          onChange={(e) => setNewMeet({ ...newMeet, agenda: e.target.value })}
        />
        <DatePicker
          placeholderText="Start Date"
          selected={newMeet.startDate}
          onChange={(startDate) => setNewMeet({ ...newMeet, startDate })}
          className="inputTextFields"
        />
        <DatePicker
          placeholderText="End Date"
          className="inputTextFields"
          selected={newMeet.endDate}
          onChange={(endDate) => setNewMeet({ ...newMeet, endDate })}
        />
        <SearchBar
          placeholder="Search Employees"
          employees={employees}
          setEmployees={setEmployees}
          addEmployeeToMeeting={addEmployeeToMeeting}
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
                <RemoveIcon style={{ cursor: "pointer" }} />{" "}
              </div>
            </div>
          ))}
        </div>
        <div className="addMeetButtonContainer">
          <button className="addMeetButton" onClick={() => addMeeting()}>
            Add Meting
          </button>
        </div>
      </div>
      <div>
        <h1 style={{ textAlign: "center" }}>All Meetings</h1>
        {allMeetings && (
          <table>
            <tr>
              {/* Get all the headers from the array of objects */}
              {Object.keys(allMeetings[0]).map((header, index) => {
                if (index != 0 && header != "__v" && header !="employees") {
                  // console.log(index+""+e);
                  return <th>{header}</th>;
                }
              })}
              {/* {console.log(Object.keys(allMeetings[0]))} */}
            </tr>
            {allMeetings.map((myObj, key) => {
              return (
                <tr key={myObj._id}>
                  {/* <td>{myObj._id}</td> */}
                  <td>{myObj.roomUrl}</td>
                  <td>{myObj.hostedBy}</td>
                  <td>{myObj.title}</td>
                  <td>{myObj.agenda}</td>
                  <td>{myObj.startDate}</td>
                  <td>{myObj.endDate}</td>
                </tr>
              );
            })}
          </table>
        )}
      </div>
    </div>
  );
};

export default ConferenceCall;
