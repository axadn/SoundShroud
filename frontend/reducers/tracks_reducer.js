import {RECEIVE_TRACK,
        RECEIVE_TRACKS} from "../actions/track_actions";

export default (state = {}, action) => {
  switch(action.type){
    case RECEIVE_TRACKS:
      return action.payload;
    case RECEIVE_TRACK:
      return Object.assign({}, state, {
        [action.payload.id]: action.payload
      });
    default:
      return state;
  }
};
