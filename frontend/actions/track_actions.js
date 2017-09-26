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
  export const RECEIVE_UPLOAD_PROCESSED = "RECEIVE_UPLOAD_PROCESSED";
  export const receiveTrack = data => ({
    type: RECEIVE_TRACK,
    payload: data
  });

  export const receiveUploadParamsErrors = errors => ({
    type: RECEIVE_UPLOAD_PARAMS_ERRORS,
    payload: errors.statusText? {general: [errors.statusText]} : errors
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

  export const receiveUploadErrors = errors => {
    return{
    type: RECEIVE_UPLOAD_ERRORS,
    payload: (errors.statusText ? {general: [errors.statusText]} : errors)
    };
  };

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

  export const receiveUploadProcessed = () =>({
    type: RECEIVE_UPLOAD_PROCESSED
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
    .catch(
      errors =>{
      dispatch(receiveUploadParamsErrors(errors));
     })
    .then(s3Info=>{
      trackParams.temp_filename = s3Info.temp_filename;
      dispatch(receiveUploadActive());
      return TrackAPI.uploadTrack(
        {file: unprocessedData.file,
        s3Info,
        progressCallback: e =>
          dispatch(receiveUploadProgress(e.loaded/ e.total))
        });
    })
    .then( temp_filename => (
      TrackAPI.process_track(trackParams)
    ))
    .then(idObject => setTimeout(()=>
      dispatch(checkAudioProcessStatus(idObject.id)), 1000))
    .catch(
      errors => {
        dispatch(receiveUploadErrors(errors));
    });
  };

  const checkAudioProcessStatus =  id => dispatch => {
      $.ajax({
        method: "get",
        url: `api/tracks/${id}/status`
      }).then( res=> {
        if(res.id){
          dispatch(receiveUploadProcessed());
        }
        else if (res.status === "failed"){
          dispatch(receiveUploadErrors({"general":
           ["couldn't process audio"]}));
        }
        else{
          setTimeout(() => dispatch(checkAudioProcessStatus(id)), 1000);
        }
      });
  };

export const editTrackThunk = data => dispatch => {
    TrackAPI.updateTrack({track:data}).then(() =>
      location.hash = `tracks/${data.id}`
    );
  };

export const deleteTrackThunk = (trackId, callBack) => dispatch => {
  TrackAPI.deleteTrack(trackId).then(callBack);
}
