import * as TrackAPI from "../utils/api_track_utils";
export const RECEIVE_TRACK = "RECEIVE_TRACK";
export const RECEIVE_TRACKS = "RECEIVE_TRACKS";
export const DELETE_TRACK = "DELETE_TRACK";
export const RECEIVE_UPLOAD_ERRORS = "RECEIVE_UPLOAD_ERRORS";
export const CLEAR_UPLOAD_ERRORS = "CLEAR_UPLOAD_ERRORS";
export const RECEIVE_UPLOAD_PARAMS_ERRORS = "RECEIVE_UPLOAD_PARAMS_ERRORS";
export const CLEAR_UPLOAD_PARAMS_ERRORS = "CLEAR_UPLOAD_PARAMS_ERRORS";
export const RECEIVE_UPLOAD_PROGRESS = "RECEIVE_UPLOAD_PROGRESS";
export const RECEIVE_UPLOAD_COMPLETED = "RECEIVE_UPLOAD_COMPLETED";
export const RECEIVE_UPLOAD_ACTIVE = "RECEIVE_UPLOAD_ACTIVE";
export const RECEIVE_UPLOAD_INACTIVE = "RECEIVE_UPLOAD_INACTIVE";
export const receiveTrack = data => ({
  type: RECEIVE_TRACK,
  payload: data
});

export const receiveUploadParamsErrors = errors => ({
  type: RECEIVE_UPLOAD_PARAMS_ERRORS,
  payload: errors
});

export const receiveUploadActive = () => ({
  type: RECEIVE_UPLOAD_ACTIVE
});

export const receiveUploadInactive = () => ({
    type: RECEIVE_UPLOAD_INACTIVE
});

export const clearUploadParamsErrors = errors => ({
  type: CLEAR_UPLOAD_PARAMS_ERRORS
});

export const receiveUploadErrors = errors => ({
  type: RECEIEVE_UPLOAD_ERRORS,
  payload: errors
});

export const clearUploadErrors = () => ({
  type: CLEAR_UPLOAD_ERRORS
});

export const receiveTracks = data => ({
  type: RECEIVE_TRACKS,
  payload: data
});

export const receiveUploadProgress = progress => ({
  type: RECEIVE_UPLOAD_PROGRESS,
  payload: progress
});

export const receiveUploadCompleted = () => ({
  type: RECEIVE_UPLOAD_COMPLETED
});

export const fetchTrackThunk = (id, callback) => dispatch => (
  TrackAPI.fetchTrack(id).then(data=> dispatch(receiveTrack(data)))
    .then(()=> {
      if(callback){
        callback(id);
      }
    })
);

export const verifyThenPostThunk = unprocessedData => dispatch => {
  const formData = new FormData(); //without the file
  const trackParams = {track: {}};
  Object.keys(unprocessedData).forEach(key=>{
    if (key !== "file"){
      trackParams.track[key] = unprocessedData[key];
    }
  });
  if(unprocessedData.file){
    trackParams.filename = unprocessedData.file.name;
  }
  else{
    trackParams.filename = "";
  }

  TrackAPI.verifyValidParams(trackParams)
  .then(res=>{
    window.res = res;
  });
  //     formData.append("file", unprocessedData.file);
  //     formData.append("track", JSON.stringify(trackParams.track));
  //     formData.append("filename", trackParams.filename)
  //     dispatch(postTrackThunk(formData));
  //     dispatch(receiveUploadActive());
  //   })
  // .catch(
  //   errors =>{
  //   dispatch(receiveUploadParamsErrors(errors));
  // });
};

export const postTrackThunk = formData => dispatch => {
  const postRequest = TrackAPI.postTrack(formData);
  // postRequest.upload.addEventListener("progress",function (e) {
  //   if (e.lengthComputable) {
  //       dispatch(receiveUploadProgress(e.loaded/ e.total));
  //   }
  // });
  // postRequest.addEventListener("load", event => (
  //   dispatch(receiveUploadCompleted())));
  // postRequest.addEventListener("error", event => (
  //   dispatch(receiveUploadErrors({
  //     general: ["An error ocurred while transferring the file."]}))));
  // postRequest.addEventListener("error", event => (
  //   dispatch(receiveUploadErrors({
  //     general: ["An error ocurred while transferring the file."]}))));
  // location.hash = "/";
};

export const editTrackThunk = data => dispatch => (
  TrackAPI.updateTrack({track:data}));
