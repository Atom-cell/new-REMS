import apps from "../img/app-web.png";
import time from "../img/timetrack.png";
import proj from "../img/projectmanage.png";
import bill from "../img/billing.png";
import report from "../img/report.png";
import user from "../img/usermanage.png";
import dashboard from "../img/dashboard.png";
import calendar from "../img/calender.PNG";
let features = [
  {
    id: "user",
    title: "Manage all your employees easily",
    description:
      "A clear and accessible menu which shows all the necessary details you need to manage all your employees. Add them, Delete them, look up their activity which just one click of a button",
    img: user,
  },
  {
    id: "activity",
    title: "Monitor the apps your employees uses, in realtime",
    description:
      "Working hard or browsing social media? Always know how your employees use their time. Track app and website usage, and overall productivity.",
    img: apps,
  },
  {
    id: "dashboard",
    title: "A comprehensive Dashboard to give you an overview.",
    description:
      "A very comprehensive and detailed dashboard which gives you a birds eye view of your on going projects, employed employees, your sales and activities of your employees.",
    img: dashboard,
  },
  {
    id: "project",
    title: "Manage and assign work",
    description:
      "Keep an eye on all the projects underway. Create projects, Manage projects, Assign projects in Project Management",
    img: proj,
  },
  {
    id: "time",
    title: "Keep track of the time used to do the work.",
    description:
      "Want to pay according to the time used to the work? Want to pay fairly? Time Tracking will help you do so.",
    img: time,
  },
  {
    id: "calendar",
    title: "Achieve all your goals and never miss out any meetups and events",
    description:
      "Never miss a goal or reminder. Add your events, goals and reminders all in one place in your calendar. Filter them whatever you want to see and be your most productive self.",
    img: calendar,
  },
  {
    id: "report",
    title:
      "Create comprehensive reports of all your employees, so you don't miss out any activity.",
    description:
      "From activities of your employees, never miss anything. Create comprehensive reports showing who achieved what, who did most of the work and who was slacking off and being lazy.",
    img: report,
  },
  {
    id: "billing",
    title: "Pay your employees directly ",
    description:
      "After getting your projects completed, it's time to pay your employees fairly and justly. Pay whatever they deserve according to thier work and activities while completing tasks.",
    img: bill,
  },
];

export default features;
