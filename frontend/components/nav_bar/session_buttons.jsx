import React from "react";
import {NavLink} from "react-router-dom";

export default ({delete_session, logged_in, current_user_id,
                 enable_login, enable_register}) =>{
  let logoutPlaceHolder, button1, button2;
  if(logged_in){
    logoutPlaceHolder = <button className="logout_button" onClick={e=>{
      e.preventDefault();
      delete_session();
    }} >Log Out</button>;
    button1 = <NavLink className="top_nav_link" to={"/upload"}>
         Upload</NavLink>
    button2 = <NavLink className="top_nav_link" to={`/users/${current_user_id}`}>
         Profile</NavLink>;
  }
  else{
    logoutPlaceHolder = null;
    button1 = <button onClick={enable_login}>Log In</button>;
    button2 = <button onClick={enable_register}>Sign Up</button>;
  }
  return(
  <div className="nav_link_set">
    {button1}
    {button2}
    {logoutPlaceHolder}
  </div>
  );
};
