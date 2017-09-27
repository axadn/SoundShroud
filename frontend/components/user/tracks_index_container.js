import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {fetchUserTracksThunk,
  receiveTracksLoading, receiveTracksLoaded}
   from "../../actions/track_actions";
import TracksIndex from "./tracks_index";

const mapContainerStateToProps = (state, props) => ({});

const mapContainerDispatchToProps =(dispatch, props) => ({
  fetchUserTracks: () => {
    dispatch(receiveTracksLoading());
    dispatch(fetchUserTracksThunk(props.match.params.userId, ()=>(
      dispatch(receiveTracksLoaded())
    )));
  }
});

const mapDisplayStateToProps = (state, props) => ({
  loading: state.loading.tracks,
  tracks: props.trackIds.map(id => state.entities.tracks[id])
});

const mapDisplayDispatchToProps = (dispatch, props) => ({

});
const ConnectedDisplayComponent = connect(mapDisplayStateToProps,
   mapDisplayDispatchToProps)(TracksIndex);

class TracksIndexContainer extends React.Component{
  componentWillMount(){
    this.props.fetchUserTracks();
  }
  componentWillReceiveProps(newProps){
    if(this.props.trackIds !== newProps.trackIds ){
      this.props.fetchUserTracks();
    }
  }
  render(){
    return <ConnectedDisplayComponent trackIds={this.props.trackIds}/>
  }
}

export default withRouter(connect(mapContainerStateToProps,
   mapContainerDispatchToProps)(TracksIndexContainer));
