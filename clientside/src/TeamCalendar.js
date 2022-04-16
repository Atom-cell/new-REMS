import React, {useState} from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import Modal from './Modal'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const events =[
  // date fromat (year, month, date). month and date starts from 0
  {
    title: "JS Meeting",
    start: new Date(2022,3,4),
    end: new Date(2022,3,4),
    category:"Goal",
  },
  {
    title: "Progress Meeting",
    start: new Date(2022,3,8),
    end: new Date(2022,3,10),
    category:"Reminder",
  },
  {
    title: "Party",
    start: new Date(2022,3,15),
    end: new Date(2022,3,17),
    category:"Goal",
  },
]

const TeamCaelndar = ({name, project}) => {
  const [newEvent, setNewEvent] = useState({title: "", start: "", end: ""})
  const [allEvents, setAllEvents] = useState(events);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterOptionValue, setFilterOptionValue] = useState("All");

  // function to add a new event
  const addNewEvent = (newEvent)=>{
    // console.log(newEvent);
    setAllEvents([...allEvents, newEvent]);
    // console.log(allEvents);
    setNewEvent({title: "", start: "", end: ""})
    setModalOpen(false);
  }
  const handlefilter=(e)=>{
    // console.log(e.target.value);
    setFilterOptionValue(e.target.value);
    if(e.target.value=="All"){
      setAllEvents(events);
    }
    else if(e.target.value=="Goal"){
      // show only goals
      var goalEvents = events.map((myObj) => {
        if(myObj.category=="Goal"){
          return myObj;
        }
      });
      // console.log(goalEvents);
      setAllEvents(goalEvents);
    }
    else if(e.target.value=="Reminder"){
      // show only reminders
      var reminderEvents = events.map((myObj) => {
        if(myObj.category=="Reminder"){
          return myObj;
        }
      });
      // console.log(goalEvents);
      setAllEvents(reminderEvents);
    }
  }
  return (
    <div>
      <h1>{name} Team Calendar</h1>
      <h1>Working on Project {project}</h1>
      <div>
        <button
          className="openModalBtn"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Add Team Goals
        </button>

        {modalOpen && <Modal setOpenModal={setModalOpen} newEvent={newEvent} setNewEvent={setNewEvent} addNewEvent={addNewEvent} />}
      </div>
      <div className='selectContainer'>
        <label>Select Goals/Reminders</label>
        <select id="framework" value={filterOptionValue} onChange={handlefilter}>
            <option value="All">All</option>
            <option value="Goal">Goal</option>
            <option value="Reminder">Reminder</option>
        </select>
      </div>
      {!modalOpen && <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin:"50px" }}
      />
    }
  </div>
  )
}

export default TeamCaelndar