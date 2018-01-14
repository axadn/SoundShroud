import {connect} from "react-redux";
import {fetchBinaryData} from "../../actions/track_actions";
import AudioPlayer from "./audio_player";
import {currentlyLoadingAudioAction, finishedLoadingAudioAction}
  from "../../actions/playlist_actions"

const mapStateToProps = (state, ownProps) => {
  return{
  playlist: state.entities.tracks.playlistIds,
  playing: state.entities.tracks.playing,
  indexInPlaylist: state.entities.tracks.playlistIndex,
  fetchForCache: (id, callBack) => fetchBinaryData(id, callBack)
}};

const mapDispatchToProps = (dispatch, ownProps) => ({
  currentlyLoadingAudioAction: () => dispatch(currentlyLoadingAudioAction()),
  finishedLoadingAudioAction: () => dispatch(finishedLoadingAudioAction())
});
export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
