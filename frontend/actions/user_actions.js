import * as UsersAPI from "../util/api_user_utils";
import {receiveSession} from "./session_actions";


export const postUserThunk = userData => dispatch => (
  UsersAPI.postUser(userData).then(
    userData => dispatch(receiveSession(userData))
  )
);
