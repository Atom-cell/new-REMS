import React, { useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';
import { SideBarData } from './SideBarData';
import './navbar.css';

const Navbar = ()=> {
  const [sidebar, setSidebar] = useState(false);
  const [activeLink, setActiveLink] = useState();

  const showSidebar = () => setSidebar(!sidebar);
  const handleClick = (id)=> setActiveLink(id);
  return (
    <>
        <div className='navbar'>
          <Link to='#' className='menu-bars'>
            <MenuIcon onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <CloseIcon />
              </Link>
            </li>
            {SideBarData.links.map((item, index) => {
              return (
                <li key={index} className={item.cName + (item.id === activeLink ? " activeLink" : "")} onClick={() => handleClick(item.id)}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
    </>
  );
}

export default Navbar;