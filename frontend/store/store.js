import {createStore, applyMiddleware} from "redux";
import ReduxThunk from "redux-thunk";
import logger from 'redux-logger';
import rootReducer from "../reducers/root_reducer"

export default (preloadedState = {}) => {
  return createStore(rootReducer, preloadedState, applyMiddleware(ReduxThunk,
  logger));
};
