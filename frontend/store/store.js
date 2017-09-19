import {createStore, applyMiddleware} from "redux";
import ReduxThunk from "redux-thunk";
import rootReducer from "../reducers/root_reducer"

export default (preloadedState = {}) => {
  return createStore(rootReducer, preloadedState, applyMiddleware(ReduxThunk));
};
