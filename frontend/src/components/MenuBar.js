import React from 'react';

import { Sidebar, Menu, MenuItem, SubMenu, sidebarClasses, menuClasses} from 'react-pro-sidebar';
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
      // </div>
      // <Navbar  type="dark" theme="secondary" expand="md">
      //   <NavbarBrand href="/">CIS 550 Project</NavbarBrand>
      //   <Nav vertical="true" navbar className="container-fluid">
      //     {/* <NavItem>
      //       <NavLink active href="/">
      //         Home
      //       </NavLink>
      //     </NavItem> */}
      //     <NavItem>
      //       <NavLink active href="/migrations">
      //         Migrations
      //       </NavLink>
      //     </NavItem>
      //     <NavItem>
      //       <NavLink active href="/researchers" >
      //         Researchers
      //       </NavLink>
      //     </NavItem>
      //     <NavItem>
      //       <NavLink active href="/bioentities" >
      //         Bio Entities Searcher
      //       </NavLink>
      //     </NavItem>
      //     <NavItem>
      //       <NavLink active href="/publications" >
      //         Publications
      //       </NavLink>
      //     </NavItem>
      //     <NavItem>
      //       <NavLink active href="/institutions" >
      //         Institutions
      //       </NavLink>
      //     </NavItem>
      //     <NavItem>
      //       <NavLink active href="/countries" >
      //         Countries
      //       </NavLink>
      //     </NavItem>
      //     <NavItem>
      //       <NavLink active href="/twocountries" >
      //         Two Countries
      //          </NavLink>
      //     </NavItem>
      //     <NavItem>
      //       <NavLink active href="/visualization" >
      //         Visualization
      //       </NavLink>
      //     </NavItem>
      //     <NavItem className="border-left pl-2 ml-auto">
      //       <NavLink onClick={handleLinkClick} active href="/login" >
      //         Logout
      //       </NavLink>
      //     </NavItem>
      //   </Nav>
      // </Navbar>
    )
  }
}

export default MenuBar
