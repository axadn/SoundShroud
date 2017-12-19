import {RECEIVE_SESSION } from "../actions/session_actions";
import {RECEIVE_USERS, RECEIVE_USER} from "../actions/user_actions";
const NO_USERS = {};

export default (state = NO_USERS, action) => {
  switch(action.type){
    case RECEIVE_USERS:
      return action.payload;
    
    case RECEIVE_USER:
      let replaceUserData;
      const newData = {[action.payload.id]: action.payload};
      if(state[action.payload.id]){
        replaceUserData = Object.assign(
          {},
          state[action.payload.id],
          newData
        );
      }
      else{
        replaceUserData = newData;
      }
      return Object.assign({}, state, newData);
    default:
      return state;
  }
}
