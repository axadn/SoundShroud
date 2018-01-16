import {redirectToUser} from "../../utils/route_utils";
import React from "react";
import {Link} from "react-router-dom";
export default (props)=> (
  <div className= "user-item">
    <div className = "track-item-cover-art-container">
      <div className = "padding-fix"></div>
      <img className="medium cover-art" src={props.user.image_url}
      onClick={redirectToUser(props.user.id)}></img>
    </div>
    <div className="info">
        <Link className="username-link"
        to={`/users/${props.user.id}`}>{props.user.display_name ? props.user.display_name:
            props.user.username}</Link>
    </div>
  </div>
);
