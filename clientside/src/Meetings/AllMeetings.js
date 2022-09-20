import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import moment from "moment";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import ReactLoading from "react-loading";
import { Table } from "react-bootstrap";
import "./allmeetings.css";
import SetMeeting from "./SetMeeting";
import MeetingEmployees from "./MeetingEmployees";
import ReadMore from "./ReadMore";
const AllMeetings = () => {
  const [allMeetings, setAllMeetings] = useState();
  const [loading, setLoading] = useState(true);
  const [newMeet, setNewMeet] = useState({
    title: "",
    agenda: "",
    startDate: "",
    // endDate: "",
  });

  var loggedUser = JSON.parse(localStorage.getItem("user"));

  const formatAMPM = (date) => {
    // var date = date.substr(0, 10);

    // var hours = date.substr(0, 5);
    // console.log(date.substr(3, 4));
    var hours = date.substr(0, 2);
    var minutes = date.substr(3, 4);
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  //get All Meetings
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    let username = user.username;
    // console.log("username: " + username);

    const fetchData = async () => {
      // get the data from the api
      const res = await axios.get(
        `http://localhost:5000/myVideo/getMyMeetings/${username}`
      );
      console.log(res.data);
      setAllMeetings(res.data);
      setLoading(false);
      // console.log(Object.keys(res.data[0]));
      // setHeaders(Object.keys(res.data[0]));
      // console.log("loading", loading);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, [newMeet]);

  const handleDeleteMeeting = (meeting) => {
    // delete a meeting
    // console.log(meeting);
    const r = window.confirm("Would you like to remove this event?");
    if (r === true) {
      axios
        .delete("http://localhost:5000/myVideo/DeleteMeeting", {
          data: { _id: meeting._id },
        })
        .then(() => {
          // console.log("Deleted");
          // console.log(allMeetings.filter((data) => data._id != meeting._id));
          setAllMeetings(allMeetings.filter((data) => data._id != meeting._id));
        });
    }
  };
  return (
    <div className="all-meetings-container">
      {/* <div className="backButtonContainer">
        <Link to="/" className="backButton">
          Back
        </Link>
      </div> */}
      {loading ? (
        <div className="loading">
          <ReactLoading type="spin" color="#1890ff" height={667} width={375} />
        </div>
      ) : (
        <div
          className="all-meetings-container"
          style={{
            marginRight: "30px",
            marginLeft: "30px",
          }}
        >
          <div className="all-meetings-button">
            {/* <button onClick={() => navigate("/setMeeting")}>Set Meeting</button> */}
            <SetMeeting
              userId={loggedUser._id}
              newMeet={newMeet}
              setNewMeet={setNewMeet}
            />
          </div>
          <div className="all-meetings-table-container">
            <Table hover bordered className="all-meetings-table">
              <thead>
                <tr>
                  <th>Room URL</th>
                  <th>Hosted by</th>
                  <th>Title</th>
                  <th>Agenda</th>
                  <th>Start Date</th>
                  <th>Start Time</th>
                  <th>Members</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {allMeetings.length != 0 &&
                  allMeetings?.map((myObj, key) => {
                    var time = moment.utc(myObj.startDate).format("HH:mm");
                    time = formatAMPM(time);
                    return (
                      <tr key={myObj._id}>
                        <td className="all-meeting-row link">
                          <Nav.Link href={`/allMeetings/:${myObj.roomUrl}`}>
                            {myObj.roomUrl}
                          </Nav.Link>
                        </td>
                        {/* <td className="row">{myObj.roomUrl}</td> */}
                        <td className="all-meeting-row">{myObj.hostedBy}</td>
                        <td className="all-meeting-row">{myObj.title}</td>
                        <td className="all-meeting-row all-meeting-row-delete-icon read-more-cell">
                          {myObj.agenda.length > 30 ? (
                            <>
                              <ReadMore data={myObj.agenda} />
                            </>
                          ) : (
                            myObj.agenda
                          )}
                        </td>
                        {/* {console.log(myObj.startDate.substr(11))} */}
                        <td className="all-meeting-row">
                          {myObj.startDate.substr(0, 10)}
                        </td>
                        <td className="all-meeting-row">{time}</td>
                        <td className="all-meeting-row">
                          <MeetingEmployees
                            employees={myObj.employees}
                            title={myObj.title}
                          />
                        </td>
                        {loggedUser._id == myObj.hostedById && (
                          <td className="all-meeting-row all-meeting-row-delete-icon">
                            <DeleteOutlineIcon
                              className="delete-icon"
                              onClick={() => handleDeleteMeeting(myObj)}
                            />
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </div>
          {allMeetings.length == 0 && (
            <div className="no-meetings">
              <h1>No Meetings</h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllMeetings;
