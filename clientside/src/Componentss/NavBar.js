import React, { useState } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";
import { SideBarData } from "./SideBarData";
import "./navbar.css";
import SubNavBar from "./SubNavBar";

const Navbar = () => {
  React.useEffect(() => {
    let a = localStorage.getItem("role");
    setRole(a);
  }, []);

  const [sidebar, setSidebar] = useState(false);
  const [role, setRole] = useState("");
  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div className="navbar">
        <Link to="#" className="menu-bars">
          <MenuIcon onClick={showSidebar} />
        </Link>
      </div>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items">
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <CloseIcon onClick={showSidebar} />
            </Link>
          </li>
          {role === "admin"
            ? SideBarData.links.map((item, index) => {
                if (
                  item.title === "Activity Log" ||
                  item.title === "Manange Employee" ||
                  item.title === "Dashboard"
                ) {
                  return (
                    <SubNavBar
                      item={item}
                      key={index}
                      showSidebar={showSidebar}
                    />
                  );
                }
              })
            : SideBarData.links.map((item, index) => {
                if (
                  item.title === "Activity Log" ||
                  item.title === "Manange Employee"
                ) {
                  return null;
                } else {
                  return (
                    <SubNavBar
                      item={item}
                      key={index}
                      showSidebar={showSidebar}
                    />
                  );
                }
              })}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
