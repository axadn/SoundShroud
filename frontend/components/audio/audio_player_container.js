import {connect} from "react-redux";
import {fetchBinaryData} from "../../actions/track_actions";
import AudioPlayer from "./audio_player";

const mapStateToProps = (state, ownProps) => ({
  playlist: state.playlist.ids,
  playing: state.playlist.playing,
  indexInPlaylist: state.playlist.currentIndex,
  fetchForCache: (id, callBack) => fetchBinaryData(id, callBack)
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
