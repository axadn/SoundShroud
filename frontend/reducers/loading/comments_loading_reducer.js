import {RECEIVE_COMMENTS_LOADED,
  RECEIVE_COMMENTS_LOADING} from "../../actions/comment_actions";

export default (state = false, action) =>{
  switch(action.type){
    case RECEIVE_COMMENTS_LOADING:
      return true;
    case RECEIVE_COMMENTS_LOADED:
      return false;
    default:
      return state;
  }
}
