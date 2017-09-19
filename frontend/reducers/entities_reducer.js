import {combineReducers} from "redux";
import trackReducer from "./tracks_reducer";
import usersReducer from "./users_reducer";

export default combineReducers({
  tracks: trackReducer,
  users: usersReducer
});
