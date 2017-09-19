import * as UsersAPI from "../utils/api_user_utils";
import {receiveSession} from "./session_actions";
import {receiveSessionErrors} from "./session_actions";

export const postUserThunk = userData => dispatch => (
  UsersAPI.postUser(userData).then(
    userData => dispatch(receiveSession(userData))).
    catch(errors => dispatch(receiveSessionErrors(errors.responseJSON)))
);
