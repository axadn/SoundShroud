import React from "react";

export default class TrackShow extends React.Component{
  render(){
    debugger
    if(this.props.loading){
      return null;
    }
    else{
      return(
        <div className ="track_show_content" >
          <div className= "artist_and_play_button">
            <div>{this.props.track.artist_display_name} </div>
            <div>{this.props.track.title} </div>
          </div>
        </div>
      );
    }
  }
}
