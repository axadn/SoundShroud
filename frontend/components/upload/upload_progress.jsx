import React from "react";

export default class UploadProgress extends React.Component{

  componentDidUpdate(){
    //todo: draw canvas
  }
  render(){
    if(this.props.active){
      let errors;
      let completeButton;
      if(this.props.errors.general.length > 0){
        errors = <div className="uploadError">
          this.props.errors.general.join(", ");
        </div>
      }
      else if(this.props.complete){
        completeButton = <button onClick={()=>(
              this.props.recieveUploadCompleted())
            }></button>
      }
      return(
        <div className="upload_progress">
          <canvas className = "progress_bar"></canvas>
          {errors}
          {completeButton}
        </div>
      );
    }
    return null;
  }
}
