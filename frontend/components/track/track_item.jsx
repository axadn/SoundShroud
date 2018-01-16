import React from "react";
import {Link} from "react-router-dom";
import WaveformContainer from "../waveform/waveform_container";
import DocumentPlayButtonContainer from "../track/document_play_button_container";
export default (props)=> {s
  return(
  <div className= "track-item">
    <div className = "track-item-cover-art-container">
      <div className = "padding-fix"></div>
      <img className="medium cover-art" src={props.track.img_url}
      onClick={() => location.hash =`/tracks/${props.track.id}`}></img>
    </div>
    <div className="play-info-and-waveform">
      <div className="play-button-and-info">
        <DocumentPlayButtonContainer trackId={props.track.id}/>
        <div className="info">
          <Link className="username-link"
            to={`/users/${props.track.artist_id}`}>{props.track.artist_display_name}</Link>
          <Link className="title-link"
            to={`/tracks/${props.track.id}`}>{props.track.title}</Link>
        </div>
      </div>
      <WaveformContainer id={props.track.id} samples={props.track.waveform}/>
    </div>
  </div>
);
};
