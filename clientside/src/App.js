import React, { useState } from "react";
import VideoCall from "./Meetings/VideoCall";
import MyCalendar from "./Calendar/MyCalendar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import SetMeeting from "./Meetings/SetMeeting";
import ConferenceCall from "./Meetings/ConferenceCall";
import Messenger from "./Chat/Messenger";
import AllMeetings from "./Meetings/AllMeetings";
import NavBar from "./Components/NavBar";
const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/myCalendar" element={<MyCalendar name="Naseer" />} />
        <Route path="/myTeamCalendar" element={<MyCalendar name="Nasani" />} />
        <Route path="/videoCall" element={<VideoCall />} />
        <Route path="/allMeetings/:roomId" element={<ConferenceCall />} />
        <Route exact path="/setMeeting" element={<SetMeeting />} />
        <Route path="/myMessenger" element={<Messenger />} />
        <Route path="/allMeetings" element={<AllMeetings />} />
      </Routes>
    </Router>
  );
};

export default App;
