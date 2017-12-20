import {logged_in, current_user_id} from "../reducers/selectors";
import {withRouter, Route, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import React from "react";

const Auth = ({component: Component, path, loggedIn, current_user_id}) => (
  <Route  exact path={path} render={(props) => (
    !loggedIn ? (
      <Component {...props}/>
    ) : (
      <Redirect to={`/users/${current_user_id}`} />
    )
  )}/>
);


const Protected =({component: Component, path, loggedIn}) =>(
  <Route exact path={path} render={ (props) =>(
    loggedIn ?(
      <Component {...props}/>
    ) : (
      <Redirect to="/"/>
    )
  )}/>
);
const mapStateToProps = state => {
  return {loggedIn: logged_in(state), current_user_id: current_user_id(state)}
};

export const AuthRoute = withRouter(connect(mapStateToProps)(Auth));
export const ProtectedRoute = withRouter(connect(mapStateToProps)(Protected));
export const redirectToUser = id => () =>(location.hash =`/users/${id}`);
