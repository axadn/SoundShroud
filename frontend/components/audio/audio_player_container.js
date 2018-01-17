import {connect} from "react-redux";
import {fetchBinaryData} from "../../actions/track_actions";
import AudioPlayer from "./audio_player";
import {currentlyLoadingAudioAction, finishedLoadingAudioAction}
  from "../../actions/playlist_actions"
import {currentPlaylistId} from "../../reducers/selectors";
const mapStateToProps = (state, ownProps) => {
  debugger;
  return{
    trackId: currentPlaylistId(state),
    playing: state.entities.tracks.playing
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  currentlyLoadingAudioAction: () => dispatch(currentlyLoadingAudioAction()),
  finishedLoadingAudioAction: () => dispatch(finishedLoadingAudioAction())
});
export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
