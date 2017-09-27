import {RECEIVE_PLAYLIST,
  START_PLAYBACK, PAUSE_PLAYBACK } from "../actions/playlist_actions";

const NO_PLAYLIST = {ids: [], currentIndex: 0, playing: false};
export default (state = NO_PLAYLIST , action) => {
  switch(action.type){
    case RECEIVE_PLAYLIST:
      return Object.assign({}, state, {ids: action.payload, playing: true});
    case START_PLAYBACK:
      return Object.assign({}, state, {playing: true});
    case PAUSE_PLAYBACK:
      return Object.assign({}, state, {playing: false});
    default:
      return state;
  }
}
