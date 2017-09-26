import {RECEIVE_SESSION } from "../actions/session_actions";
import {RECEIVE_USERS, RECEIVE_USER} from "../actions/user_actions";
const NO_USERS = {};

export default (state = NO_USERS, action) => {
  switch(action.type){
    case RECEIVE_SESSION:
      return Object.assign({},
        state,
        {[action.payload.id]: action.payload}
      );
    case RECEIVE_USERS:
      debugger
      return action.payload;
    case RECEIVE_USER:
      return Object.assign({}, state, {[action.payload.id]: action.payload})
    default:
      return state;
  }
}
