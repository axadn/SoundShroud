import React from "react";
import SessionFrom from "./session_form";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {postUserThunk} from "../../actions/user_actions";
import {postSessionThunk, clearSessionErrors} from "../../actions/session_actions";

const mapStateToProps = (state, ownProps) =>{
  const errors = state.errors.session
  let message, buttonText, login;
  if(state.authModal.login){
    message = "Welcome back to SoundShroud";
    buttonText = "Log In";
    login = true;
  }
  else{
    message = "Sign up for SoundShroud";
    buttonText = "Sign Up";
    login = false;
  }
  return {
    login,
    message,
    buttonText,
    errors
  }
};
const mapDispatchToProps = (dispatch, ownProps) =>{
  return {
    dispatch,
    example: () => dispatch(postSessionThunk({user:{username: "example",
            password: "password"}})),
    clearErrors: () => dispatch(clearSessionErrors())
  };
};
const mergeProps = (propsFromState, propsFromDispatch) =>{
  const action = propsFromState.login ? postSessionThunk : postUserThunk;
  const newProps = {
    action: data => propsFromDispatch.dispatch(action({user: data}))};
  return Object.assign(propsFromState, propsFromDispatch, newProps);
};

export default withRouter(connect(mapStateToProps,
   mapDispatchToProps, mergeProps)(SessionFrom));
