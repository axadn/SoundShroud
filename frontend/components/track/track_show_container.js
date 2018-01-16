import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {receiveMainContentLoaded,
  receiveMainContentLoading} from "../../actions/loading_actions";
import TrackShow from "./track_show";
import {fetchTrackThunk, deleteTrackThunk} from "../../actions/track_actions";
import {current_user_id, logged_in} from "../../reducers/selectors";

const mapDisplayStateToProps = (state, ownProps) => ({
  loading: state.loading.mainContent,
  track: state.entities.tracks.tracks[ownProps.trackId],
  current_user_id: logged_in(state) ? current_user_id(state): null,
});

const mapDisplayDispatchToProps = (dispatch, ownProps) => ({
  deleteTrack: () =>{
    dispatch(deleteTrackThunk(ownProps.trackId, ()=>location.hash = "/" ));
  }
});

const mapContainerStateToProps = (state, ownProps) => ({
  trackId: ownProps.match.params.trackId
});
const mapContainerDispatchToProps = (dispatch, ownProps) => ({
  fetchTrack: id =>{
    dispatch(receiveMainContentLoading());
    dispatch(fetchTrackThunk( id,
      () => dispatch(receiveMainContentLoaded())));
  }
});


class TrackShowContainer extends React.Component{
  componentWillMount(){
    this.props.fetchTrack(this.props.trackId);
  }
  componentWillReceiveProps(newProps){
    if(newProps.trackId!= this.props.trackId){
      this.props.fetchTrack(newProps.trackId);
    }
  }
  render(){
    return <ConnectedDisplayComponent trackId={this.props.trackId}/>;
  }
}

const ConnectedDisplayComponent = connect(mapDisplayStateToProps,
   mapDisplayDispatchToProps)(TrackShow);

export default withRouter(connect(mapContainerStateToProps,
   mapContainerDispatchToProps)(TrackShowContainer));
