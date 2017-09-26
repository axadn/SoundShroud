import React from "react";
export default (props) => {
  return <div className ="comment_item">
    <img className="profile_thumbnail" src={props.user.image_url}></img>
    <div className ="comment_body_and_info">
      <div className = "comment_info">
        {`${props.user.display_name ? props.user.display_name :
          props.user.username}`}
      </div>
      <div className = "comment_body">
        {props.comment.body}
      </div>
    </div>
  </div>;
}
