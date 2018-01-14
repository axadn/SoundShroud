import React from "react";
import {NavLink} from "react-router-dom";

export default class SessionButtons extends React.Component{
  render(){
    let button1, button2;
    if(this.props.logged_in){
      button1 = <NavLink className="top_nav_link" to={"/upload"}>
         Upload</NavLink>;
      button2 = 
        <div className="drop-down-menu">
          {this.props.current_user_id}
          <ul>
            <li>Profile</li>
            <li>Log out</li>
          </ul>
        </div>;
    }
    else{
      button1 = <div className="top_nav_link"
       onClick={this.props.enable_login}>Log In</div>;
      button2 = <div className="top_nav_link"
       onClick={this.props.enable_register}>Sign Up</div>;
    }
    return(
      <div className="nav_link_set">
        {button1}
        {button2}
      </div>
      );
  }
}
// export default ({delete_session, logged_in, current_user_id,
//                  enable_login, enable_register}) =>{
//   let logoutPlaceHolder, button1, button2;
//   if(logged_in){
//     logoutPlaceHolder = 
//     <div className="logout_button_container">
//       <button className="logout_button" onClick={e=>{
//         e.preventDefault();
//         delete_session();
//         }} >Log Out
//       </button>
//     </div>;
    
//     button2 = <NavLink className="top_nav_link" to={`/users/${current_user_id}`}>
//          Profile</NavLink>;
//   }
//   else{
//     logoutPlaceHolder = null
//   }
// };
