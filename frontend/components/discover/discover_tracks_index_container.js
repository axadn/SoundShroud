import TracksIndex from "../tracks/tracks_index";
import React from "react";
import {connect} from "react-redux";

function mapContainerStateToProps(state){
  return {

  };
};

function mapContainerDispatchToProps(dispatch){
  return {
    fetchTracks: () =>{
      dispatch(receiveMainContentLoading());
      dispatch(fetchRandomPlaylistThunk(() =>
        dispatch(receiveMainContentLoaded())
      ));
    }
  };
}

function mapChildStateToProps(state){
  return {
    loading: state.loading.tracks
  };
}

function mapChildDispatchToProps(dispatch){
  fetchTracks: () =>{
    dispatch(receiveMainContentLoading());
    dispatch(fetchRandomPlaylistThunk(() =>
      dispatch(receiveMainContentLoaded())
    ));
  }
}

class ParentComponent extends React.Component{
  componentWillMount(){
    this.props.fetchTracks();
  }
  render(){
    return <connectedChild/>;
  }
}


const connectedChild = connect(mapChildStateToProps)(TracksIndex);

export default connect(mapContainerStateToProps, mapContainerDispatchToProps)(ParentComponent);
