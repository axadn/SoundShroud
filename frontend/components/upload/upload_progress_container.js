import React from "react";
import {connect} from "react-redux";
import UploadProgress from "./upload_progress";

const mapStateToProps = (state, ownProps) => ({
  uploadProgress: state.upload.progress,
  active: state.progress.active
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setInactive: () => dispatch(receiveUploadInactive);
});

export connect (mapStateToProps, mapDispatchToProps)(UploadProgress);
