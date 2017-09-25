import { RECEIVE_COMMENTS} from "../actions/comment_actions";

export default (state = {}, action) => {
  switch(action.type){
    case RECEIVE_COMMENTS:
      return action.payload;
    default:
      return state;
  }
};
