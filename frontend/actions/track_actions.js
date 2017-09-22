import * as TrackAPI from "../utils/api_track_utils";
export const RECIEVE_TRACK = "RECEIVE_TRACK";
export const RECIVE_TRACKS = "RECIVE_TRACKS";
export const DELETE_TRACK = "DELETE_TRACK";
export const RECEIEVE_UPLOAD_ERRORS = "RECIEVE_TRACK_ERRORS";
export const CLEAR_UPLOAD_ERRORS = "CLEAR_UPLOAD_ERRORS";
export const RECIEVE_UPLOAD_PARAMS_ERRORS = "RECIEVE_UPLOAD_PARAMS_ERRORS";
export const CLEAR_UPLOAD_PARAMS_ERRORS = "RECIEVE_UPLOAD_PARAMS_ERRORS";

export const recieveTrack = data => ({
  type: RECIEVE_TRACK,
  payload: data
});

export const receiveUploadParamsErrors = errors => ({
  type: RECEIEVE_UPLOAD_PARAMS_ERRORS,
  payload: data
});

export const clearUploadParamsErrors = errors => ({
  type: CLEAR_UPLOAD_PARAMS_ERRORS
});

export const recieveUploadErrors = errors => ({
  type: RECEIEVE_UPLOAD_ERRORS
  payload: errors
});

export const clearUploadErrors = () => ({
  type: CLEAR_UPLOAD_ERRORS
});

export const recieveTracks = data => ({
  type: RECIVE_TRACKS,
  payload: data
});

export const receiveUploadProgress = progress => ({
  type: RECEIVE_UPLOAD_PROGRESS,
  progress
});

export const recieveUploadCompleted = () => ({
  type: RECEIVE_UPLOAD_COMPLETED
});
export const fetchTrackThunk = id => dispatch => (
  TrackAPI.fetchTrack(id).then(data=> dispatch(recieveTrack(data)))
);

export const verifyValidParamsThunk = formData => dispatch => (
  TrackAPI.verifyValidParams(formData).then(
    dispatch(postTrackThunk(formData)),
    errors => dispatch(recieveUploadParamsErrors(errors))
  )
);
export const postTrackThunk = formData => dispatch => (
  TrackAPI.postTrack(formData).then(location.hash = "/")
);
