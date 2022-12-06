import React from "react";
import Coach from "./Coach";
import TodayMeetings from "./TodayMeetings";
import TodayTasks from "./TodayTasks";

const EmpDashboard = () => {
  return (
    <div>
      <Coach />
      <TodayMeetings />
      <TodayTasks />
    </div>
  );
};

export default EmpDashboard;
