import {connect} from "react-redux";
import DocumentPlayButton from "./document_play_button";
import {receivePlaylist, pausePlayback, startPlayback, receivePlaylistIndex}
 from "../../actions/playlist_actions";

const mapStateToProps = (state, props) => {
  debugger;
  return{
  playing: state.playlist.playing,
  tracksOnPage: state.entities.tracks,
  current_in_playlist: state.playlist.ids[state.playlist.currentIndex] == props.trackId};
};

const mapDispatchToProps = (dispatch, props) => ({
  resumeTrack: () => {
    dispatch(startPlayback());
  },
  dispatchPlaylist: ids => dispatch(receivePlaylist(ids)),
  playlistItemByIndex: index => dispatch(receivePlaylistIndex(index)),
  pauseTrack: () => dispatch(pausePlayback())
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPlayButton);
