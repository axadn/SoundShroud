import React from "react";
import {Link} from "react-router-dom";
export default props =>{
    let html;
    if(props.track){
        html = 
        (<div className="playback-track-info">
            <img className ="small" src={props.track.img_url}
                onClick={() => location.hash =`/tracks/${props.track.id}`}/>
            <div className="info">
              <Link className="username-link"
                to={`/users/${props.track.artist_id}`}>{props.track.artist_display_name}</Link>
              <Link className="title-link"
                to={`/tracks/${props.track.id}`}>{props.track.title}</Link>
            </div>
        </div>);
    }
    else{
        html = <div></div>;
    }
    return html;
};