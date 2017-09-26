import React from "react";
import CommentItemContainer from "./comment_item_container";

export default class CommentsIndex extends React.Component{
  constructor(props){
    super(props);
    this.state ={labelInput: true,
    body: "", savedWidth: 0,
    savedHeight: 0};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e){
    this.setState({body: e.target.value});
  }
  handleSubmit(e){
    e.preventDefault();
    const element = document.querySelector(".commentsIndex");
    this.setState({body: "", labelInput: true, savedWidth: element.offsetWidth,
      savedHeight: element.offsetHeight}
    );
    this.props.postComment(this.state,
      this.props.fetchComments);
  }
  render(){
    if(this.props.loading){
      return <div style={{
          width: this.state.savedWidth,
          height: this.state.savedHeight
        }}></div>;
    }
    const commentsItems = this.props.comments.map(comment =>(
      <li key={`comment${comment.id}`}>
        <CommentItemContainer comment={comment}/>
      </li>
    ));
    return <div className="commentsIndex">
      <form id="commentForm" onSubmit={this.handleSubmit}>
        <input type="text"
          onChange={this.handleChange}
          onBlur={()=>this.setState({labelInput: this.state.body.length === 0})}
          onFocus = {()=>this.setState({labelInput: false})}
          value={this.labelInput? "Add a Comment" : this.state.body}>
        </input>
      </form>
      <ul>
        {commentsItems}
      </ul>
    </div>;
  }
};
