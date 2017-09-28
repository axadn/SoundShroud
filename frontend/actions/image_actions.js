import {receiveUser} from "./user_actions";
import {receiveTrack} from "./track_actions";
import * as s3Util from "../utils/s3_utils";
import * as APIImageUtil from "../utils/api_image_util";

export const postUserImage = (img, id) =>{
  APIImageUtil.presignedUserPost(img, id)
  .then(s3Info => (s3Util.postPresigned({file: img, s3Info})));
};

export const postTrackImage = (img, id)=>{
  APIImageUtil.presignedTrackPost(img, id)
  .then(s3Info => (s3Util.postPresigned({file: img, s3Info})));
};
