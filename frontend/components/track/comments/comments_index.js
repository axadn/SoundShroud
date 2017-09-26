import React from "react";
import CommentItemContainer from "./comment_item_container";

export default class CommentsIndex extends React.Component{
  render(){
    if(this.props.loading) return null;
    const commentsItems = this.props.comments.map(comment =>(
      <li key={`comment${comment.id}`}>
        <CommentItemContainer comment={comment}/>
      </li>
    ));
    return <div className="commentsIndex">
      <ul>
        {commentsItems}
      </ul>
    </div>;
  }
};
