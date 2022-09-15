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
        <h3
          style={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            color: "white",
            paddingLeft: " 1em",
            paddingTop: "0.2em",
          }}
        >
          REMS
        </h3>

        {/* <Button className="signbtn" type="button" onClick={() => logout()}>
          (profile menu) logout
        </Button> */}
        <div className="timer_wrapper">
          {role !== "admin" ? <Timer /> : null}
          {/* <Button className="signbtn" type="button" onClick={() => logout()}>
            Logout
          </Button> */}
        </div>
        <Dropdown>
          <Dropdown.Toggle
            style={{ all: "unset", cursor: "pointer", marginRight: "1em" }}
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
      <div className="nav">
        <ul className="ul">
          {role === "admin"
            ? SideBarData.links.map((item, key) => {
                if (
                  item.title === "Projects" ||
                  item.title === "Activity Log" ||
                  item.title === "Manange Employee" ||
                  item.title === "Dashboard"
                ) {
                  return (
                    <li
                      className="item"
                      key={key}
                      id={location.pathname === item.path ? "active" : ""}
                      // onClick={() => navigate(item.path)}
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
                              <span style={{ paddingRight: "0.2em" }}></span>
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
                              <span style={{ paddingRight: "0.2em" }}></span>
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
                  item.title === "Manange Employee"
                ) {
                  return null;
                } else {
                  return (
                    <li
                      className="item"
                      key={key}
                      id={location.pathname === item.path ? "active" : ""}
                      // onClick={() => navigate(item.path)}
                    >
                      <div style={{ display: "flex" }}>
                        {/* {item.icon}
                        <span style={{ paddingRight: "0.2em" }}></span>
                        {item.title} */}
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
                              <span style={{ paddingRight: "0.2em" }}></span>
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
                              <span style={{ paddingRight: "0.2em" }}></span>
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
      </div>
    </>
  );
};

export default Navbar;
