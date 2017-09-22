import React from "react";
import SessionFormContainer from "./session_form/session_form_container";
import {Route} from "react-router-dom";
import {AuthRoute} from "../utils/route_utils";
import LandingPage from "./landing_page";

export default props => (
  <div className="main_content">
    <Route exact path="/" component={LandingPage}></Route>
    <AuthRoute exact path="/login" component={SessionFormContainer}>
    </AuthRoute>
    <AuthRoute exact path="/signup" component={SessionFormContainer}></AuthRoute>
  </div>
);
