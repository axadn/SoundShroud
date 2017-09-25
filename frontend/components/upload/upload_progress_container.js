import React from "react";
import {connect} from "react-redux";
import UploadProgress from "./upload_progress";
import {receiveUploadInactive} from "../../actions/track_actions";

const mapStateToProps = (state, ownProps) => ({
  progress: state.upload.progress,
  active: state.upload.active,
  errors: state.errors.upload,
  processed: state.upload.processed
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setInactive: () => dispatch(receiveUploadInactive())
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadProgress);
