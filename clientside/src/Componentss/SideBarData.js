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
import { Trello, DollarSign } from "react-feather";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AppsIcon from "@mui/icons-material/Apps";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
export const SideBarData = {
  links: [
    {
      id: 1,
      title: "Dashboard",
      path: "/dashboard",
      icon: <DashboardRoundedIcon />,
      cName: "nav-text",
    },

    {
      id: 11,
      title: "Activity Log",
      path: "/log",
      icon: <WorkIcon />,
      cName: "nav-text",
    },
    {
      id: 12,
      title: "Manage Employee",
      path: "/empManage",
      icon: <EngineeringIcon />,
      cName: "nav-text",
    },

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
    {
      id: 17,
      title: "Invoice",
      path: "/allinvoice",
      icon: (
        <i
          class="fa-solid fa-money-check-dollar"
          style={{
            color: "gray",
            fontSize: "1.5rem",
            width: "1.3em",
            height: "1em",
            display: "inline-block",
          }}
        ></i>
      ),
    },
    {
      id: 3,
      title: "My Calendar",
      path: "/myCalendar",
      icon: <CalendarTodayIcon />,
      cName: "nav-text sub-nav",
    },
    {
      id: 13,
      title: "Reports",
      // path: "/reports/inOut",
      icon: <AnalyticsIcon />,
      cName: "nav-text",
      subNav: [
        {
          title: "Clock-In / Clock-Out",
          path: "/reports/inOut",
          icon: <AccessTimeIcon />,
        },
        {
          title: "Projects",
          path: "/reports/projects",
          icon: <TaskAltIcon />,
        },
        {
          title: "Apps & Sites",
          path: "/reports/appssites",
          icon: <AppsIcon />,
        },
        {
          title: "Active & Idle Time",
          path: "/reports/activeidle",
          icon: <HourglassBottomIcon />,
        },
        {
          title: "Productivity",
          path: "/reports/productivity",
          icon: <WorkIcon />,
        },
      ],
    },
    // {
    //   id: 16,
    //   title: "Financials",
    //   icon: <DollarSign stroke="gray" />,
    //   cName: "nav-text",
    //   iconClosed: <ArrowDropDownRoundedIcon />,
    //   iconOpened: <ArrowDropUpRoundedIcon />,
    //   path: "/allpayroll",
    //   subNav: [
    //     {
    //       id: 17,
    //       title: "Payroll",
    //       path: "/allpayroll",
    //       icon: (
    //         <i
    //           class="fa-solid fa-money-check-dollar"
    //           style={{
    //             color: "gray",
    //             fontSize: "1.5rem",
    //             width: "1.3em",
    //             height: "1em",
    //             display: "inline-block",
    //           }}
    //         ></i>
    //       ),
    //       cName: "nav-text",
    //     },
    //     {
    //       id: 18,
    //       title: "Invoices",
    //       path: "/allinvoice",
    //       icon: (
    //         <i
    //           class="fa-solid fa-file-invoice-dollar"
    //           style={{
    //             color: "gray",
    //             fontSize: "1.5rem",
    //             width: "1em",
    //             height: "1em",
    //             display: "inline-block",
    //           }}
    //         ></i>
    //       ),
    //       cName: "nav-text",
    //     },
    //   ],
    // },
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
