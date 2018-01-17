import {PAUSE_PLAYBACK, START_PLAYBACK, FORWARD_PLAYBACK,
     BACK_PLAYBACK, RECEIVE_PLAYLIST, RECEIVE_PLAYLIST_INDEX, COPY_PLAYLIST_FROM_PAGE, finishedLoadingAudioAction, currentlyLoadingAudioAction, startPlayback}
    from "../../actions/playlist_actions";
import {currentPlaylistId} from "../../reducers/selectors";
import * as TrackAPIUtils from "../../utils/api_track_utils";
export default store=>next=>action=>{
    switch(action.type){
        case PAUSE_PLAYBACK: 
            document.querySelector("audio").pause();
            return next(action);
        case START_PLAYBACK:
            document.querySelector("audio").play(); 
            return next(action);
        case RECEIVE_PLAYLIST:
        case COPY_PLAYLIST_FROM_PAGE:
        case FORWARD_PLAYBACK:
        case BACK_PLAYBACK:
        case RECEIVE_PLAYLIST_INDEX:
            const playlistId = currentPlaylistId(store.getState());
            const result = next(action);
            const nextId = currentPlaylistId(store.getState());
            if(playlistId != nextId){
                TrackAPIUtils.getS3Url(nextId).then(
                    url=>{
                        document.querySelector("audio").src = url;
                        document.querySelector("audio").crossOrigin = "anonymous";
                        store.dispatch(currentlyLoadingAudioAction());
                        document.querySelector("audio").oncanplay = () =>{
                            store.dispatch(finishedLoadingAudioAction());
                            if(store.getState().entities.tracks.playing){
                                document.querySelector("audio").play(); 
                            }
                        }
                    }
                );
            }
            return result;
        default:
            return next(action);
    }
};