import {RECEIVE_UPLOAD_ERRORS, RECEIVE_UPLOAD_INACTIVE} from "../../actions/track_actions";
const NO_ERRORS = {general: []}

export default (state=NO_ERRORS, action)=>{
  switch(action.type){
    case RECEIVE_UPLOAD_ERRORS:
      return Object.assign({}, state, action.payload)
    case RECEIVE_UPLOAD_INACTIVE:
      return NO_ERRORS;
    default:
      return state;
  }
}
