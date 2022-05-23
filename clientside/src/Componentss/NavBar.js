import React, { useState } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";
import { SideBarData } from "./SideBarData";
import "./navbar.css";
import SubNavBar from "./SubNavBar";

const Navbar = () => {
  const [sidebar, setSidebar] = useState(false);

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
          {SideBarData.links.map((item, index) => {
              return <SubNavBar item={item} key={index} showSidebar={showSidebar} />;
          })}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;

{/* {SideBarData.links.map((item, index) => {
            return (
              <>
                {item.subNav ? (
                  <li
                    key={index}
                    className={
                      item.cName + (item.id === activeLink ? " activeLink" : "")
                    }
                    onClick={() => setActiveLinkFunction(item.id)}
                  >
                    <Link to="#" onClick={showSidebar}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                    <ul className="nav-menu-items" onClick={showSubNav}>
                      <li>
                        <Link to="#">
                          {subNav ? item.iconOpened : item.iconClosed}
                        </Link>
                      </li>
                      <li className="sub-nav">
                        {subNav && item.subNav.map((subItem, subIndex) => {
                          return (
                            <Link to={subItem.path} onClick={showSidebar}>
                              {subItem.icon}
                              <span>{subItem.title}</span>
                            </Link>
                          );
                        })}
                      </li>
                    </ul>
                  </li>
                ) : (
                  // <>
                  //   <div
                  //     className={
                  //       item.cName +
                  //       (item.id === activeLink ? " activeLink" : "")
                  //     }
                  //   >
                  //     <span>{item.title}</span>
                  //     <button onClick={showSubNav}>
                  //       {subNav ? item.iconOpened : item.iconClosed}
                  //     </button>
                  //     <div className="sub-nav">
                  // {subNav &&
                  //   item.subNav.map((subItem, subIndex) => {
                  //     return (
                  //       <Link to={subItem.path} onClick={showSidebar}>
                  //         {subItem.icon}
                  //         <span>{subItem.title}</span>
                  //       </Link>
                  //     );
                  //   })}
                  //     </div>
                  //   </div>
                  // </>
                  <li
                    key={index}
                    className={
                      item.cName + (item.id === activeLink ? " activeLink" : "")
                    }
                    onClick={() => setActiveLinkFunction(item.id)}
                  >
                    <Link to={item.path} onClick={showSidebar}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )}
              </>
            );
          })} */}
