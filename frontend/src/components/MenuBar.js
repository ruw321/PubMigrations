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
        return(
            <Navbar type="dark" theme="primary" expand="md">
        <NavbarBrand href="/">CIS 550 Project</NavbarBrand>
          <Nav navbar>
          <NavItem>
              <NavLink active href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/migrations">
                Migrations
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/researchers" >
                Researchers
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/bioentities" >
                Bio Entities Searcher
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/publications" >
                Publications
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/institutions" >
                Institutions
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/countries" >
                Countries
              </NavLink>
            </NavItem>
          </Nav>
      </Navbar>
        )
    }
}

export default MenuBar
