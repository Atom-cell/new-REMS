import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "./Modal";
import axios from "axios";
import EditModal from "./EditModal";
import { Link } from "react-router-dom";
import moment from "moment";
import "./mycalendar.css";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
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
// Dummy Data
// const events =[
//   // date fromat (year, month, date). month and date starts from 0
//   {
//     title: "JS Meeting",
//     start: new Date(2022,3,4),
//     end: new Date(2022,3,4),
//     category:"Goal",
//   },
//   {
//     title: "Progress Meeting",
//     start: new Date(2022,3,8),
//     end: new Date(2022,3,10),
//     category:"Reminder",
//   },
//   {
//     title: "Party",
//     start: new Date(2022,3,15),
//     end: new Date(2022,3,17),
//     category:"Goal",
//   },
// ]

const MyCalendar = ({ name }) => {
  const [allEvents, setAllEvents] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [filterOptionValue, setFilterOptionValue] = useState("All");
  const [event, setEvent] = useState(); // handle modal events
  const [calendarData, setCalendarData] = useState(null); // handling filter
  const [newEvent, setNewEvent] = useState({ title: "", start: null });

  useEffect(() => {
    const fetchData = async () => {
      // get the data from the api
      const res = await axios.get("http://localhost:5000/myCalendar", {
        params: {
          name: name,
        },
      });
      // console.log(res.data);
      setCalendarData(res.data);
      setAllEvents(res.data);
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, [modalOpen, newEvent]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/myCalendar", {
  //       params: {
  //         name: name,
  //       },
  //     })
  //     .then((res) => {
  //       // console.log("All Events: " + res);
  //       // console.log(res);
  //       // console.log(res.data);
  //       setCalendarData(res.data);
  //       setAllEvents(res.data);
  //     })
  //     .catch((error) => {
  //       console.error("There was an error!", error);
  //     });

  //   // fetch("http://localhost:5000/myCalendar")
  //   //   .then((res) => res.json())
  //   //   .then((json) => {
  //   //     // array that has objects
  //   //     console.log(json);
  //   //     var myData = json.filter((el)=> {
  //   //       return el.madeBy==name;
  //   //     });
  //   //     // console.log(myData);
  //   //     setCalendarData(myData);
  //   //     setAllEvents(myData);
  //   //   });
  // }, [modalOpen, newEvent]);

  // function to add a new event
  const addNewEvent = (newEvent) => {
    // console.log(newEvent);
    // set event category default value if category is not selected
    if (!newEvent.category) {
      newEvent.category = "Goal";
    }
    // const formatted = moment(newEvent.start).toDate();
    // console.log(newEvent.start);
    var myObj = {
      // _id: Math.floor(Math.random() * 10000),
      madeBy: name,
      title: newEvent.title,
      startDate: newEvent.start,
      category: newEvent.category,
    };
    axios
      .post("http://localhost:5000/myCalendar/addNewEvent", myObj)
      .then((res) => {
        console.log("Event Added: " + res.data);
        // console.log(res);
        // console.log(res.data);
      });
    setNewEvent({ title: "", start: null });
    setModalOpen(false);
    // fetch('http://localhost:9000/myCalendar/addNewEvent', {
    //   method: 'POST', // or 'PUT'
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(myObj),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Success:', data);
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });
    // setAllEvents([...allEvents, newEvent]);
    // // console.log(allEvents);
    // setModalOpen(false);
  };

  // show that category that is selected on filter
  const handlefilter = (e) => {
    // console.log(e.target.value);
    setFilterOptionValue(e.target.value);
    if (e.target.value == "All") {
      setAllEvents(calendarData);
    } else if (e.target.value == "Goal") {
      // show only goals
      var goalEvents = calendarData?.map((myObj) => {
        if (myObj.category == "Goal") {
          return myObj;
        }
      });
      // console.log(goalEvents);
      setAllEvents(goalEvents);
    } else if (e.target.value == "Reminder") {
      // show only reminders
      var reminderEvents = calendarData.map((myObj) => {
        if (myObj.category == "Reminder") {
          return myObj;
        }
      });
      // console.log(goalEvents);
      setAllEvents(reminderEvents);
    }
  };

  // show modal when an event is selected
  const eventSelected = (e) => {
    setEvent(e);
    setEditModalOpen(true);
  };

  // function to update an event
  const updateEvent = (eventPassed) => {
    // console.log(typeof eventPassed.startDate);
    var myObj = {
      _id: eventPassed._id,
      madeBy: name,
      title: eventPassed.title,
      startDate: eventPassed.startDate,
      // endDate: eventPassed.endDate,
      category: eventPassed.category,
    };
    // console.log(myObj);
    axios
      .put("http://localhost:5000/myCalendar/updateEvent", myObj)
      .then((res) => {
        console.log("Updated" + res.data);
        // console.log(res);
        // console.log(res.data);
      });
    setNewEvent({ title: "", start: null });
    setEditModalOpen(false);
  };

  //Clicking an existing event allows you to remove it
  const deleteEvent = (event) => {
    const r = window.confirm("Would you like to remove this event?");
    if (r === true) {
      // console.log(event);
      axios
        .delete("http://localhost:5000/myCalendar/deleteEvent", {
          data: { _id: event._id },
        })
        .then(() => console.log("Deleted"));
    }
    setNewEvent({ title: "", start: null });
    setEditModalOpen(false);
  };

  return (
    <div className="calendar-container">
      {modalOpen && (
        <Modal
          setModalOpen={setModalOpen}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          addNewEvent={addNewEvent}
        />
      )}
      {editModalOpen && (
        <EditModal
          setEditModalOpen={setEditModalOpen}
          event={event}
          setEvent={setEvent}
          updateEvent={updateEvent}
          deleteEvent={deleteEvent}
        />
      )}
      {!modalOpen && !editModalOpen && (
        <div className="calendar">
          <div className="calendar-header">
            <div className="calendar-header-button">
              <button onClick={() => setModalOpen(true)}>
                <AddCircleOutlineRoundedIcon />
                <span>Add Events</span>
              </button>
            </div>
            <div className="calendar-header-h2">
              <h2>{name} Calendar</h2>
            </div>
            <div className="selectContainer">
              <label>Filter Calendar </label>
              <select
                id="framework"
                value={filterOptionValue}
                onChange={handlefilter}
              >
                <option value="All">All</option>
                <option value="Goal">Goal</option>
                <option value="Reminder">Reminder</option>
              </select>
            </div>
          </div>
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor="startDate"
            endAccessor="startDate"
            onSelectEvent={(event) => eventSelected(event)}
            // defaultView={'day'}
            views={["month", "agenda"]}
            // , "day", "work_week"
            style={{ height: "400px", margin: "0 50px 0 50px" }}
            eventPropGetter={(event) => {
              const backgroundColor =
                event.category == "Reminder" ? "#8248de" : "#9c64f5";
              return { style: { backgroundColor } };
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
