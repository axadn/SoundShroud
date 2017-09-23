import React from "react";
import SessionFormContainer from "./session_form/session_form_container";
import {Route} from "react-router-dom";
import {AuthRoute, ProtectedRoute} from "../utils/route_utils";
import LandingPage from "./landing_page";
import UploadFormContainer from "./upload/upload_form_container";

export default props => (
  <div className="main_content" >
    <AuthRoute exact path="/" component={LandingPage}></AuthRoute>
    <AuthRoute exact path="/login" component={SessionFormContainer}></AuthRoute>
    <AuthRoute exact path="/signup" component={SessionFormContainer}></AuthRoute>
    <ProtectedRoute path="/upload" component={UploadFormContainer}></ProtectedRoute>
  </div>
);
