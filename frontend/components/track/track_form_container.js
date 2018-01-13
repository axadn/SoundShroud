import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {verifyThenPostThunk, clearUploadParamsErrors,
  editTrackThunk, fetchTrackThunk} from "../../actions/track_actions";
import {receiveMainContentLoaded,
   receiveMainContentLoading} from "../../actions/loading_actions";
import TrackForm from "./track_form";
import React from "react";
const mapDisplayStateToProps = (state, ownProps) => {
  let track;
  if(ownProps.editing){
    track = state.entities.tracks.tracks[ownProps.trackId];
  }
  return{
  track,
  loading: ownProps.editing && state.loading.mainContent,
  initial_state: {title: "", labelTitle: true, labelDescription: true,
    description: "", file: undefined},
  errors: state.errors.uploadParams
}};

const mapDisplayDispatchToProps = (dispatch, ownProps) => {
  let formAction;
  if(ownProps.editing)
  {
    formAction = data =>{
      data.id = ownProps.trackId;
      dispatch(editTrackThunk(data));
    };
  }
  else{
    formAction = unprocessedData => dispatch(
      verifyThenPostThunk(unprocessedData));
  }
  return {
    formAction,
    clearParamsErrors: () => dispatch(clearUploadParamsErrors())
  };
};

const mapContainerStateToProps = (state, ownProps) => ({
  editing: Boolean(ownProps.match.params.trackId),
  trackId: ownProps.match.params.trackId
});

const mapContainerDispatchToProps = (dispatch, ownProps)=>{
  if(ownProps.match.params.trackId){
    return{
      fetchTrack: (id) => {
        dispatch(receiveMainContentLoading());
        dispatch(fetchTrackThunk(id,
          ()=> dispatch(receiveMainContentLoaded())));
      }
    };
  }
  return {};
};
const ConnectedDisplayComponent =
  connect(mapDisplayStateToProps, mapDisplayDispatchToProps)(TrackForm);
class TrackFormContainer extends React.Component{
  componentWillMount(){
    if (this.props.editing){
      this.props.fetchTrack(this.props.trackId);
    }
  }
  componentWillReceiveProps(newProps){
    if(newProps.trackId !== this.props.trackId){
      this.props.fetchTrack(newProps.trackId);
    }
  }
  render (){
    return <ConnectedDisplayComponent trackId={this.props.trackId}
      editing={this.props.editing}/>
  }
}
export default withRouter(connect(mapContainerStateToProps,
   mapContainerDispatchToProps)(TrackFormContainer));
