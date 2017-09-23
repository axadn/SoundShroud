export const RECEIVE_UPLOAD_PROGRESS = "RECEIVE_UPLOAD_PROGRESS";
export const RECEIVE_UPLOAD_COMPLETED = "RECEIVE_UPLOAD_COMPLETED";
export const RECEIVE_UPLOAD_ACTIVE = "RECEIVE_UPLOAD_ACTIVE";
export const RECEIVE_UPLOAD_INACTIVE = "RECEIVE_UPLOAD_INACTIVE";


export default (state ={active: false, progress: 0}, action) => {
  switch(action.type){
    case RECEIVE_UPLOAD_PROGRESS:
      return Object.assign({}, state, {progress: action.payload})
    case RECEIVE_UPLOAD_ACTIVE:
      return Object.assign({},state, {active: true});
    case RECEIVE_UPLOAD_INACTIVE:
      return Object.assign({},state,{active: false, progress: 0})
    case RECEIVE_UPLOAD_COMPLETED:
      return Object.assign({}, state, {progress: 1});
    default:
      return state;
  }
}
