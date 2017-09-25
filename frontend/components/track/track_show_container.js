import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {receiveMainContentLoaded,
  receiveMainContentLoading} from "../../actions/loading_actions";
import TrackShow from "./track_show";
import {fetchTrackThunk} from "../../actions/track_actions";
import {current_user_id} from "../../reducers/selectors";


const mapDisplayStateToProps = (state, ownProps) => ({
  loading: state.loading.mainContent,
  track: state.entities.tracks[ownProps.trackId],
  current_user_id: current_user_id(state)
});

const mapDisplayDispatchToProps = (dispatch, ownProps) => ({

});

const mapContainerStateToProps = (state, ownProps) => ({
  trackId: ownProps.match.params.trackId
});
const mapContainerDispatchToProps = (dispatch, ownProps) => ({
  fetchTrack: () =>{
    dispatch(receiveMainContentLoading());
    dispatch(fetchTrackThunk( ownProps.match.params.trackId,
      () => dispatch(receiveMainContentLoaded())));
  }
});


class TrackShowContainer extends React.Component{
  componentWillMount(){
    this.props.fetchTrack();
  }
  componentWillReceiveNewProps(newProps){
    if(newProps.trackId!= this.props.trackId){
      this.props.fetchTrack();
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
