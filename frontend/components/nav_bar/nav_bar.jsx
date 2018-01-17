import React from "react";
import SessionButtonsContainer from "./session_buttons_container";
import {NavLink} from "react-router-dom";
import SearchBar from "./search_bar";

export default ()=>(
  <div className="nav_bar_container">
    <div className="nav_bar">
      <div className="nav_link_set">
        <NavLink className="top_nav_link" to="/discover">
          Discover
        </NavLink>
      </div>
      <SearchBar/>
      <SessionButtonsContainer/>
    </div>
  </div>
);
