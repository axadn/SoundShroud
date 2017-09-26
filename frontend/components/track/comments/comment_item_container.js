import {connect} from "react-redux";
import CommentItem from "./comment_item";

const mapStateToProps = (state, ownProps) => ({
  user: state.entities.users[ownProps.comment.user_id]
});

export default connect(mapStateToProps)(CommentItem);
