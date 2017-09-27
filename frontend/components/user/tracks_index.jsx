import React from "react";
import {Link} from "react-router-dom";
export default class TracksIndex extends React.Component{

  render(){
    if(this.props.loading) return null;
    const trackItems = this.props.tracks.map(track => (
      <li key={`trackItem${track.id}`}>
        <Link to={`/tracks/${track.id}`}>{track.title}</Link>
      </li>

    ));
    return <div className="tracks-index">
      <ul>
        {trackItems}
      </ul>
    </div>
  }
}
