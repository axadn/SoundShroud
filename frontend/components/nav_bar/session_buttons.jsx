import React from "react";
import {NavLink} from "react-router-dom";

export default ({delete_session, logged_in, current_user_id}) =>{
  let logoutPlaceHolder;
  if(logged_in){
    logoutPlaceHolder = <button className="logout_button" onClick={e=>{
      e.preventDefault();
      delete_session();
    }} >Log Out</button>
  }
  else{
    logoutPlaceHolder = null;
  }
  return(
  <div className="nav_link_set">
    {logoutPlaceHolder}
    <NavLink className="top_nav_link" to={logged_in ? "/upload" : "/login"}>
      {logged_in ? "Upload" : "Log In"}
    </NavLink>
    <NavLink className="top_nav_link" to={logged_in ? `/users/${current_user_id}` : "/signup"}>
      {logged_in ? "Profile" : "Sign Up"}
    </NavLink>
  </div>
  );
};
