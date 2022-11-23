import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import { confirmAlert } from "react-confirm-alert";
import AddEventModal from "./AddEventModal";
import axios from "axios";
import EditModal from "./EditModal";
import "./mycalendar.css";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import MoreEvents from "./MoreEvents";
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

const TeamCalendar = ({ user, teamId }) => {
  const [allEvents, setAllEvents] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [filterOptionValue, setFilterOptionValue] = useState("All");
  const [event, setEvent] = useState(); // handle modal events
  const [calendarData, setCalendarData] = useState(null); // handling filter
  const [newEvent, setNewEvent] = useState({ title: "", start: null });

  const [moreEvents, setMoreEvents] = useState();
  const [showMoreEvents, setShowMoreEvents] = useState(false);

  const handleCloseMoreEvents = () => setShowMoreEvents(false);
  const handleShowMoreEvents = () => setShowMoreEvents(true);

  const handleClose = () => setModalOpen(false);
  const handleShow = () => setModalOpen(true);

  const handleClosee = () => setEditModalOpen(false);
  const handleShoww = () => setEditModalOpen(true);

  useEffect(() => {
    axios
      .get("/myTeamCalendar/", { params: { teamId: teamId } })
      .then((res) => {
        console.log(res.data);
        setCalendarData(res.data);
        setAllEvents(res.data);
      })
      .catch((err) => console.log(err));
  }, [newEvent]);

  // function to add a new event
  const addNewEvent = (newEvent) => {
    console.log(newEvent);
    // set event category default value if category is not selected
    if (newEvent.title && newEvent.start && newEvent.category) {
      // const formatted = moment(newEvent.start).toDate();
      // console.log(newEvent.start);
      var myObj = {
        // _id: Math.floor(Math.random() * 10000),
        madeBy: user._id,
        title: newEvent.title,
        startDate: newEvent.start,
        category: newEvent.category,
        teamId: teamId,
      };
      axios
        .post("http://localhost:5000/myTeamCalendar/addNewEvent", myObj)
        .then((res) => {
          // console.log("Event Added: " + res.data);
          toast.success(`${res.data.title} Added`);
        });
      setNewEvent({ title: "", start: null });
      setModalOpen(false);
    } else {
      alert("Please fill all required fields");
    }
  };

  // show that category that is selected on filter
  const handlefilter = (e) => {
    // console.log(e.target.value);
    setFilterOptionValue(e.target.value);
    if (e.target.value === "All") {
      setAllEvents(calendarData);
    } else if (e.target.value === "Goal") {
      // show only goals
      var goalEvents = calendarData?.map((myObj) => {
        if (myObj.category === "Goal") {
          return myObj;
        }
      });
      // console.log(goalEvents);
      setAllEvents(goalEvents);
    } else if (e.target.value === "Reminder") {
      // show only reminders
      var reminderEvents = calendarData.map((myObj) => {
        if (myObj.category === "Reminder") {
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
    //if an event is made by the logged in user then can edit otherwise cannot
    if (eventPassed.madeBy === JSON.parse(localStorage.getItem("user"))._id) {
      var myObj = {
        _id: eventPassed._id,
        madeBy: user._id,
        title: eventPassed.title,
        startDate: eventPassed.startDate,
        // endDate: eventPassed.endDate,
        category: eventPassed.category,
      };
      // console.log(myObj);
      axios
        .put("http://localhost:5000/myTeamCalendar/updateEvent", myObj)
        .then((res) => {
          console.log("Updated" + res.data);
          toast.success(`${res.data.title} Updated`);
          // console.log(res);
          // console.log(res.data);
        });
    } else {
      toast.error(`You don't have Updation Rights`);
    }
    setNewEvent({ title: "", start: null });
    setEditModalOpen(false);
  };

  //Clicking an existing event allows you to remove it
  const deleteEvent = (event) => {
    setEditModalOpen(false);
    if (event.madeBy === JSON.parse(localStorage.getItem("user"))._id) {
      confirmAlert({
        title: "Confirm to Delete",
        message: "Are you sure you want to delete the event?",
        buttons: [
          {
            label: "Yes",
            onClick: () => {
              axios
                .delete("http://localhost:5000/myTeamCalendar/deleteEvent", {
                  data: { _id: event._id },
                })
                .then((res) => {
                  toast.success(`${res.data.title} Deleted`);
                  setNewEvent({ title: "", start: null });
                })
                .catch((err) => console.log(err));
            },
          },
          {
            label: "No",
            onClick: () => {
              setEditModalOpen(true);
            },
          },
        ],
      });
    } else {
      toast.error(`You don't have Deletion Rights`);
    }
  };

  return (
    <div className="calendar-container">
      {modalOpen && (
        <AddEventModal
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          addNewEvent={addNewEvent}
          modalOpen={modalOpen}
          handleClose={handleClose}
        />
      )}
      {editModalOpen && (
        <EditModal
          event={event}
          setEvent={setEvent}
          updateEvent={updateEvent}
          deleteEvent={deleteEvent}
          editModalOpen={editModalOpen}
          handleClosee={handleClosee}
        />
      )}
      {/* {!modalOpen && !editModalOpen && ( */}
      <div className="calendar-container">
        {/* <div className="calendar-header">
          <div className="calendar-header-h2">
            <h2>{user?.username} Calendar</h2>
          </div>
          <div className="selectContainer">
            <button onClick={handleShow}>Add Events</button>
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
        </div> */}
        <div className="selectContainer">
          <Button type="submit" variant="contained" onClick={handleShow}>
            Add Events
          </Button>
          {/* <button onClick={handleShow}>Add Events</button> */}
          <div className="select-div">
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
        <div className="calendar">
          <Calendar
            localizer={localizer}
            events={allEvents}
            startAccessor="startDate"
            endAccessor="startDate"
            onSelectEvent={(event) => eventSelected(event)}
            onShowMore={(me) => {
              setMoreEvents(me);
              handleShowMoreEvents();
            }}
            // defaultView={'day'}
            views={["month", "agenda"]}
            // , "day", "work_week"
            style={{ height: "75vh", margin: "0 20px 0 20px" }}
            eventPropGetter={(event) => {
              const backgroundColor =
                event.category == "Reminder" ? "#1890ff" : "#74caff";
              return { style: { backgroundColor } };
            }}
          />
          {showMoreEvents && (
            <MoreEvents
              show={showMoreEvents}
              handleClose={handleCloseMoreEvents}
              moreEvents={moreEvents}
              eventSelected={eventSelected}
            />
          )}
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default TeamCalendar;
