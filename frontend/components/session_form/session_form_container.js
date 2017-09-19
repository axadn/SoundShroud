import React from "react";
import SessionFrom from "./session_form";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {postUserThunk} from "../../actions/user_actions";
import {postSessionThunk, clearSessionErrors} from "../../actions/session_actions";

const mapStateToProps = (state, ownProps) =>{
  const errors = state.errors.session
  let message;
  let buttonText;
  if(ownProps.match.path === "/login"){
    message = "Welcome back to SoundShroud";
    buttonText = "Log in";
  }
  else{
    message = "Sign up for SoundShroud";
    buttonText = "Sign Up";
  }
  return {
    message,
    buttonText,
    errors
  }
};
const mapDispatchToProps = (dispatch, ownProps) =>{
  const action = ownProps.match.path === "/login" ?
    postSessionThunk : postUserThunk;
  return {
    action: data => dispatch(action({user: data})),
    clearErrors: () => dispatch(clearSessionErrors())
  };
};

export default withRouter(connect(mapStateToProps,
   mapDispatchToProps)(SessionFrom));
