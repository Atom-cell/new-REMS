import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
const { v4: uuidV4 } = require("uuid");
const ConferenceCall = () => {
  const [newMeet, setNewMeet] = useState({
    title: "",
    agenda: "",
    startDate: "",
    endDate: "",
  });
  const [allMeetings, setAllMeetings] = useState();
  const addMeeting = () => {
    var uniqueId = uuidV4();
    // console.log(uniqueId);
    const myObj = {
      roomUrl: uniqueId,
      hostedBy: "Naseer",
      title: newMeet.title,
      agenda: newMeet.agenda,
      startDate: newMeet.startDate,
      endDate: newMeet.endDate,
    };
    // console.log(myObj);

    axios
      .post("http://localhost:5000/myVideo/addNewMeeting", myObj)
      .then((res) => {
        console.log("Meeting Added: " + res.data);
        // console.log(res);
        // console.log(res.data);
      });
    setNewMeet({ title: "", agenda: "", startDate: "", endDate: "" });
  };

  // get all meetings
  useEffect(() => {
    fetch("http://localhost:5000/myVideo")
      .then((res) => res.json())
      .then((json) => {
        // array that has objects
        setAllMeetings(json);
      });
  }, []);

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
        <div className="addMeetButtonContainer">
          <button className="addMeetButton" onClick={() => addMeeting()}>
            Add Meting
          </button>
        </div>
      </div>
      <div>
        <h1 style={{textAlign:"center"}}>All Meetings</h1>
        {allMeetings && (
          <table>
            <tr>
              {allMeetings[0].length}
              {allMeetings.flatMap(Object.keys).map((e,index)=>{
                if(index!=0 && e!="__v"){
                  // console.log(index+""+e);
                 return <th>{e}</th>
                }
              })}
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
