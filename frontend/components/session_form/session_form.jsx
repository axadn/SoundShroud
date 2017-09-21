import React from "react";

export default class SessionFrom extends React.Component{
  constructor(props){
    super(props);
    this.state = {username: "", password: "", label_username: true,
    label_password: true};
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
  componentDidMount(){
    document.getElementById('guit_filter_in').beginElement();
  }
  componentWillUnmount(){
    this.props.clearErrors();
  }
  render (){
    let generalErrors;
    let passwordErrors;
    let usernameErrors;
    const passwordEmpty = this.state.password.length === 0;
    const usernameEmpty = this.state.username.length === 0;
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
    <div className = "session_form_window">
      <img src="/assets/guit blue.jpeg" ></img>
      <div className = "session_form">
        <h3>{this.props.message}</h3>
        <div className="errors">{generalErrors}</div>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input type="text"
              onFocus={e => {
                if(usernameEmpty){
                  this.setState({label_username : false})
                }
              }}
              onBlur ={e => {
                if(this.state.username.length === 0){
                  this.setState({label_username: true})
                }
              }}
              className={this.state.label_username ? "empty" : ""}
              onChange={this.handleChange("username")}
              value = {this.state.label_username? "Username" : this.state.username }
            ></input>
          <div className="errors">{usernameErrors}</div>
          </div>
          <div>
             <input type={this.state.label_password ? "text" : "password"}
              onFocus ={ e => {
                  this.setState({label_password: false})
                }
              }
              onBlur ={e => {
                if(this.state.password.length === 0){
                  this.setState({label_password: true})
                }
              }}
              onChange={this.handleChange("password")}
              className={this.state.label_password ? "empty" : ""}
              value = {this.state.label_password? "Password" : this.state.password}
            ></input>
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



      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="guit_filter" color-interpolation-filters="linearRGB">
            <feColorMatrix  type="matrix">
              <animate id="guit_filter_in" attributeName="values"
                attributeType="XML" begin="indefinite" dur="3"
                 end="indefinite"
                 from="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
                 to="0.5 0.5 0.5 0 0
              0.6 0.6 0.6 0 0
              0.7 0.4 0.4 0 0
              0 0 0 1 0 "
                fill="freeze" />
            </feColorMatrix>
          </filter>
        </defs>
      </svg>
    </div>
    );
  }
}
