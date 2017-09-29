import {connect} from "react-redux";
import AudioControls from "./audio_controls";
import {startPlayback, pausePlayback, forwardPlayback, backPlayback}
  from "../../actions/playlist_actions";
const mapStateToProps = (state, props) =>({

});

const mapDispatchToProps = (dispatch, props) =>({
  playAction: () => dispatch(startPlayback()),
  pauseAction: () => dispatch(pausePlayback())
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioControls);
