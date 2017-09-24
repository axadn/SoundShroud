import {RECEIVE_MAIN_CONTENT_LOADING,
  RECEIVE_MAIN_CONTENT_LOADED} from "../../actions/loading_actions";

export default (state = false, action) => {
  switch(action.type){
    case RECEIVE_MAIN_CONTENT_LOADING:
      return true;
    case RECEIVE_MAIN_CONTENT_LOADED:
      return false;
    default:
      return state;
  }
}
