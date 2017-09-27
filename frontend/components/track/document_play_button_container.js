import {connect} from "react-redux";
import DocumentPlayButton from "./document_play_button";
import {receivePlaylist, pausePlayback, startPlayback} from "../../actions/playlist_actions";

const mapStateToProps = (state, props) => {
  return{
  playing: state.playlist.playing,
  current_in_playlist: state.playlist.ids[state.playlist.currentIndex] === props.trackId};
};

const mapDispatchToProps = (dispatch, props) => ({
  playTrack: () =>{
    dispatch(receivePlaylist([props.trackId]));
  },
  resumeTrack: () => {
    dispatch(startPlayback());
  },
  pauseTrack: () => dispatch(pausePlayback())
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPlayButton);
