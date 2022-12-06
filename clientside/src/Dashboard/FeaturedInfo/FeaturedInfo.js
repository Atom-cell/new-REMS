import "./featuredinfo.css";
import TotalEmps from "./TotalEmps";
import TotalProj from "./TotalProj";
import TotalWorkTime from "./TotalWorkTime";
import TodayMeetings from "./TodayMeetings";
import { useNavigate } from "react-router-dom";

export default function FeaturedInfo() {
  const navigate = useNavigate();

  return (
    <>
      <div className="featured">
        <div className="featuredItem" onClick={() => navigate("/empManage")}>
          <span className="featuredTitle">Total Employees</span>
          <TotalEmps />
        </div>
        <div className="featuredItem" onClick={() => navigate("/projects")}>
          <span className="featuredTitle">Total Ongoing Projects</span>
          <TotalProj />
        </div>
        <div className="featuredItem" onClick={() => navigate("/projects")}>
          <span className="featuredTitle">Total Hours Worked Today</span>
          <TotalWorkTime />
        </div>
      </div>
      <TodayMeetings />
    </>
  );
}
