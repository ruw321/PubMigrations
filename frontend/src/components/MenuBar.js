import React from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "shards-react";

class MenuBar extends React.Component {
  render() {
    const handleLinkClick = event => {
      window.localStorage.setItem('Authenticated', 'False');
    };

    return (
      <Navbar type="dark" theme="secondary" expand="md">
        <NavbarBrand href="/">CIS 550 Project</NavbarBrand>
        <Nav navbar className="container-fluid">
          {/* <NavItem>
            <NavLink active href="/">
              Home
            </NavLink>
          </NavItem> */}
          <NavItem>
            <NavLink active href="/migrations">
              Migrations
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/researchers" >
              Researchers
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/bioentities" >
              Bio Entities Searcher
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/publications" >
              Publications
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/institutions" >
              Institutions
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/countries" >
              Countries
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/visualization" >
              Visualization
            </NavLink>
          </NavItem>
          <NavItem className="border-left pl-2 ml-auto">
            <NavLink onClick={handleLinkClick} active href="/login" >
              Logout
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}

export default MenuBar
