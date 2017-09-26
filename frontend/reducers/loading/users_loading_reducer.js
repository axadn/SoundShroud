import {RECEIVE_USERS_LOADED, RECEIVE_USERS_LOADING} from "../../actions/user_actions";

export default (state = false, action) => {
  switch(action.type){
    case RECEIVE_USERS_LOADED:
      return false;
    case RECEIVE_USERS_LOADING:
      return true;
    default:
      return state;
  }
}
