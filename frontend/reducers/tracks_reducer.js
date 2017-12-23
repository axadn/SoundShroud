import {RECEIVE_TRACK,
        RECEIVE_TRACKS} from "../actions/track_actions";

export default (state = {tracks: {}, ids: []}, action) => {
  switch(action.type){
    case RECEIVE_TRACKS:
      return {tracks: action.payload.tracks, ids: action.payload.ids};
    case RECEIVE_TRACK:
      return Object.assign({}, state, {
        tracks:{[action.payload.id]: action.payload},
        ids: [action.payload.id]
      });
    default:
      return state;
  }
};
