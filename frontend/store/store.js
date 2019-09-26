import {createStore, applyMiddleware} from "redux";
import ReduxThunk from "redux-thunk";
import rootReducer from "../reducers/root_reducer"
import logger from "redux-logger";
import audioPlayer from "./middleware/audio_player";

export default () => {
  return createStore(rootReducer, {}, applyMiddleware(ReduxThunk, audioPlayer, logger));
};
