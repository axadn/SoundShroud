import {combineReducers} from "redux";
import mainContentLoadingReducer from "./main_content_loading_reducer";

export default combineReducers({
  mainContent: mainContentLoadingReducer
});
