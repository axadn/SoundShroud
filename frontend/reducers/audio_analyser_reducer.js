import {SET_AUDIO_ANALYSER} from '../actions/audio_analyser_actions';
export default (state = null, action) =>{
    switch(action.type){
        case SET_AUDIO_ANALYSER:
            return action.analyser;
        default:
            return state;
    }
}