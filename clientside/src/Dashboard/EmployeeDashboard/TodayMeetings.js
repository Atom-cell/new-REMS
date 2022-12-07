import React from "react";
import { Spinner, Table, Nav, Row, Col } from "react-bootstrap";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from "moment";
import MeetingEmployees from "../../Meetings/MeetingEmployees";
import ReadMore from "../../Meetings/ReadMore";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TodayMeetings = () => {
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [allMeetings, setAllMeetings] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [allEvents, setAllEvents] = React.useState();
  const [calendarData, setCalendarData] = React.useState(null); // handling filter

  const [moreEvents, setMoreEvents] = React.useState();
  const [showMoreEvents, setShowMoreEvents] = React.useState(false);
  const [event, setEvent] = React.useState();

  const handleShowMoreEvents = () => setShowMoreEvents(true);

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

    axios
      .get("/myCalendar/", { params: { userId: user._id } })
      .then((res) => {
        // setCalendarData(res.data);
        // setAllEvents(res.data);
        // console.log("CALLLLEE :", res.data);
        filterAgenda(res.data);
      })
      .catch((err) => console.log(err));

    setLoading(false);
  };

  const filterAgenda = (arr) => {
    const day = new Date().getDate();
    let filter = [];
    arr.forEach((a) => {
      if (new Date(a.startDate).getDate() == day) filter.push(a);
    });
    setCalendarData([...filter]);
    // console.log("FILTEEEEEEE: ", filter);
  };

  const eventSelected = (e) => {
    setEvent(e);
    // console.log(e);
    if (e?.projectId) {
      // get that project
      axios
        .get("/myprojects/getmyproject", {
          params: { projectId: e.projectId },
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.log(err + "My Calendar 151"));
    }
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
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Spinner animation="grow" />
                  </div>
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
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendarData?.map((c, i) => {
                      return (
                        <tr
                          key={i}
                          style={
                            c.category === "Reminder"
                              ? { backgroundColor: "#1890ff" }
                              : { backgroundColor: "#74caff" }
                          }
                        >
                          <td>{new Date(c.startDate).toLocaleDateString()}</td>
                          <td>{new Date(c.startDate).toLocaleTimeString()}</td>
                          <td>{c.title}</td>
                        </tr>
                      );
                    })}
                  </tbody>
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
