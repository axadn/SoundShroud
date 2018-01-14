import {connect} from "react-redux";
import UpdatableImage from "./updatable_image";
import {postUserImage, postTrackImage} from "../actions/image_actions";
import {current_user_id, logged_in} from "../reducers/selectors";
const mapStateToProps = (state, props) =>{
  let editable;

  if(props.type === "user"){
    editable = (logged_in(state) && props.id == current_user_id(state));
  }
  else{
    editable = (logged_in(state) && props.userId == current_user_id(state));
  }
  return {editable};
};

const mapDispatchToProps = (dispatch, props) =>{
  let postAction;
  if(props.type === "user"){
    postAction = file => postUserImage(file, props.id);
  }
  else{
    postAction = file => postTrackImage(file, props.id);
  }
  return {postAction};
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatableImage);
