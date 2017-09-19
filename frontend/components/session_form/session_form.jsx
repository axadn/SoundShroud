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
  render (){
    return(
    <div className = "session_form">
      <h3>{this.props.message}</h3>
      <form onSubmit={this.handleSubmit}>
        <div>
          <span>username</span>
          <input type="text" onChange={
          this.handleChange("username")}></input>
        </div>
        <div>
          <span>password</span>
           <input type="password" onChange={
           this.handleChange("password")}></input>
        </div>
        <input type="submit" className="form_button blue_button" value={
            this.props.buttonText}></input>
      </form>
    </div>
    );
  }
}
