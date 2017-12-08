 const defaultState = {login: false, register: false}
import {ENABLE_LOGIN, ENABLE_REGISTER, DISABLE_AUTH} from "../actions/auth_modal_actions";

 export default (state = defaultState, action) => {
  switch(action.type){
    case ENABLE_LOGIN:
      return {login: true, register: false}
    case DISABLE_AUTH:
      return {login: false, register: false}
    case ENABLE_REGISTER:
      return {login: false, register: true}
    default:
      return state;
  }
 };
