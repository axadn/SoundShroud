import React from "react";
import {Link} from "react-router-dom";

export default class LandingPage extends React.Component{
  componentDidMount(){
    document.getElementById('blue_filter_in').beginElement();
  }
  render(){
    return(
    <div className = "landing_page_content">
      <img src="/assets/micro.jpeg"></img>
      <div className = "landing_info">
        <h1> Connect on SoundShroud</h1>
        <div>Discover hot new music from emerging and major artists
           worldwide.
        </div>
        <div className ="blue_button" id="landing_button" onClick={
          this.props.enableRegister
        }> Sign Up For Free!</div>
      </div>
    </div>
    );
  }
}
