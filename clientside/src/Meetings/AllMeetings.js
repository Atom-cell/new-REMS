import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/DeleteForeverSharp";
import axios from "axios";

const AllMeetings = () => {
  const [allMeetings, setAllMeetings] = useState();

  //get All Meetings
  useEffect(() => {
    const fetchData = async () => {
      // get the data from the api
      const res = await axios.get(
        "http://localhost:5000/myVideo/getMyMeetings"
      );
      setAllMeetings(res.data);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, [allMeetings]);

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
      <div className="backButtonContainer">
        <Link to="/" className="backButton">
          Back
        </Link>
      </div>
      {allMeetings ? (
        <>
          <h1 style={{ textAlign: "center" }}>All Meetings</h1>
          <table>
            <tr>
              {/* All headers */}
              <th>Room URL</th>
              <th>Hosted By</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th>Delete</th>
            </tr>
            {allMeetings.map((myObj, key) => {
              var time = moment.utc(myObj.startDate).format("HH:mm");
              return (
                <tr key={myObj._id}>
                  <td>
                    <Link to={`/setMeeting/:${myObj.roomUrl}`}>
                      {myObj.roomUrl}
                    </Link>
                  </td>
                  {/* <td>{myObj.roomUrl}</td> */}
                  <td>{myObj.hostedBy}</td>
                  <td>{myObj.title}</td>
                  <td>{myObj.agenda}</td>
                  {/* {console.log(myObj.startDate.substr(11))} */}
                  <td>{myObj.startDate.substr(0, 10)}</td>
                  <td>{time}</td>
                  <td>
                    <DeleteIcon onClick={() => handleDeleteMeeting(myObj)} />
                  </td>
                </tr>
              );
            })}
          </table>
        </>
      ) : (
        <h1>No Meetings</h1>
      )}
    </div>
  );
};

export default AllMeetings;
