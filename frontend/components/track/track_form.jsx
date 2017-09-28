import React from "react";

export default class TrackForm extends React.Component {
  componentWillUnmount(){
    this.props.clearParamsErrors();
  }
  componentWillReceiveProps(newProps){
    if(this.props.loading && !newProps.loading){
      this.setState(Object.assign({labelTitle: false,
        labelDescription: newProps.track.description.length === 0},
        newProps.track));
    }
  }
  constructor(props){
    super(props);
    this.state = this.props.initial_state;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }
  handleChange(key){
    return e => {
      e.preventDefault();
      this.setState({[key] : e.target.value});
    }
  }
  handleFileChange (e){
    this.setState({file: e.target.files[0]});
  }
  handleImageChange(e){
    this.setState({imageFile: e.target.files[0]});
  }
  handleSubmit (e){
    e.preventDefault();
    this.props.clearParamsErrors();
    this.props.formAction(this.state);
  }
  render(){
    let errorElements = {};
    let imageUrl = this.state.imageFile? URL.createObjectURL(this.state.imageFile) : "";
    let imageInputElement;

    Object.keys(this.props.errors).forEach(key => {
      errorElements[key] =
      <div className="errors">
        <svg height = "15" width = "15">
          <polygon points ="0,8 15,0 15,15" />
        </svg>
        <div>
          {this.props.errors[key].join(", ")}
          </div>
      </div>
    });
    if(this.props.loading) return null;
  const fileUploadElement = this.props.editing? undefined:
    <input type="file" onChange={this.handleFileChange}></input>;
  if (!this.props.editing){
    imageInputElement =
      <div className="image-input-container">
        <input className="image-input" type="file"
          onChange={this.handleImageChange}></input>
        <img src={imageUrl} className="medium-large cover-art"></img>
        <button className="blue_button"
          onClick={()=>document.querySelector(".image-input").click()}
          >change image</button>
      </div>
  }
  let imgSrc;
    return(
      <div className ="track-form-content">
        {imageInputElement}
        <div className ="floater2">
          <h2>{this.props.editing? "Edit your Track" : "Upload a Track"}</h2>
        <form className="track_form" onSubmit={this.handleSubmit}>
            <div>
              {fileUploadElement}
              {errorElements.file}
            </div>
            <label>Title</label>
            <div>
              <input type="text"
                value={this.state.labelTitle? "Name your track" : this.state.title}
                onChange={this.handleChange("title")}
                onFocus={()=> this.setState({labelTitle: false})}
                onBlur={()=>this.setState({labelTitle: this.state.title.length ===0})}></input>
                {errorElements.title}
            </div>

            <label>Description</label>
            <div>
              <textArea
                value={this.state.labelDescription? "Describe your track" : this.state.description}
                onFocus={()=> this.setState({labelDescription: false})}
                onBlur={()=>this.setState({labelDescription: this.state.description.length ===0})}
                onChange={this.handleChange("description")}></textArea>
              {errorElements.description}
            </div>

            <input type="submit" className = "blue_button"
              value={this.props.editing ? "Update" : "Upload"}></input>
          </form>
        </div>
      </div>
    );
  }
}
