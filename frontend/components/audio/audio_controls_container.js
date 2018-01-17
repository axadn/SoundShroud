import {connect} from "react-redux";
import AudioControls from "./audio_controls";
import {startPlayback, pausePlayback, forwardPlayback, backPlayback}
  from "../../actions/playlist_actions";
const mapStateToProps = (state, props) =>({
  loaded: !state.loading.audio,
  playing: state.entities.tracks.playing
});

const mapDispatchToProps = (dispatch, props) =>({
  playAction: () => dispatch(startPlayback()),
  pauseAction: () => dispatch(pausePlayback()),
  skipAction: () => dispatch(forwardPlayback()),
  backAction: () => dispatch(backPlayback())
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioControls);
