import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {fetchCommentsThunk,
  receiveCommentsLoaded, receiveCommentsLoading} from "../../../actions/comment_actions";
import {receiveUsersLoading, receiveUsersLoaded, fetchTrackCommentsUsersThunk} from "../../../actions/user_actions";
import CommentsIndex from "./comments_index";
import React from "react";

const mapContainerDispatchToProps = (dispatch, ownProps) => ({
  fetchComments: () =>{
    dispatch(receiveCommentsLoading());
    dispatch(receiveUsersLoading());
    dispatch(fetchCommentsThunk(ownProps.trackId));
    dispatch(fetchTrackCommentsUsersThunk(ownProps.trackId));
  }
});

const mapContainerStateToProps = (state, ownProps) =>({

});

const mapDisplayStateToProps = (state, ownProps) => {
  return{
  loading: state.loading.comments || state.loading.users,
  comments: state.entities.tracks[ownProps.trackId]
    .comment_ids.map(id => state.entities.comments[id])
}};

const mapDisplayDispatchToProps = (dispatch, ownProps) => ({

});

const ConnectedDisplayComponent = connect(mapDisplayStateToProps,
   mapDisplayDispatchToProps)(CommentsIndex);

class CommentsIndexContainer extends React.Component{

  componentWillMount(){
    this.props.fetchComments();
  }
  componentWillReceiveProps(newProps){
    if(this.props.trackId !== newProps.trackId){
      this.props.fetchComments();
    }
  }
  render(){
    return <ConnectedDisplayComponent trackId = {this.props.trackId}></ConnectedDisplayComponent>;
  }
}

export default connect(mapContainerStateToProps,
   mapContainerDispatchToProps)(CommentsIndexContainer);
