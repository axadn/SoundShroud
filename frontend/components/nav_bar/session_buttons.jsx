import React from "react";
import {NavLink} from "react-router-dom";

export default class SessionButtons extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      enabled: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  handleClick(e){
    e.stopPropagation();
    if(this.state.enabled){
      window.removeEventListener("click", this.handleClick);
    }
    else{
      window.addEventListener("click", this.handleClick);
    }
    this.setState(this.toggle);
  }
  toggle(state){
    return{enabled: !state.enabled};
  }
  render(){
    let button1, button2;
    const hidden = this.state.enabled? "" : "hidden";
    if(this.props.logged_in){
      button1 = <NavLink className="top_nav_link" to={"/upload"}>
         Upload</NavLink>;
      button2 = 
        <div className="drop-down-menu"
          ref="dropdown"
          onClick = {this.handleClick}>
          {this.props.current_user_id}
          <ul className={`${hidden}`}>
            <li><a href={`#/users/${this.props.current_user_id}`}>Profile</a></li>
            <li onClick={this.props.delete_session}>Log out</li>
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
