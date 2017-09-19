import {logged_in} from "../reducers/selectors";
import {withRouter, Route, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import React from "react";

const Auth = ({component: Component, path, loggedIn}) => (
  <Route path={path} render={(props) => (
    !loggedIn ? (
      <Component {...props}/>
    ) : (
      <Redirect to="/" />
    )
  )}/>
);


const Protected =({component: Component, path, loggedIn}) =>(
  <Route path={path} render={ (props) =>(
    loggedIn ?(
      <Component {...props}/>
    ) : (
      <Redirect to="/login"/>
    )
  )}/>
);
const mapStateToProps = state => {
  return {loggedIn: logged_in(state)}
};

export const AuthRoute = withRouter(connect(mapStateToProps)(Auth));
export const ProtectedRoute = withRouter(connect(mapStateToProps)(Auth));
