import React from "react";
import {connect} from "react-redux";
import Waveform from "./waveform";

const mapStateToProps = (state, props) =>({
  samples: state.entities.tracks.tracks[props.id].waveform,
  currentlyPlaying: state.playlist.ids[state.playlist.currentIndex] === props.id,
  audioAnalyser: state.audioAnalyser
});

export default connect(mapStateToProps)(Waveform);
