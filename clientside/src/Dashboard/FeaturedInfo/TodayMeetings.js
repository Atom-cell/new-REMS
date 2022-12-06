import React from "react";
import { Spinner, Table, Nav, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import MeetingEmployees from "../../Meetings/MeetingEmployees";
import ReadMore from "../../Meetings/ReadMore";

const TodayMeetings = () => {
  const [allMeetings, setAllMeetings] = React.useState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let date = new Date().getDate();
    if (date < 10) date = `0${date}`;
    let user = JSON.parse(localStorage.getItem("user"));
    let meets = [];
    let username = user.username;
    await axios
      .get(`http://localhost:5000/myVideo/getMyMeetings/${username}`)
      .then((response) => {
        response.data.filter((m) => {
          if (m.startDate.slice(8, 10) == date) meets.push(m);
        });
        setAllMeetings([...meets]);
      });

    setLoading(false);
  };

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
  return (
    <>
      {loading ? (
        <Spinner animation="grow" />
      ) : (
        <>
          <Row>
            <Col md={7}>
              <h4 style={{ marginTop: "1em" }}>Today's Scheduled Meetings</h4>
              <div className="all-meetings-table-container">
                {loading ? (
                  <Spinner animation="grow" />
                ) : (
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
                      </tr>
                    </thead>
                    <tbody>
                      {allMeetings?.length !== 0 &&
                        allMeetings?.map((myObj, key) => {
                          var time = moment
                            .utc(myObj.startDate)
                            .format("HH:mm");
                          time = formatAMPM(time);
                          return (
                            <tr key={myObj._id}>
                              <td className="all-meeting-row link">
                                <Nav.Link
                                  href={`/allMeetings/:${myObj.roomUrl}`}
                                >
                                  {myObj.roomUrl}
                                </Nav.Link>
                              </td>
                              <td className="all-meeting-row">
                                {myObj.hostedBy}
                              </td>
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
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                )}
                {allMeetings?.length === 0 && (
                  <div className="no-meetings">
                    <h1>No Meetings Scheduled</h1>
                  </div>
                )}
              </div>
            </Col>
            <Col md={5}>
              <h4 style={{ marginTop: "1em" }}>Today's Agenda</h4>
              <div className="all-meetings-table-container">
                <Table hover bordered className="all-meetings-table">
                  <tr>
                    <thead>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Event</th>
                    </thead>
                  </tr>
                  <tbody></tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default TodayMeetings;
