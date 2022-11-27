import * as React from "react";
import "./SidebarMenu.css";
import axios from "axios";
import { styled, useTheme } from "@mui/material/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { toast, ToastContainer } from "react-toastify";
import MailIcon from "@mui/icons-material/Mail";
////////////////////////

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { Dropdown } from "react-bootstrap";
import { ProjectNameContext } from "../Helper/Context";
import { SocketContext } from "../Helper/Context";
import { Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { SideBarData } from "./SideBarData";
import { SideBarDataEmp } from "./SideBarDataEmp";

import Timer from "../Projects/Timer";

const drawerWidth = 220;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);
const useStyles = makeStyles((theme) => ({
  root: {},
}));

const ListItem = withStyles({
  root: {
    // "&$selected": {
    //   backgroundColor: "#1a83ff",
    //   color: "black",
    //   "& .MuiListItemIcon-root": {
    //     color: "white",
    //   },
    // },

    "&:hover": {
      backgroundColor: "#1a83ff",
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white",
      },
    },
  },
  selected: {},
})(MuiListItem);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const NewToast = ({ msg, nav, link }) => {
  return (
    <div onClick={() => nav(link)}>
      <p>{msg}</p>
    </div>
  );
};
export default function SidebarMenu({ children }) {
  let navigate = useNavigate();
  const location = useLocation();

  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [notif, setNotif] = React.useState([]);
  const [notifNum, setNotifNum] = React.useState(0);
  const { sock, setSocket } = React.useContext(SocketContext);
  const [open1, setOpen1] = React.useState(false); //for subnav

  const handleClick = () => {
    setOpen1(!open1);
  };

  React.useEffect(() => {
    sock.on("TEST", (data) => {
      console.log(data);
      alert(data);
    });

    sock.on("TeamAdded", (data) => {
      console.log("TeamAdded");
      toast.info(<NewToast msg={data} nav={navigate} link="/team" />);

      //updateNotif(data, t);
    });

    sock.on("TeamDelete", (data) => {
      console.log("TeamDelete");
      toast.info(<NewToast msg={data} nav={navigate} link="/team" />);

      //updateNotif(data, t);
    });

    sock.on("MeetingSet", (data) => {
      console.log("Meeting set");
      toast.info(<NewToast msg={data} nav={navigate} link="/allMeetings" />);
    });

    sock.on("MeetingDelete", (data) => {
      console.log("Meeting Delete");
      toast.info(<NewToast msg={data} nav={navigate} link="/allMeetings" />);
    });

    sock.on("BoardShare", (data) => {
      console.log("Board Share");
      toast.info(<NewToast msg={data} nav={navigate} link="/allboards" />);
    });

    sock.on("BoardDelete", (data) => {
      console.log("Board Share");
      toast.info(<NewToast msg={data} nav={navigate} link="/allboards" />);
    });

    sock.on("ProjectShared", (data) => {
      console.log("Project shared");
      toast.info(<NewToast msg={data} nav={navigate} link="/projects" />);
    });
  }, [sock]);

  const updateNotif = (data, t) => {
    // console.log("before: ", notif);
    // let aa = [
    //   {
    //     msg: data,
    //     flag: "0",
    //     path: `/${t}`,
    //   },
    //   ...notif,
    // ];
    // console.log(aa);
    // setNotif([...aa]);
    // setNotifNum(notif.length);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  // for Notifucations when LOGS in
  React.useEffect(() => {
    let a = localStorage.getItem("role");
    setRole(a);
    let User = JSON.parse(localStorage.getItem("user"));
    setPic(User.profilePicture);
    let n = JSON.parse(localStorage.getItem("notif")) || "";
    let num = JSON.parse(localStorage.getItem("notifNum")) || 0;
    setNotif(n);
    setNotifNum(num);
    console.log("Notifications: ", n);
    console.log("SIDEBAR socket sokcet sokc: ", sock);
  }, []);

  const [role, setRole] = React.useState("");
  const [pic, setPic] = React.useState("");
  const { name, setName } = React.useContext(ProjectNameContext);

  const logout = () => {
    axios
      .put(
        "http://localhost:5000/emp/logout",
        {},
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then(function (response) {
        console.log(response.data);
      });

    localStorage.clear();
    window.location.href = "/home";
  };

  const go = (path) => {
    console.log("PATH, ", path);
    navigate(path);
  };
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const notificationsNum = () => {
    let id = localStorage.getItem("id");
    let role = localStorage.getItem("role");
    if (notifNum !== 0) {
      //TODO: send request to make flag=1
      console.log("ooooooooooooooooooooo");
      axios.put("/notif/markRead", {
        notif: notif,
        id: id,
        role: role,
      });
    }
    setNotifNum(0);
    localStorage.setItem("notifNum", 0);
  };
  const refreshNotifications = async () => {
    let id = localStorage.getItem("id");
    await axios.get(`/notif/getNotif/${id}`).then((resp) => {
      localStorage.setItem("notif", JSON.stringify([...resp.data, ...notif]));
      localStorage.setItem("notifNum", resp.data.length);
      setNotif([...resp.data, ...notif]);
      setNotifNum(resp.data.length);
    });
  };
  return (
    <Box sx={{ display: "flex" }}>
      <ToastContainer />
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#1890ff" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <button onClick={() => console.log(notif)}>ss</button>

            <h3
              onClick={handleDrawerOpen}
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1.8rem",
                color: "white",
                paddingLeft: " 1em",
                paddingTop: "0.4em",
              }}
            >
              REMS
            </h3>
          </div>

          <div className="timer_wrapper">
            {role !== "admin" && name !== null ? <Timer /> : null}
            <IconButton>
              <Badge badgeContent={4} color="error">
                <MailIcon style={{ fill: "white" }} />
              </Badge>
            </IconButton>

            <Dropdown>
              <Dropdown.Toggle style={{ all: "unset", cursor: "pointer" }}>
                <IconButton onClick={() => notificationsNum()}>
                  <Badge badgeContent={notifNum} color="error">
                    <NotificationsIcon style={{ fill: "white" }} />
                  </Badge>
                </IconButton>
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  maxHeight: "25em",
                  overflowY: "auto",
                }}
              >
                <Dropdown.Item
                  style={{ marginTop: "0.4em", marginBottom: "0.4em" }}
                >
                  <Button onClick={() => refreshNotifications()}>
                    Refresh
                  </Button>
                </Dropdown.Item>
                {notif?.map((n, i) => {
                  return (
                    <>
                      <Dropdown.Item
                        href={n.path}
                        key={i}
                        style={{ marginTop: "0.4em", marginBottom: "0.4em" }}
                      >
                        {n.msg}
                      </Dropdown.Item>
                      <Divider />
                    </>
                  );
                })}
                <Dropdown.Item
                  style={{ marginTop: "0.4em", marginBottom: "0.4em" }}
                >
                  <Button>Show More</Button>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* <IconButton style={{ marginLeft: "0.5em" }}></IconButton> */}
            <Dropdown>
              <Dropdown.Toggle
                style={{
                  all: "unset",
                  cursor: "pointer",
                  marginRight: "1em",
                  marginLeft: "2em",
                }}
                className="dp_toggle"
              >
                {pic === " " ? (
                  <Avatar sx={{ width: 50, height: 50 }}>H</Avatar>
                ) : (
                  <Avatar src={pic} sx={{ width: 50, height: 50 }} />
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>Profile</Dropdown.Item>
                <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <MenuIcon /> : null}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List></List>
        {role === "admin"
          ? SideBarData.links.map((item, key) => {
              return (
                <>
                  <ListItem
                    key={key}
                    onClick={(event) => handleListItemClick(event, key)}
                    disablePadding
                    sx={
                      selectedIndex === key
                        ? { backgroundColor: "#1a83ff", color: "white" }
                        : null
                    }
                  >
                    <ListItemButton
                      onClick={
                        item?.path
                          ? () => navigate(item?.path)
                          : () => handleClick()
                      }
                    >
                      <ListItemIcon
                        sx={selectedIndex === key ? { color: "white" } : null}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {item.subNav ? (
                        <>
                          <ListItemText primary={item.title} />
                          {open1 ? (
                            <IconButton onClick={handleClick}>
                              <ExpandLess />
                            </IconButton>
                          ) : (
                            <IconButton onClick={handleClick}>
                              <ExpandMore />
                            </IconButton>
                          )}
                        </>
                      ) : (
                        <ListItemText primary={item.title} />
                      )}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={open1} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subNav?.map((s, i) => {
                        return (
                          <ListItem
                            key={i}
                            onClick={(event) => handleListItemClick(event, key)}
                            disablePadding
                          >
                            <ListItemButton
                              sx={{ pl: 4 }}
                              onClick={() => navigate(s.path)}
                            >
                              <ListItemIcon>{s.icon}</ListItemIcon>
                              <ListItemText primary={s.title} />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                </>
              );
            })
          : SideBarDataEmp.links.map((item, key) => {
              return (
                <ListItem
                  key={key}
                  //selected={}
                  onClick={(event) => handleListItemClick(event, key)}
                  disablePadding
                  sx={
                    selectedIndex === key
                      ? { backgroundColor: "#1a83ff", color: "white" }
                      : null
                  }
                >
                  <ListItemButton onClick={() => navigate(item.path)}>
                    <ListItemIcon
                      sx={selectedIndex === key ? { color: "white" } : null}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </ListItem>
              );
            })}
      </Drawer>
      <Main open={open}>{children}</Main>
    </Box>
  );
}
