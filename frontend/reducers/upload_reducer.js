import{
 RECEIVE_UPLOAD_PROGRESS , RECEIVE_UPLOAD_COMPLETED ,
  RECEIVE_UPLOAD_ACTIVE , RECEIVE_UPLOAD_INACTIVE,
 RECEIVE_UPLOAD_PROCESSED } from "../actions/track_actions";

const INITIAL_STATE = {
  active: false,
  progress: 0,
  processed: false
}

export default (state =INITIAL_STATE, action) => {
  switch(action.type){
    case RECEIVE_UPLOAD_PROGRESS:
      return Object.assign({}, state, {progress: action.payload})
    case RECEIVE_UPLOAD_ACTIVE:
      return Object.assign({},state, {active: true});
    case RECEIVE_UPLOAD_INACTIVE:
      return INITIAL_STATE;
    case RECEIVE_UPLOAD_COMPLETED:
      return Object.assign({}, state, {progress: 1});
    case RECEIVE_UPLOAD_PROCESSED:
      return Object.assign({}, state, {processed: true});
    default:
      return state;
  }
}
