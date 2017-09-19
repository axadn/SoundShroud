import {RECEIVE_SESSION } from "../actions/session_actions";

const NO_USERS = {};

export default (state = NO_USERS, action) => {
  switch(action.type){
    case RECEIVE_SESSION:
      return Object.assign(
        {[action.payload.id]: action.payload},
        state
      );
    default:
      return state;
  }
}
