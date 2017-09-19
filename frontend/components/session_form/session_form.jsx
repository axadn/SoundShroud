import React from "react";

export default class SessionFrom extends React.Component{
  constructor(props){
    super(props);
    this.state = {username: "", password: ""};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleExample = this.handleExample.bind(this);
  }
  handleChange(key){
    return e => this.setState({[key]: e.target.value});
  }
  handleExample(e){
    e.preventDefault();
    this.props.example();
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
        <div className ="session_submit_buttons">
          <input type="submit" onClick={this.handleExample}
            className="form_button blue_button" value="demo"></input>
          <input type="submit" className="form_button blue_button" value={
              this.props.buttonText}></input>
        </div>
      </form>
    </div>
    );
  }
}
