import React, { useState } from "react";
import VideoCall from "./VideoCall";
import MyCalendar from "./MyCalendar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomeScreen from "./HomeScreen";
import SetMeeting from "./SetMeeting";
import ConferenceCall from "./ConferenceCall";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomeScreen />} />
        <Route path="/myCalendar" element={<MyCalendar name="Naseer" />} />
        <Route path="/myTeamCalendar" element={<MyCalendar name="Nasani" />} />
        <Route path="/videoCall" element={<VideoCall />} />
        <Route path="/setMeeting/:roomId" element={<ConferenceCall />} />
        <Route exact path="/setMeeting" element={<SetMeeting />} />
      </Routes>
    </Router>
  );
};

export default App;
