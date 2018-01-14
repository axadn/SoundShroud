import {RECEIVE_TRACK,
        RECEIVE_TRACKS} from "../actions/track_actions";
import {RECEIVE_PLAYLIST,
        START_PLAYBACK, PAUSE_PLAYBACK, RECEIVE_PLAYLIST_INDEX,
        FORWARD_PLAYBACK, BACK_PLAYBACK, RECEIVE_AUDIO_LOADED,
         RECEIVE_AUDIO_LOADING, COPY_PLAYLIST_FROM_PAGE}
        from "../actions/playlist_actions";

export default (state = {tracks: {}, ids: [], playlistIds: [], playing: false,
playlistIndex: undefined}, action) => {
  switch(action.type){
    case RECEIVE_TRACKS:
      const oldTracks = {};
      state.playlistIds.forEach(id=>{
        oldTracks[id.toString()] = state.tracks[id.toString()];
      })
      return Object.assign({}, state, {tracks: Object.assign(
        oldTracks, action.payload.tracks), ids: action.payload.ids});
    case RECEIVE_TRACK:
      const playlistTracks = {};
      state.playlistIds.forEach(id=>{
        playlistTracks[id.toString()] = state.tracks[id.toString()];
      });
      playlistTracks[action.payload.id.toString()] = action.payload;
      return Object.assign({}, state, {tracks: playlistTracks,
         ids: [action.payload.id]});
    case RECEIVE_PLAYLIST:
      const playlistAttribs = {playlistIds: action.payload.ids,
        tracks: Object.assign({}, state.tracks, action.payload.tracks),
        playing: true, playlistIndex: null};
      return Object.assign({},state, playlistAttribs);
    case COPY_PLAYLIST_FROM_PAGE:
      return Object.assign({}, state, {playlistIds: state.ids.slice(),
        playing: true, playlistIndex: state.ids.indexOf(action.payload)});
    case START_PLAYBACK:
      return Object.assign({}, state, {playing: true});
    case PAUSE_PLAYBACK:
      return Object.assign({}, state, {playing: false});
    case RECEIVE_PLAYLIST_INDEX:
      return Object.assign({}, state, {playlistIndex: action.payload});
    case FORWARD_PLAYBACK:
      return Object.assign({}, state, {playlistIndex:
                                      (state.playlistIndex + 1) % state.playlistIds.length});
    case BACK_PLAYBACK:
      let newIdx = state.playlistIndex - 1;
      if(newIdx == -1) newIdx = state.playlistIds.length - 1;
      return Object.assign({}, state, {playlistIndex: newIdx});
    default:
      return state;
  }
};
