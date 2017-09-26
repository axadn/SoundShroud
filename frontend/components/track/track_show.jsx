import React from "react";
import {Link} from "react-router-dom";
import CommentsIndexContainer from "./comments/comments_index_container";

export default class TrackShow extends React.Component{
  render(){
    if(this.props.loading){
      return null;
    }
    else{
      let editButton;
      if(this.props.current_user_id === this.props.track.artist_id){
        editButton = <Link className="blue_button" to={`/tracks/${this.props.track.id}/edit`}>Edit</Link>;
      }
      return(
        <div className ="track_show_content" >
          <div className ="track_banner">
            <div>
              <div>
                <div className= "artist_and_play_button">
                  <div className = "track_info_text">
                    <a>{this.props.track.artist_display_name} </a>
                  </div>
                  <div className = "track_info_text">
                    <a>{this.props.track.title}</a>
                  </div>
                </div>
                <div>{this.props.track.created_at.slice(0,10)}</div>
              </div>
              <div className="waveform"></div>
            </div>
            <img id="track_show_img" src={this.props.track.img_url}></img>
          </div>
          <div id="track description">{this.props.track.description}</div>
          {editButton}
          <CommentsIndexContainer trackId={this.props.track.id}/>
        </div>
      );
    }
  }
}
