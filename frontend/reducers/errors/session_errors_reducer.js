import {RECIEVE_USER, RECIEVE_USERS} from "../../actions/user_actions";
import {RECEIVE_SESSION_ERRORS, CLEAR_SESSION_ERRORS} from "../../actions/session_actions";
export default (state =[], action) => {
  switch (action.type) {
    case RECIEVE_USER:
      return [];
    case RECIEVE_USERS:
      return [];
    case RECEIVE_SESSION_ERRORS:
      return action.errors
    case CLEAR_SESSION_ERRORS:
      return [];
    default:
      return state;
  }
}
