import {DELETE_SESSION,
   RECEIVE_SESSION} from "../actions/session_actions";
const NO_USER_SESSION = {
  current_user: null
};

export default (state = NO_USER_SESSION, action) =>{
  switch(action.type) {
    case RECEIVE_SESSION:
      return {current_user: action.payload};
    case DELETE_SESSION:
      return NO_USER_SESSION;
    default:
      return state;
  }
};
