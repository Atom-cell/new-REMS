import React, {useState, useEffect} from "react";
import './App.css';
import MyCalendar from './Calendar/MyCalendar';
import TeamCalendar from "./TeamCalendarNotUsed";
import VideoCall from "./Meetings/VideoCall";
import {Link} from "react-router-dom";
import "./App.css";
function HomeScreen() {
  return (
    <div className="buttonContainer">
      <h1>Dashboard</h1>
      {/* <Link to="/myCalendar" className="button">My Calendar</Link>
      <Link to="/myTeamCalendar" className="button">My Team Calendar</Link>
      <Link to="/videoCall" className="button">Video Call</Link>
      <Link to="/setMeeting" className="button">Set Meeting</Link>
      <Link to="/allMeetings" className="button">All Meetings</Link>
      <Link to="/myMessenger" className="button">My Messenger</Link> */}
    </div>
  );
}

export default HomeScreen;
