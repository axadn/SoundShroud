import {combineReducers} from "redux";
import trackReducer from "./tracks_reducer";
import usersReducer from "./users_reducer";
import commentsReducer from "./comments_reducer";
import searchResultsReducer from "./search_results_reducer";
import recommendationsReducer from "./recommendations/recommendations_reducer";

export default combineReducers({
  tracks: trackReducer,
  users: usersReducer,
  comments: commentsReducer,
  searchResults: searchResultsReducer,
  recommendations: recommendationsReducer
});
