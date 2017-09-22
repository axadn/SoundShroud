import React from "react";
import {Link} from "react-router-dom";

export default class LandingPage extends React.Component{
  componentDidMount(){
    document.getElementById('blue_filter_in').beginElement();
  }
  render(){
    return(
    <div className = "landing_page_window">
      <img src="/assets/sax blue.jpeg"></img>
      <div className = "landing_info">
        <h1> Connect on SoundShroud</h1>
        <div>Discover hot new music from emerging and major artists
           worldwide.
        </div>
        <Link className ="blue_button landing_button" to="/signup"> Sign Up For Free!</Link>
      </div>
    </div>
    );
  }
}
