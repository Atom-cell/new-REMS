import React from "react";
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";
import EventAvailableRoundedIcon from '@material-ui/icons/EventAvailableRounded';
import MenuIcon from "@material-ui/icons/Menu";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import CalendarMonthIcon from "@material-ui/icons/TodayRounded";
import VideoCallRoundedIcon from "@material-ui/icons/VideoCallRounded";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import MeetingRoomRoundedIcon from "@material-ui/icons/MeetingRoomRounded";
import ArrowDropDownRoundedIcon from "@material-ui/icons/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@material-ui/icons/ArrowDropUpRounded";
import GroupIcon from "@material-ui/icons/Group";
export const SideBarData = {
  links: [
    {
      id: 1,
      title: "Dashboard",
      path: "/",
      icon: <DashboardRoundedIcon />,
      cName: "nav-text",
    },
    {
      id: 2,
      title: "Calendar",
      cName: "nav-text",
      icon: <EventAvailableRoundedIcon />,
      iconClosed: <ArrowDropDownRoundedIcon />,
      iconOpened: <ArrowDropUpRoundedIcon />,
      path: "#",
      subNav: [
        {
          id: 3,
          title: "My Calendar",
          path: "/myCalendar",
          icon: <CalendarTodayIcon />,
          cName: "sub-nav-text",
        },
        {
          id: 4,
          title: "My Team Calendar",
          path: "/myTeamCalendar",
          icon: <CalendarMonthIcon />,
          cName: "sub-nav-text",
        },
      ],
    },
    {
      id: 5,
      title: "Meetings",
      cName: "nav-text",
      icon: <MeetingRoomRoundedIcon />,
      iconClosed: <ArrowDropDownRoundedIcon />,
      iconOpened: <ArrowDropUpRoundedIcon />,
      path: "#",
      subNav: [
        {
          id: 6,
          title: "All Meetings",
          path: "/allMeetings",
          icon: <GroupIcon />,
          cName: "nav-text",
        },
        {
          id: 7,
          title: "Set Meeting",
          path: "/setMeeting",
          icon: <MeetingRoomRoundedIcon />,
          cName: "nav-text",
        },
      ],
    },
    {
      id: 8,
      title: "Collaboration",
      cName: "nav-text",
      icon: <MailOutlineRoundedIcon />,
      iconClosed: <ArrowDropDownRoundedIcon />,
      iconOpened: <ArrowDropUpRoundedIcon />,
      path: "#",
      subNav: [
        {
          id: 9,
          title: "My Messenger",
          path: "/myMessenger",
          icon: <EmailRoundedIcon />,
          cName: "nav-text",
        },
        {
          id: 10,
          title: "Video Call",
          path: "/videoCall",
          icon: <VideoCallRoundedIcon />,
          cName: "nav-text",
        },
      ],
    },
  ],
  activeLink: null,
};
