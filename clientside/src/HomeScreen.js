import React, {useState, useEffect} from "react";
import './App.css';
import MyCalendar from './MyCalendar';
import TeamCalendar from "./TeamCalendar";
import VideoCall from "./VideoCall";
import {Link} from "react-router-dom";
import "./App.css";
function HomeScreen() {
  return (
    <div className="buttonContainer">
      <Link to="/myCalendar" className="button">My Calendar</Link>
      <Link to="/myTeamCalendar" className="button">My Team Calendar</Link>
      <Link to="/videoCall" className="button">Video Call</Link>
      <Link to="/setMeeting" className="button">Set Meeting</Link>
    </div>
  );
}

export default HomeScreen;
