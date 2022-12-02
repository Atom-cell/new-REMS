import React from "react";
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";
import EventAvailableRoundedIcon from "@material-ui/icons/EventAvailableRounded";
import MenuIcon from "@material-ui/icons/Menu";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CalendarMonthIcon from "@material-ui/icons/TodayRounded";
import VideoCallRoundedIcon from "@material-ui/icons/VideoCallRounded";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import MailOutlineRoundedIcon from "@material-ui/icons/MailOutlineRounded";
import ArrowDropDownRoundedIcon from "@material-ui/icons/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@material-ui/icons/ArrowDropUpRounded";
import GroupIcon from "@material-ui/icons/Group";
import WorkIcon from "@mui/icons-material/Work";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import GroupsIcon from "@mui/icons-material/Groups";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { Trello, DollarSign } from "react-feather";
export const SideBarDataEmp = {
  links: [
    {
      id: 1,
      title: "Dashboard",
      path: "/dashboard",
      icon: <DashboardRoundedIcon />,
      cName: "nav-text",
    },
    {
      id: 3,
      title: "My Calendar",
      path: "/myCalendar",
      icon: <CalendarTodayIcon />,
      cName: "nav-text sub-nav",
    },
    // {
    //   id: 4,
    //   title: "My Team Calendar",
    //   path: "/myTeamCalendar",
    //   icon: <CalendarMonthIcon />,
    //   cName: "nav-text sub-nav",
    // },

    {
      id: 9,
      title: "My Messenger",
      path: "/myMessenger",
      icon: <EmailRoundedIcon />,
      cName: "nav-text sub-nav",
    },
    {
      id: 10,
      title: "Video Call",
      path: "/videoCall",
      icon: <VideoCallRoundedIcon />,
      cName: "nav-text sub-nav",
    },
    {
      id: 10,
      title: "Teams",
      path: "/team",
      icon: <GroupIcon />,
      cName: "nav-text sub-nav",
    },

    {
      id: 6,
      title: "All Meetings",
      path: "/allMeetings",
      icon: <GroupsIcon />,
      cName: "nav-text sub-nav",
    },
    {
      id: 14,
      title: "My Projects",
      path: "/projects",
      icon: <AssignmentTurnedInIcon />,
      cName: "nav-text",
    },
    {
      id: 15,
      title: "My Boards",
      path: "/allboards",
      icon: <Trello stroke="gray" />,
      cName: "nav-text",
    },
    {
      id: 16,
      title: "Payroll",
      path: "/allpayroll",
      icon: <DollarSign stroke="gray" />,
      cName: "nav-text",
    },
  ],
  activeLink: 1,
};
