import {connect} from "react-redux";
import DocumentPlayButton from "./document_play_button";
import {receivePlaylist, pausePlayback, startPlayback, receivePlaylistIndex}
 from "../../actions/playlist_actions";
import {generatePlaylist} from "../../utils/api_playlist_utils";
const mapStateToProps = (state, props) => {
  return{
  playing: state.playlist.playing,
  tracksOnPage: state.entities.tracks.ids,
  current_in_playlist: state.playlist.ids[state.playlist.currentIndex] == props.trackId};
};

const mapDispatchToProps = (dispatch, props) => ({
  resumeTrack: () => {
    dispatch(startPlayback());
  },
  dispatchPlaylist: ids => dispatch(receivePlaylist(ids)),
  playlistItemByIndex: index => dispatch(receivePlaylistIndex(index)),
  pauseTrack: () => dispatch(pausePlayback()),
  generatePlaylist: trackId => generatePlaylist(trackId).then(
    ids => {
      ids = ids.map(id => id.id);
      dispatch(receivePlaylist(ids));
      dispatch(receivePlaylistIndex(ids.indexOf(props.trackId)));
    }
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPlayButton);
