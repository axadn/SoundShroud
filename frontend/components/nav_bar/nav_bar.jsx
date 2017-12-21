import React from "react";
import SessionButtonsContainer from "./session_buttons_container";
import {NavLink} from "react-router-dom";

export default ()=>(
  <div className="nav_bar">
    <div className="nav_link_set">
      <NavLink className="top_nav_link" to="/discover">
        Discover
      </NavLink>
      <NavLink className="top_nav_link" exact to="/">
        Home
      </NavLink>
    </div>
    <SessionButtonsContainer/>
  </div>
);
