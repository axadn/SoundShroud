import React from "react";

export default class SessionFrom extends React.Component{
  constructor(props){
    super(props);
    this.state = {username: "", password: ""};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(key){
    return e => this.setState({[key]: e.target.value});
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.action(this.state);
  }
  componentWillUnmount(){
    this.props.clearErrors();
  }
  render (){
    let generalErrors;
    let passwordErrors;
    let usernameErrors;
    if(this.props.errors.general){
      generalErrors = this.props.errors.general.join(", ");
    }
    if(this.props.errors.password){
      passwordErrors = this.props.errors.password.join(", ");
    }
    if(this.props.errors.username){
      usernameErrors = this.props.errors.username.join(", ");
    }
    return(
    <div className = "session_form">
      <h3>{this.props.message}</h3>
      <div className="errors">{generalErrors}</div>
      <form onSubmit={this.handleSubmit}>
        <div>
          <span>username</span>
          <input type="text" onChange={
          this.handleChange("username")}></input>
        <div className="errors">{usernameErrors}</div>
        </div>
        <div>
          <span>password</span>
           <input type="password" onChange={
           this.handleChange("password")}></input>
         <div className="errors">{passwordErrors}</div>
        </div>
        <input type="submit" className="form_button blue_button" value={
            this.props.buttonText}></input>
      </form>
    </div>
    );
  }
}
