import {combineReducers} from "redux";
import mainContentLoadingReducer from "./main_content_loading_reducer";
import commentsLoadingReducer from "./comments_loading_reducer";
import usersLoadingReducer from "./users_loading_reducer";
import tracksLoadingReducer from "./tracks_loading_reducer";
import audioLoadingReducer from "./audio_loading_reducer";

export default combineReducers({
  mainContent: mainContentLoadingReducer,
  comments: commentsLoadingReducer,
  users: usersLoadingReducer,
  tracks: tracksLoadingReducer,
  audio: audioLoadingReducer
});
