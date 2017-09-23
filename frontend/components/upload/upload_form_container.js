import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {verifyThenPostThunk, clearUploadParamsErrors} from "../../actions/track_actions";
import UploadForm from "./upload_form";
const mapStateToProps = (state, ownProps) => ({

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  verifyThenPost: unprocessedData => dispatch(
    verifyThenPostThunk(unprocessedData)),
  clearParamsErrors: () => dispatch(clearUploadParamsErrors())
});

export default withRouter(connect(mapStateToProps,
   mapDispatchToProps)(UploadForm));
