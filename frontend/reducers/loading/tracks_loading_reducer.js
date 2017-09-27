import {RECEIVE_TRACKS_LOADING,
  RECEIVE_TRACKS_LOADED} from "../../actions/track_actions";

export default (state =false, action) =>{
  switch(action.type){
    case RECEIVE_TRACKS_LOADED:
      return false;
    case RECEIVE_TRACKS_LOADING:
      return true;
    default:
      return state;
  }
}
