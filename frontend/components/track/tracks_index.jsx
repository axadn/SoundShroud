import React from "react";
import {Link} from "react-router-dom";
import TrackItem from "./track_item";
export default class TracksIndex extends React.Component{

  render(){
    if(this.props.loading) return <div className="tracks-index"/>;
    const trackItems = this.props.tracks.map(track => (
      <li key={`trackItem${track.id}`}>
        <TrackItem track={track}></TrackItem>
      </li>

    ));
    return <div className={`tracks-index ${this.props.animationClassName}`}>
      <ul>
        {trackItems}
      </ul>
    </div>
  }
}
