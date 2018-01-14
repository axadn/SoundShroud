import {connect} from "react-redux";
import DocumentPlayButton from "./document_play_button";
import {receivePlaylist, pausePlayback, startPlayback,
  copyPlaylistFromPage, receivePlaylistIndex}
 from "../../actions/playlist_actions";
import {generatePlaylist} from "../../utils/api_playlist_utils";
const mapStateToProps = (state, props) => ({
  playing: state.entities.tracks.playing,
  tracksOnPage: state.entities.tracks.ids,
  current_in_playlist: state.entities.tracks.playlistIds[
    state.entities.tracks.playlistIndex] == props.trackId
});

const mapDispatchToProps = (dispatch, props) => ({
  resumeTrack: () => {
    dispatch(startPlayback());
  },
  copyPlaylistFromPage: ()=>{ 
    dispatch(copyPlaylistFromPage(props.trackId));
  },
  pauseTrack: () => dispatch(pausePlayback()),
  generatePlaylist: trackId => generatePlaylist(trackId).then(
    payload => {
      dispatch(receivePlaylist(payload));
      dispatch(receivePlaylistIndex(payload.ids.indexOf(props.trackId)));
    }
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPlayButton);
