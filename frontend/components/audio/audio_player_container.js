import {connect} from "react-redux";
import {fetchBinaryData} from "../../actions/track_actions";
import AudioPlayer from "./audio_player";

const mapStateToProps = (state, ownProps) => ({
  playlist: state.playlist.ids,
  playing: state.playlist.playing,
  indexInPlaylist: 0,
  fetchForCache: (storageObj, id, callBack) => fetchBinaryData(storageObj, id, callBack)
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
