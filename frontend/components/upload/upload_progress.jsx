import React from "react";

export default class UploadProgress extends React.Component{
  componentDidUpdate(){
    const canvas = document.getElementById("progress_bar");
    const ctx = canvas.getContext("2d");
    const xAmount1 = canvas.width * this.props.progress;
    ctx.fillStyle = "#2d7387";
    ctx.fillRect(0,0, xAmount1, canvas.height);
    if( this.props.progress < 1){
      ctx.fillStyle = "white";
      ctx.fillRect(xAmount1,0, canvas.width - xAmount1, canvas.height);
    }
  }
  render(){
    if(this.props.active){
      let message;
      if(this.props.errors.general.length > 0){
        message = <div className="upload_error">
          <a>
            {this.props.errors.general.join(", ")}
          </a>
          <button className="red_button"
            onClick={()=>(
                this.props.setInactive())
              }>OK</button>
        </div>
      }
      else if(this.props.progress === 1){
        if(this.props.processed){
          message = <div>
            <a>Upload Complete</a>
            <button className="blue_button"
              onClick={()=>(
                  this.props.setInactive())
                }>OK</button>
          </div>
        }
        else{
          message =
          <a>
            Processing...
          </a>
        }
      }
      else{
        message = <a>
          Uploading...
        </a>
      }
      return(
        <div id="upload_progress">
          {message}
          <canvas id="progress_bar"></canvas>
          <div></div>
        </div>
      );
    }
    return null;
  }
}
