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
    </div>
  );
}

export default HomeScreen;
