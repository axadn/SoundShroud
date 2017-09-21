import * as TrackAPI from "../utils/api_track_utils";
export const RECIEVE_TRACK = "RECEIVE_TRACK";
export const RECIVE_TRACKS = "RECIVE_TRACKS";
export const DELETE_TRACK = "DELETE_TRACK";
export const RECEIEVE_UPLOAD_ERRORS = "RECIEVE_TRACK_ERRORS";
export const CLEAR_UPLOAD_ERRORS = "CLEAR_UPLOAD_ERRORS";

export const recieveTrack = data => ({
  type: RECIEVE_TRACK,
  payload: data
});

export const recieveUploadErrors

export const recieveTracks = data => ({
  type: RECIVE_TRACKS,
  payload: data
});

export const fetchTrackThunk = id => dispatch => (
  TrackAPI.fetchTrack(id).then(data=> dispatch(recieveTrack(data)))
);

export const verifyValidParamsThunk = formData => dispatch => (
  TrackAPI.verifyValidParams(formData).then()
);
export const postTrackThunk = formData => dispatch => (
  TrackAPI.postTrack(formData).then()
);
