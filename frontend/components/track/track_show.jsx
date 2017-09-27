import React from "react";
import {Link} from "react-router-dom";
import CommentsIndexContainer from "./comments/comments_index_container";
import {redirectToUser} from "../../utils/route_utils";
export default class TrackShow extends React.Component{
  constructor(props){
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePlayButton = this.handlePlayButton.bind(this);
  }
  handleDelete(){
    if(!confirm(`Are you sure you would like to
       delete "${this.props.track.title}"?`)) return;
    this.props.deleteTrack();

  }
  handlePlayButton(){
    if(this.props.current_in_playlist){
      if(this.props.playing){
        this.props.pauseTrack();
      }
      else{
        this.props.resumeTrack();
      }
    }
    else{
      this.props.playTrack();
    }
  }
  currentlyPlaying(){
    return this.props.current_in_playlist && this.props.playing;
  }
  render(){
    if(this.props.loading){
      return null;
    }
    else{
      let editButton, deleteButton;
      if(this.props.current_user_id === this.props.track.artist_id){
        editButton = <Link className="blue_button" to={`/tracks/${this.props.track.id}/edit`}>Edit</Link>;
        deleteButton = <button className="blue_button" onClick={this.handleDelete}>Delete</button>
      }
      return(
        <div className ="track_show_content" >
          <div className ="track_banner">
            <div id="track_banner_left_side">
              <div>
                <div className= "artist_and_play_button">
                  <div className = "document-play-button" onClick={this.handlePlayButton}>
                    <img className={this.currentlyPlaying()? "":"hidden"}
                      src= {window.pause_img_url}></img>
                    <img className={this.currentlyPlaying()? "hidden":""}
                      src= {window.play_img_url}></img>
                  </div>
                  <div className="track_info_container">
                    <div className = "track_info_text">
                      <a>{this.props.track.artist_display_name} </a>
                    </div>
                    <div className = "track_info_text">
                      <a>{this.props.track.title}</a>
                    </div>
                  </div>
                </div>
                <div>{this.props.track.created_at.slice(0,10)}</div>
              </div>
              <div id="show_page_waveform_container">
                <div className="waveform"></div>
              </div>
            </div>
            <img id="track_show_img" src={this.props.track.img_url}></img>
              <ul id="track_show_options">
                <li>{editButton}</li>
                <li>{deleteButton}</li>
              </ul>
          </div>



          <div id="track_show_lower_half">
              <div id="artist_and_comments">
                <div className="song_show_artist_info">
                  <img className="user-img-medium"
                    onClick={redirectToUser(this.props.track.artist_id)}
                     src={this.props.track.artist_img}>
                  </img>
                  {this.props.track.artist_display_name}
                </div>
                <div id="description_and_comments">
                  <div id="track_description">{this.props.track.description}</div>
                  <CommentsIndexContainer trackId={this.props.track.id}/>
                </div>
              </div>
            </div>
          </div>

      );
    }
  }
}
