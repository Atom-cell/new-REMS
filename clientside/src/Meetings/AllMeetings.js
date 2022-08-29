import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/DeleteForeverSharp";
import axios from "axios";
import "./meeting.css";
import ReactLoading from "react-loading";
import { Table } from "react-bootstrap";
import "./allmeetings.css";
const AllMeetings = () => {
  const navigate = useNavigate();
  const [allMeetings, setAllMeetings] = useState();
  // const [headers, setHeaders] = useState();
  const [loading, setLoading] = useState(true);
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
      // console.log(res.data);
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
  }, []);

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
    <div>
      {/* <div className="backButtonContainer">
        <Link to="/" className="backButton">
          Back
        </Link>
      </div> */}
      {loading ? (
        <div className="loading">
          <ReactLoading type="spin" color="#fafa" height={667} width={375} />
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
            <button onClick={() => navigate("/setMeeting")}>Set Meeting</button>
          </div>
          <Table hover bordered className="all-meetings-table">
            <thead>
              <tr>
                <th>Room URL</th>
                <th>Hosted by</th>
                <th>Title</th>
                <th>Agenda</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>Delete</th>
              </tr>
            </thead>
            {/* {headers?.map((header) => {
                  // console.log(header);
                  if (
                    header != "_id" &&
                    header != "employees" &&
                    header != "__v"
                  ) {
                    return <th className="header">{header}</th>;
                  }
                  if (header == "__v") {
                    return (
                      <>
                        <th className="header">Time</th>
                        <th className="header">Delete</th>
                      </>
                    );
                  }
                })} */}
            {/* All headers */}
            {/* <th className="header">Room URL</th>
                <th className="header">Hosted By</th>
                <th className="header">Title</th>
                <th className="header">Description</th>
                <th className="header">Date</th>
                <th className="header">Time</th>
                <th className="header">Delete</th> */}
            {/* </tr> */}
            <tbody>
              {allMeetings.length != 0 ? (
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
                      <td className="all-meeting-row">{myObj.agenda}</td>
                      {/* {console.log(myObj.startDate.substr(11))} */}
                      <td className="all-meeting-row">
                        {myObj.startDate.substr(0, 10)}
                      </td>
                      <td className="all-meeting-row">{time}</td>
                      {loggedUser._id == myObj.hostedById && (
                        <td className="all-meeting-row">
                          <DeleteIcon
                            className="delete-icon"
                            onClick={() => handleDeleteMeeting(myObj)}
                          />
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <div className="no-meetings">
                  <h1>No Meetings</h1>
                </div>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AllMeetings;
