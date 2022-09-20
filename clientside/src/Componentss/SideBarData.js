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
import { Trello } from "react-feather";
export const SideBarData = {
  links: [
    {
      id: 1,
      title: "Dashboard",
      path: "/dashboard",
      icon: <DashboardRoundedIcon style={{ fill: "grey" }} />,
      cName: "nav-text",
    },
    {
      id: 2,
      title: "Calendar",
      cName: "nav-text",
      icon: <EventAvailableRoundedIcon style={{ fill: "grey" }} />,
      iconClosed: <ArrowDropDownRoundedIcon style={{ fill: "grey" }} />,
      iconOpened: <ArrowDropUpRoundedIcon style={{ fill: "grey" }} />,
      path: "/myCalendar",
      subNav: [
        {
          id: 3,
          title: "My Calendar",
          path: "/myCalendar",
          icon: <CalendarTodayIcon style={{ fill: "grey" }} />,
          cName: "nav-text sub-nav",
        },
        {
          id: 4,
          title: "My Team Calendar",
          path: "/myTeamCalendar",
          icon: <CalendarMonthIcon style={{ fill: "grey" }} />,
          cName: "nav-text sub-nav",
        },
      ],
    },
    // {
    //   id: 5,
    //   title: "Meetings",
    //   cName: "nav-text",
    //   icon: <MeetingRoomRoundedIcon style={{ fill: "grey" }} />,
    //   iconClosed: <ArrowDropDownRoundedIcon style={{ fill: "grey" }} />,
    //   iconOpened: <ArrowDropUpRoundedIcon style={{ fill: "grey" }} />,
    //   path: "#",
    //   subNav: [
    //     {
    //       id: 6,
    //       title: "All Meetings",
    //       path: "/allMeetings",
    //       icon: <GroupIcon style={{ fill: "grey" }} />,
    //       cName: "nav-text sub-nav",
    //     },
    //     {
    //       id: 7,
    //       title: "Set Meeting",
    //       path: "/setMeeting",
    //       icon: <MeetingRoomRoundedIcon style={{ fill: "grey" }} />,
    //       cName: "nav-text sub-nav",
    //     },
    //   ],
    // },
    {
      id: 8,
      title: "Collaboration",
      cName: "nav-text",
      icon: <MailOutlineRoundedIcon style={{ fill: "grey" }} />,
      iconClosed: <ArrowDropDownRoundedIcon />,
      iconOpened: <ArrowDropUpRoundedIcon />,
      path: "/myMessenger",
      subNav: [
        {
          id: 9,
          title: "My Messenger",
          path: "/myMessenger",
          icon: <EmailRoundedIcon style={{ fill: "grey" }} />,
          cName: "nav-text sub-nav",
        },
        {
          id: 10,
          title: "Video Call",
          path: "/videoCall",
          icon: <VideoCallRoundedIcon style={{ fill: "grey" }} />,
          cName: "nav-text sub-nav",
        },
      ],
    },
    {
      id: 6,
      title: "All Meetings",
      path: "/allMeetings",
      icon: <GroupIcon style={{ fill: "grey" }} />,
      cName: "nav-text sub-nav",
    },
    {
      id: 11,
      title: "Activity Log",
      path: "/log",
      icon: <WorkIcon style={{ fill: "grey" }} />,
      cName: "nav-text",
    },
    {
      id: 12,
      title: "Manange Employee",
      path: "/empManage",
      icon: <EngineeringIcon style={{ fill: "grey" }} />,
      cName: "nav-text",
    },
    {
      id: 13,
      title: "Projects",
      icon: <AssignmentIcon style={{ fill: "grey" }} />,
      cName: "nav-text",
      iconClosed: <ArrowDropDownRoundedIcon />,
      iconOpened: <ArrowDropUpRoundedIcon />,
      path: "/projects",
      subNav: [
        {
          id: 14,
          title: "My Projects",
          path: "/projects",
          icon: <AssignmentTurnedInIcon style={{ fill: "grey" }} />,
          cName: "nav-text",
        },
        {
          id: 15,
          title: "My Boards",
          path: "/allboards",
          icon: <Trello stroke="gray" />,
          cName: "nav-text",
        },
      ],
    },
    // {
    //   id: 13,
    //   title: "Projects",
    //   path: "/projects",
    //   icon: <AssignmentIcon style={{ fill: "grey" }} />,
    //   cName: "nav-text",
    // },
    // {
    //   id: 14,
    //   title: "All Boards",
    //   path: "/allboards",
    //   icon: <EngineeringIcon />,
    //   cName: "nav-text",
    // },
  ],
  activeLink: 1,
};
