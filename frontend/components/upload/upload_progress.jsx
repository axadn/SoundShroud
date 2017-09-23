import React from "react";

export default class UploadProgress extends React.Component{
  componentDidUpdate(){
    const canvas = document.getElementById("progress_bar");
    const ctx = canvas.getContext("2d");
    const xAmount1 = canvas.width * this.props.progress;
    ctx.fillStyle = "green";
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
        message = <div className="uploadError">
          this.props.errors.general.join(", ");
          <button className="red_button"
            onClick={()=>(
                this.props.setInactive())
              }>OK</button>
        </div>
      }
      else if(this.props.progress === 1){
        message =
        <div>
          Upload Complete
          <button className="blue_button"
            onClick={()=>(
                this.props.setInactive())
              }>OK</button>
        </div>

      }
      return(
        <div id="upload_progress">
          <canvas id="progress_bar"></canvas>
          {message}
        </div>
      );
    }
    return null;
  }
}
