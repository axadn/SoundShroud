import React from "react";
export default (props) => {
  return <div className ="comment_item">
    <img src={props.user.img_url}></img>
    <div className ="comment_body_and_info">
      <div className = "comment_info">
        {`${props.user.display_name} at ${props.comment.created_at}`}
      </div>
      <div className = "comment_body">
        {props.comment.body}
      </div>
    </div>
  </div>;
}
