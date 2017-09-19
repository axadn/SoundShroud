import React from "react";
import SessionFormContainer from "./session_form/session_form_container";
import {Route} from "react-router-dom";
import {AuthRoute} from "../utils/route_utils";

export default props => (
  <div className="main_content">
  <AuthRoute exact path="/login" component={SessionFormContainer}>
  </AuthRoute>
  <AuthRoute exact path="/signup" component={SessionFormContainer}></AuthRoute>
  </div>
);
