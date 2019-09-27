import {createStore, applyMiddleware} from "redux";
import ReduxThunk from "redux-thunk";
import rootReducer from "../reducers/root_reducer"

import audioPlayer from "./middleware/audio_player";
import logger from "redux-logger";

let middleware = [ReduxThunk, audioPlayer];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger);
}

export default () => {
  return createStore(rootReducer, {}, applyMiddleware(...middleware));
};
