import {RECEIVE_AUDIO_LOADED, RECEIVE_AUDIO_LOADING} from "../../actions/playlist_actions";

export default (state= false, action) =>{
  switch(action.type){
    case RECEIVE_AUDIO_LOADED:
      return false;
    case RECEIVE_AUDIO_LOADING:
      return true;
    default:
      return state;
  }
}
