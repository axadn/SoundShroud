import * as UsersAPI from "../utils/api_user_utils";
import {receiveSession} from "./session_actions";
import {receiveSessionErrors} from "./session_actions";
export const RECEIVE_USERS = "RECEIVE_USERS";
export const RECEIVE_USERS_LOADING = "RECEIVE_USERS_LOADING";
export const RECEIVE_USERS_LOADED = "RECEIVE_USERS_LOADED";
export const RECEIVE_USER = "RECEIVE_USER";
import  {disableAuthModal} from "./auth_modal_actions";

export const receiveUsers = userData =>({
  type: RECEIVE_USERS,
  payload: userData
});

export const receiveUsersLoading = () => ({
    type: RECEIVE_USERS_LOADING
});

export const receiveUsersLoaded = () => ({
  type: RECEIVE_USERS_LOADED
});

export const receiveUser = data => ({
  type: RECEIVE_USER,
  payload: data
});
export const postUserThunk = userData => dispatch => (
  UsersAPI.postUser(userData).then(
    userData => {
      dispatch(receiveSession(userData));
      dispatch(disableAuthModal());
    }
    ).
    catch(errors => dispatch(receiveSessionErrors(errors.responseJSON)))
);
export const fetchUserThunk = (userId, callback) => dispatch => ((
  UsersAPI.fetchUser(userId).then(
    userData => dispatch(receiveUser(userData))
  )
  .then(callback)
));

export const fetchRecommendedUsersThunk = (userId, callback) => dispatch => {
  UserAPI.fetchRecommendedUsers(userId).then(
    userData =>{
      dispatch(receiveUsers(userData));
      callback(userData);
    }
  );
};

export const fetchTrackCommentsUsersThunk = trackId => dispatch => (
  UsersAPI.fetchTrackCommentsUsers(trackId)
  .then(userData =>{
      dispatch(receiveUsers(userData));
      dispatch(receiveUsersLoaded());
    }
  )
);
