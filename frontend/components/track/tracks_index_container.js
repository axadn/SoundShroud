import React from "react";
import {connect} from "react-redux";
import TracksIndex from "./tracks_index";

function mapStateToProps(state){
  return {
    loading: state.loading.mainContent,
    tracks: state.entities.tracks.ids.map(id =>
      state.entities.tracks.tracks[id])
  };
}

export default connect(mapStateToProps)(TracksIndex);
