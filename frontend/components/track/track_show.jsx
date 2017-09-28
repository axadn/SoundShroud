import React from "react";
import {Link} from "react-router-dom";
import CommentsIndexContainer from "./comments/comments_index_container";
import {redirectToUser} from "../../utils/route_utils";
import DocumentPlayButtonContainer from "./document_play_button_container";
export default class TrackShow extends React.Component{
  constructor(props){
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }
  handleDelete(){
    if(!confirm(`Are you sure you would like to
       delete "${this.props.track.title}"?`)) return;
    this.props.deleteTrack();

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
          <div className ="banner">
            <div id="track_banner_left_side">
              <div>
                <div className= "artist_and_play_button">
                  <DocumentPlayButtonContainer large trackId={this.props.track.id}/>
                  <div className="track_info_container">
                    <div className = "banner-info-text">
                      <a>{this.props.track.artist_display_name} </a>
                    </div>
                    <div className = "banner-info-text">
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
            <img className="large" src={this.props.track.img_url}></img>
              <ul id="track_show_options">
                <li>{editButton}</li>
                <li>{deleteButton}</li>
              </ul>
          </div>
          <div className = "rule"></div>

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
