import React from "react";
import {connect} from "react-redux";
import Waveform from "./waveform";

const mapStateToProps = (state, props) =>({
  samples: state.entities.tracks.tracks[props.id].waveform,
  loading: state.loading.audio,
  currentlyPlaying: state.entities.tracks.playlistIds[
    state.entities.tracks.playlistIndex] == props.id,
  audioAnalyser: state.audioAnalyser
});

export default connect(mapStateToProps)(Waveform);
