import React from "react";
import {Link} from "react-router-dom";
import DocumentPlayButtonContainer from "../track/document_play_button_container";
export default (props)=> (
  <div className= "track-item">
    <img className="medium" src={props.track.img_url}></img>
    <div>
      <DocumentPlayButtonContainer trackId={props.track.id}/>
      <div className="track-item-info">
        <Link to={`/tracks/${props.track.id}`}>{props.track.title}</Link>
      </div>
    </div>
  </div>
);
