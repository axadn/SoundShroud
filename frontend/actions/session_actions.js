import * as SessionsAPI from "../utils/api_session_utils";
export const RECEIVE_SESSION = "RECEIVE_SESSION";
export const DELETE_SESSION = "DELETE_SESSION";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";
export const CLEAR_SESSION_ERRORS = "CLEAR_SESSION_ERRORS";

export const receiveSession = data =>({
  type: RECEIVE_SESSION,
  payload: data
});

export const receiveSessionErrors = errors =>(
  {type: RECEIVE_SESSION_ERRORS,
  errors});

  export const clearSessionErrors = errors =>(
    {type: CLEAR_SESSION_ERRORS,
    errors});

const deleteSession = () =>({
  type: DELETE_SESSION
});

export const postSessionThunk = sessionData => dispatch => (
  SessionsAPI.postSession(sessionData).then(
    userData => dispatch(receiveSession(userData)),
    errors => dispatch(receiveSessionErrors(errors.responseJSON))
  )
);

export const deleteSessionThunk = () => dispatch => (
  SessionsAPI.deleteSession().then(()=>{
    dispatch(deleteSession());
  })
);
