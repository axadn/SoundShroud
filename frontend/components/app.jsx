import React from "react";
import MainContent from "./main_content.jsx"
import NavBar from "./nav_bar/nav_bar";
import UploadProgressContainer from "./upload/upload_progress_container";
import {HashRouter} from "react-router-dom";
export default () =>(
  <HashRouter>
    <div className="app">
        <NavBar/>
        <UploadProgressContainer/>
          <MainContent/>
          <div className = "play_bar"></div>
    </div>
  </HashRouter>
);
