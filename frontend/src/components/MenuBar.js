import React from 'react';

import { Sidebar, Menu, MenuItem, sidebarClasses} from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import {FaRunning, FaPencilAlt, FaBookMedical, FaBookReader, FaUniversity, FaGlobeAmericas, FaGlobeAsia, FaEye, FaArrowLeft} from 'react-icons/fa';

class MenuBar extends React.Component {
  render() {
    const handleLinkClick = event => {
      window.localStorage.setItem('Authenticated', 'False');
    };

    return (
        <Sidebar   rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: '#347C3F',
            color: 'white',
            
          },
        }}>
          <Menu>
            <MenuItem icon={<FaRunning />} routerLink={<Link to="/migrations" />} > Migrations </MenuItem>
            <MenuItem icon={<FaPencilAlt />} routerLink={<Link to="/researchers" />} > Researchers </MenuItem>
            <MenuItem icon={<FaBookMedical />} routerLink={<Link to="/bioentities" />} > Bio Entities Searcher </MenuItem>
            <MenuItem icon={<FaBookReader />} routerLink={<Link to="/publications" />} > Publications </MenuItem>
            <MenuItem icon={<FaUniversity />}routerLink={<Link to="/institutions" />} > Institutions </MenuItem>
            <MenuItem icon={<FaGlobeAmericas />}routerLink={<Link to="/countries" />} > Countries </MenuItem>
            <MenuItem icon={<FaGlobeAsia />} routerLink={<Link to="/twocountries" />} > Two Countries </MenuItem>
            <MenuItem icon={<FaEye />} routerLink={<Link to="/visualization" />} > Visualization </MenuItem>
            <MenuItem icon={<FaArrowLeft />} onClick={handleLinkClick} routerLink={<Link to="/" />} > Logout </MenuItem>
          </Menu>
        </Sidebar>
    )
  }
}

export default MenuBar
