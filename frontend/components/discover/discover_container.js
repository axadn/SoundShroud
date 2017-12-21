import {connect} from "react-redux";
import {receiveMainContentLoaded, receiveMainContentLoading}
  from "../../actions/loading_actions";
import {fetchRandomPlaylistThunk} from "../../actions/playlist_actions";
import Discover from "./discover";
import React from "react";

const mapStateToProps = state => ({
  loading: state.loading.mainContent,
  tracks: state.entities.tracks
});

const mapDispatchToProps = dispatch => ({
  fetchPlaylist: () =>{
    dispatch(receiveMainContentLoading());
    dispatch(fetchRandomPlaylistThunk(() =>
      dispatch(receiveMainContentLoaded())
    ));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Discover);
