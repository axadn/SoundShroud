import React from "react";

export default class UploadForm extends React.Component {
  componentWillUnmount(){
    this.props.clearParamsErrors();
  }
  constructor(props){
    super(props);
    this.state = {
      title: "",
      description: "",
      file: undefined,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }
  handleChange(key){
    return e => {
      e.preventDefault();
      this.setState({[key] : e.target.value});
    }
  }
  handleFileChange (e){
    this.state.file = e.target.files[0];
  }
  handleSubmit (e){
    e.preventDefault();
    this.props.verifyThenPost(this.state);
  }
  render(){

    return(
      <form onSubmit={this.handleSubmit}>
        <input type="text" onChange={this.handleChange("title")}></input>
        <textArea onChange={this.handleChange("description")}></textArea>
        <input type="file" onChange={this.handleFileChange}></input>
        <input type="submit" className = "blue_button" value="Upload"></input>
      </form>
    );
  }
}
