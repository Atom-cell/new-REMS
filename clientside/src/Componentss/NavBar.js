import React, { useState } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";
import { SideBarData } from "./SideBarData";
import "./navbar.css";
import SubNavBar from "./SubNavBar";
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { Dropdown } from "react-bootstrap";
import { ProjectNameContext } from "../Helper/Context";
import { Badge, IconButton } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";

import Timer from "../Projects/Timer";

const Navbar = () => {
  let navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    let a = localStorage.getItem("role");
    setRole(a);
    let User = JSON.parse(localStorage.getItem("user"));
    setPic(User.profilePicture);
    console.log("User: ", pic);
  }, []);

  const [role, setRole] = useState("");
  const [pic, setPic] = useState("");
  const { name, setName } = React.useContext(ProjectNameContext);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/home";
  };

  const go = (path) => {
    console.log("PATH, ", path);
    navigate(path);
  };
  return (
    <>
      <div className="navbar">
        <h3>REMS</h3>

        {/* <Button className="signbtn" type="button" onClick={() => logout()}>
          (profile menu) logout
        </Button> */}
      </div>
      {/* here */}
      {/* <div className="nav">
        <ul className="ul">
          {role === "admin"
            ? SideBarData.links.map((item, key) => {
                if (
                  item.title === "Projects" ||
                  item.title === "Activity Log" ||
                  item.title === "Manage Employee" ||
                  item.title === "Dashboard" ||
                  item.title === "Reports" ||
                  item.title === "All Meetings" ||
                  item.title === "Collaboration" ||
                  item.title === "Financials"
                ) {
                  return (
                    <li
                      className="item"
                      key={key}
                      id={location.pathname === item.path ? "active" : null}
                    >
                      <div style={{ display: "flex" }}>
                        {item.subNav ? (
                          <Dropdown>
                            <Dropdown.Toggle
                              style={{
                                all: "unset",
                                cursor: "pointer",
                                marginLeft: "0.5em",
                                color: "grey",
                              }}
                            >
                              {item.icon}

                              {item.title}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              {item.subNav.map((item, index) => {
                                return (
                                  <Dropdown.Item
                                    onClick={() => navigate(item.path)}
                                  >
                                    <span>{item.icon}</span>
                                    {item.title}
                                  </Dropdown.Item>
                                );
                              })}
                            </Dropdown.Menu>
                          </Dropdown>
                        ) : (
                          <>
                            <span
                              onClick={() => navigate(item.path)}
                              style={{ color: "grey" }}
                            >
                              {item.icon}
                              {item.title}
                            </span>
                          </>
                        )}
                      </div>
                    </li>
                  );
                }
              })
            : SideBarData.links.map((item, key) => {
                if (
                  item.title === "Activity Log" ||
                  item.title === "Manage Employee" ||
                  item.title === "Dashboard"
                ) {
                  return null;
                } else {
                  return (
                    <li
                      className="item"
                      key={key}
                      id={location.pathname === item.path ? "active" : ""}
                    >
                      <div style={{ display: "flex" }}>
                        {item.subNav ? (
                          <Dropdown>
                            <Dropdown.Toggle
                              style={{
                                all: "unset",
                                cursor: "pointer",
                                marginLeft: "0.5em",
                                color: "grey",
                              }}
                            >
                              {item.icon}
                              <span
                                id={
                                  location.pathname === item.path
                                    ? "active"
                                    : ""
                                }
                              ></span>
                              {item.title}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              {item.subNav.map((item, index) => {
                                return (
                                  <Dropdown.Item
                                    onClick={() => navigate(item.path)}
                                  >
                                    <span>{item.icon}</span>
                                    {item.title}
                                  </Dropdown.Item>
                                );
                              })}
                            </Dropdown.Menu>
                          </Dropdown>
                        ) : (
                          <>
                            <span
                              onClick={() => navigate(item.path)}
                              style={{ color: "grey" }}
                            >
                              {item.icon}

                              {item.title}
                            </span>
                          </>
                        )}
                      </div>
                    </li>
                  );
                }
              })}
        </ul>
      </div> */}
      {/* there */}
    </>
  );
};

export default Navbar;
