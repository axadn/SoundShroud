import React from "react";
import MainContent from "./main_content.jsx"
import NavBar from "./nav_bar/nav_bar";
import {HashRouter} from "react-router-dom";
export default () =>(
  <HashRouter>
  <div className="app">
      <NavBar/>
      <MainContent/>
  </div>
  </HashRouter>
);
