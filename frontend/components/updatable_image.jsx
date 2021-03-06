import React from "react";


export default class UpdatableImage extends React.Component{
  constructor(props){
    super(props);
    this.state = {src: false};
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e){
    const file = e.target.files[0];
    this.setState({src: URL.createObjectURL(file)});
    URL.revokeObjectURL(this.props.src);
    this.props.postAction(file);
  }
  render(){
    let button;
    if (this.props.editable){
      button =<button className="blue_button"
         onClick={()=> document.getElementById(this.props.inputId).click()}>
         Update Image</button>;
    }
    const src = this.state.src || this.props.src;
    return(
    <div className={"image-input-container" }>
      <input type="file" className="image-input"
        id={this.props.inputId}
        onChange={this.handleChange}></input>
      <img src={src}
        className={`${this.props.size? this.props.size : ""} cover-art`}>

      </img>
      {button}
    </div>
    );
  }

}
