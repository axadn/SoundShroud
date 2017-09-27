import React from "react";
import MainContent from "./main_content.jsx"
import NavBar from "./nav_bar/nav_bar";
import UploadProgressContainer from "./upload/upload_progress_container";
import {HashRouter} from "react-router-dom";
import AudioPlayerContainer from "./audio/audio_player_container";
export default () =>(
  <HashRouter>
    <div className="app">
        <NavBar/>
        <UploadProgressContainer/>
          <MainContent/>
          <AudioPlayerContainer/>
    </div>
  </HashRouter>
);
