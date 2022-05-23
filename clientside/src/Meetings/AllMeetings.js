import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/DeleteForeverSharp";
import axios from "axios";
import "./meeting.css";
import ReactLoading from "react-loading";
import SetMeeting from "./SetMeeting";
const AllMeetings = () => {
  const [allMeetings, setAllMeetings] = useState();
  const [headers, setHeaders] = useState();
  const [loading, setLoading] = useState(false);

  //get All Meetings
  useEffect(() => {
    const fetchData = async () => {
      // get the data from the api
      const res = await axios.get(
        "http://localhost:5000/myVideo/getMyMeetings"
      );
      setAllMeetings(res.data);
      // console.log(Object.keys(res.data[0]));
      setHeaders(Object.keys(res.data[0]));
      setLoading(true);
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
          console.log("Deleted");
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
        <div className="all-meetings-container">
          {allMeetings ? (
            <>
              <h1 style={{ textAlign: "center" }}>All Meetings</h1>
              <table className="all-meetings-table">
                {headers?.map((header) => {
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
                })}
                {/* All headers */}
                {/* <th className="header">Room URL</th>
                <th className="header">Hosted By</th>
                <th className="header">Title</th>
                <th className="header">Description</th>
                <th className="header">Date</th>
                <th className="header">Time</th>
                <th className="header">Delete</th> */}
                {/* </tr> */}
                {allMeetings.map((myObj, key) => {
                  var time = moment.utc(myObj.startDate).format("HH:mm");
                  return (
                    <tr key={myObj._id}>
                      <td className="all-meeting-row link">
                        <Link to={`/allMeetings/:${myObj.roomUrl}`}>
                          {myObj.roomUrl}
                        </Link>
                      </td>
                      {/* <td className="row">{myObj.roomUrl}</td> */}
                      <td className="row">{myObj.hostedBy}</td>
                      <td className="row">{myObj.title}</td>
                      <td className="row">{myObj.agenda}</td>
                      {/* {console.log(myObj.startDate.substr(11))} */}
                      <td className="row">{myObj.startDate.substr(0, 10)}</td>
                      <td className="row">{time}</td>
                      <td className="row">
                        <DeleteIcon
                          className="delete-icon"
                          onClick={() => handleDeleteMeeting(myObj)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </table>
            </>
          ) : (
            <>
              <h1>You have No Meetings</h1>
            </>
          )}
        </div>
      ) : (
        <ReactLoading
          type="spin"
          color="#fafa"
          height={667}
          width={375}
          className="loading"
        />
      )}
    </div>
  );
};

export default AllMeetings;
