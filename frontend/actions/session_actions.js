import * as SessionsAPI from "../util/api_session_utils";
export const RECEIVE_SESSION = "RECEIVE_SESSION";
export const DELETE_SESSION = "DELETE_SESSION";

export const receiveSession = data =>({
  type: RECEIVE_SESSION,
  payload: data
});

const deleteSession = () =>({
  type: DELETE_SESSION
});

export const postSessionThunk = sessionData => dispatch => (
  SessionsAPI.postSession(sessionData).then(
    userData => dispatch(receiveSession(userData))
  )
);

export const deleteSessionThunk = () => dispatch => (
  SessionsAPI.deleteSession().then(dispatch(deleteSession()))
);
