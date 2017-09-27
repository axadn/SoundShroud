import {RECEIVE_UPLOAD_PARAMS_ERRORS, CLEAR_UPLOAD_PARAMS_ERRORS} from "../../actions/track_actions";
const NO_ERRORS = {general: []}

export default (state=NO_ERRORS, action)=>{
  switch(action.type){
    case RECEIVE_UPLOAD_PARAMS_ERRORS:
      return Object.assign({}, state, action.payload)
    case CLEAR_UPLOAD_PARAMS_ERRORS:
      return NO_ERRORS;
    default:
      return state;
  }
}
