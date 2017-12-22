import {createStore, applyMiddleware} from "redux";
import ReduxThunk from "redux-thunk";
import rootReducer from "../reducers/root_reducer"
import logger from "redux-logger";

const setupAudioAnalyser = ()=>{
  const audioCtx = new window.AudioContext();
  const analyser = audioCtx.createAnalyser();
  const audioSrc = audioCtx.createMediaElementSource(
    document.querySelector("audio")
  );
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);
  return analyser;
};
export default (preloadedState = {audioAnalyser: setupAudioAnalyser()}) => {
  return createStore(rootReducer, preloadedState, applyMiddleware(ReduxThunk, logger));
};
