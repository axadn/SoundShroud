import React from "react";
import MainContent from "./main_content";
import NavBar from "./nav_bar/nav_bar";
import UploadProgressContainer from "./upload/upload_progress_container";
import {HashRouter} from "react-router-dom";
import AudioControlsContainer from "./audio/audio_controls_container";
import AuthModalContainer from "./auth_modal/auth_modal_container";
export default () =>(
  <HashRouter>
    <div className="app">
        <AuthModalContainer/>
        <div className = "modal-hidden">
          <NavBar/>
          <UploadProgressContainer/>
          <MainContent/>
        </div>
        <AudioControlsContainer/>
    </div>
  </HashRouter>
);
