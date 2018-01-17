import * as TrackAPI from "../utils/api_track_utils";
import * as S3API from "../utils/s3_utils";
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
export const RECEIVE_TRACKS_LOADED = "RECIEVE_TRACKS_LOADED";
export const RECEIVE_TRACKS_LOADING = "RECIEVE_TRACKS_LOADING";

export const receiveTracksLoading = () =>({
  type: RECEIVE_TRACKS_LOADING
});

export const receiveTracksLoaded = () =>({
  type: RECEIVE_TRACKS_LOADED
});

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
  payload: errors
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

export const verifyThenPostThunk = (unprocessedData, clearFormCallback) => dispatch => {
  const formData = new FormData();
  const trackParams = {track: {}};
  Object.keys(unprocessedData).forEach(key=>{
    if (key !== "file" && key!== "imageFile"){
      trackParams.track[key] = unprocessedData[key];
    }
  });

  trackParams.filename = unprocessedData.file? unprocessedData.file.name : "";
  if(unprocessedData.imageFile)
    trackParams.image_filename = unprocessedData.imageFile.name;



  TrackAPI.verifyValidParams(trackParams)
  .then(
    s3Info => {
      clearFormCallback();
      let awaiter = new AudioAndImageUploadAwaiter(unprocessedData.file.size,
        unprocessedData.imageFile? unprocessedData.imageFile.size: 0);

      trackParams.temp_filename = s3Info.audio.temp_filename;
      if(s3Info.image)
        trackParams.temp_image_filename = s3Info.image.temp_filename;

      awaiter.registerCallback(() =>{
          dispatch(receiveUploadCompleted());
          TrackAPI.process_track(trackParams)
          .catch(errors => {
            dispatch(receiveUploadErrors(errors));
            return $.Deferred().reject();
          })
          .then(idObject => setTimeout(()=>
            dispatch(checkAudioProcessStatus(idObject.id)), 1000));
        }
      );


      S3API.postPresigned(
        {file: unprocessedData.file,
          s3Info: s3Info.audio,
          progressCallback: e =>{
            awaiter.alertAmountAudioUploaded(e.loaded);
            dispatch(receiveUploadProgress(awaiter.getTotalProgress()));
          }
        }
      ).then(() => awaiter.alertAudioDone());
      if(s3Info.image){
        S3API.postPresigned(
          {file: unprocessedData.imageFile,
            s3Info: s3Info.image,
            progressCallback: e => {
              awaiter.alertAmountImageUploaded(e.loaded);
              dispatch(receiveUploadProgress(awaiter.getTotalProgress()));
            }
          }
        )
        .then(() => awaiter.alertImageDone());
      }
      else{
        awaiter.alertImageDone();
      }

      dispatch(receiveUploadActive());
    },
    errors =>{
      dispatch(receiveUploadParamsErrors(errors.responseJSON));
      return $.Deferred().reject();
    }
  );
};

class AudioAndImageUploadAwaiter{
  constructor(audioSize, imageSize){
    this.progress = 0;
    this.total = audioSize + imageSize;
    this.audioUploaded = 0;
    this.imageUploaded = 0;
    this.audioDone = false;
    this.imageDone = false;
  }
  registerCallback(callback){
    this.callback = callback;
  }
  alertAmountAudioUploaded(amount){
    this.audioUploaded = amount;
  }
  alertAmountImageUploaded(amount){
    this.imageUploaded = amount;
  }
  alertImageDone(){
    this.imageDone = true;
    if(this.audioDone){
      this.callback();
    }
  }
  alertAudioDone(){
    this.audioDone = true;
    if(this.imageDone){
      this.callback();
    }
  }
  getTotalProgress(){
    return (this.audioUploaded + this.imageUploaded)/this.total;
  }
}

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

export const fetchBinaryData = (id, callBack) => {
  TrackAPI.getS3Url(id)
  .then(url =>{
    debugger;
      return new Promise((resolve,reject)=>{
        const xhr = new XMLHttpRequest();
        xhr.open("get", url);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = reject;
        xhr.send();
        xhr.onreadystatechange = ()=>{
          debugger;
        };
      });
    }
  )
  .then(data =>
     callBack({id, binaryData: data})
   )
  // .catch(() => storageObj.fetching = false);
};
export const editTrackThunk = data => dispatch => {
    TrackAPI.updateTrack({track:data})
    .then(() =>{
      location.hash = `tracks/${data.id}`
    })
    .catch(errors => dispatch(receiveUploadParamsErrors(errors.responseJSON)));
  };

export const deleteTrackThunk = (trackId, callBack) => dispatch => {
  TrackAPI.deleteTrack(trackId).then(callBack);
}

export const fetchUserTracksThunk = (userId, callback) => dispatch => (
  TrackAPI.fetchUserTracks(userId)
  .then(data => dispatch(receiveTracks(data)))
  .then(callback)
);
