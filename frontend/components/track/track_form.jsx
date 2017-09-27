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
    this.props.clearParamsErrors();
    this.props.formAction(this.state);
  }
  render(){
    let errorElements = {};
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
  let imgSrc;
    return(
      <div className ="track_form_content">
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
