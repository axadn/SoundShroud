import React from "react";
import {Link} from "react-router-dom";
import DocumentPlayButtonContainer from "../track/document_play_button_container";
export default (props)=> (
  <div className= "track-item">
    <img className="medium" src={props.track.img_url}></img>
    <div className="play-button-and-info">
      <DocumentPlayButtonContainer trackId={props.track.id}/>
      <div className="info">
        <Link to={`/users/${props.track.artist_id}`}>{props.track.artist_display_name}</Link>
        <Link to={`/tracks/${props.track.id}`}>{props.track.title}</Link>
      </div>
    </div>
  </div>
);
