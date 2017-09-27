import {redirectToUser} from "../../../utils/route_utils";
import React from "react";
export default (props) => {
  return <div className ="comment_item">
    <img className="profile_thumbnail" onClick={redirectToUser(props.user.id)}
      src={props.user.image_url}></img>
    <div className ="comment_body_and_info">
      <div className = "comment_info">
        <div className ="username-link" onClick={redirectToUser(props.user.id)}>
        {`${props.user.display_name ? props.user.display_name :
          props.user.username}`}
        </div>
      </div>
      <div className = "comment_body">
        {props.comment.body}
      </div>
    </div>
  </div>;
}
