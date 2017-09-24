import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {verifyThenPostThunk, clearUploadParamsErrors,
  updateTrackThunk} from "../../actions/track_actions";
import TrackForm from "./track_form";
const mapStateToProps = (state, ownProps) => ({
  editing: Boolean(ownProps.match.params.trackId)
});

const mapDispatchToProps = (dispatch, ownProps) => {
  let formAction;
  if(ownProps.match.params.matchId)
  {
    formAction = data => dispatch => {
      data.id = ownProps.match.params.id;
      updateTrackThunk(data);
    }
  }
  else{
    formAction = unprocessedData => dispatch(
      verifyThenPostThunk(unprocessedData));
  }
  return {
    formAction,
    clearParamsErrors: () => dispatch(clearUploadParamsErrors())
  };
};

export default withRouter(connect(mapStateToProps,
   mapDispatchToProps)(TrackForm));
