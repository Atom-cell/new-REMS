import React, { useState } from "react";
import { Link } from "react-router-dom";

const SubNavBar = ({ item, showSidebar }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <div onClick={item.subNav && showSubnav} className={item.cName}>
        <Link to={item.path} onClick={!item.subNav && showSidebar}>
          {item.icon}
          <span>{item.title}</span>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </Link>
      </div>
      {subnav &&
        item.subNav.map((item, index) => {
          return (
            <div className={item.cName}>
              {/* I want to refresh whenever video call componenet is called that is why i used Nav.link */}
              {/* <Nav.Link href={item.path} onClick={showSidebar}>
                  {item.icon}
                  <span>{item.title}</span>
                </Nav.Link> */}
              <Link
                to={item.path}
                key={index}
                className="sub-nav"
                onClick={showSidebar}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </div>
          );
        })}
    </>
  );
};

export default SubNavBar;
