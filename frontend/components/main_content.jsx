import React from "react";
import SessionFormContainer from "./session_form/session_form_container";
import {Route} from "react-router-dom";
import {AuthRoute, ProtectedRoute} from "../utils/route_utils";
import LandingPageContainer from "./landing_page_container";
import TrackFormContainer from "./track/track_form_container";
import TrackShowContainer from "./track/track_show_container";
import UserShowContainer from "./user/user_show_container";
import DiscoverContainer from "./discover/discover_container";

export default props => (
  <div className="main_content" >
    <AuthRoute exact path="/" component={LandingPageContainer}></AuthRoute>
    <Route exact path = "/tracks/:trackId" component={TrackShowContainer}></Route>
    <Route exact path ="/users/:userId" component={UserShowContainer}></Route>
    <ProtectedRoute path="/upload" component={TrackFormContainer}></ProtectedRoute>
    <Route path="/discover" component={DiscoverContainer}></Route>
    <ProtectedRoute path="/tracks/:trackId/edit" component={TrackFormContainer}></ProtectedRoute>
  </div>
);
