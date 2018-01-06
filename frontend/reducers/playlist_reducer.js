import {RECEIVE_PLAYLIST,
  START_PLAYBACK, PAUSE_PLAYBACK, RECEIVE_PLAYLIST_ID,
  FORWARD_PLAYBACK, BACK_PLAYBACK, RECEIVE_AUDIO_LOADED, RECEIVE_AUDIO_LOADING}
   from "../actions/playlist_actions";
const NO_PLAYLIST = {ids: [], currentIndex: null, playing: false};
export default (state = NO_PLAYLIST , action) => {
  switch(action.type){
    case RECEIVE_PLAYLIST:
      return Object.assign({}, state, {ids: action.payload, playing: true, currentIndex: null});
    case START_PLAYBACK:
      return Object.assign({}, state, {playing: true});
    case PAUSE_PLAYBACK:
      return Object.assign({}, state, {playing: false});
    case RECEIVE_PLAYLIST_ID:
      return Object.assign({}, state, {currentIndex: action.payload});
    case FORWARD_PLAYBACK:
      return Object.assign({}, state, {currentIndex:
                                      (state.currentIndex + 1) % state.ids.length});
    case BACK_PLAYBACK:
      let newIdx = state.currentIndex - 1;
      if(newIdx == -1) newIdx = state.ids.length - 1;
      return Object.assign({}, state, {currentIndex: newIdx});
    default:
      return state;
  }
}
