import React from "react";

export default class AudioControls extends React.Component{
  handleTimeChange(audioElement){
    return () => this.setState({progress:audioElement.currentTime/audioElement.duration});
  }
  constructor(props){
    super(props);
    this.handleStartSeeking = this.handleStartSeeking.bind(this);
    this.handleSeeking = this.handleSeeking.bind(this);
    this.handleStopSeeking = this.handleStopSeeking.bind(this);
    this.assignCanvas = this.assignCanvas.bind(this);
    this.audioElement = document.querySelector("audio");
    this.assignCanvasContainer = this.assignCanvasContainer.bind(this);
  }
  componentWillMount(){
    this.state = {progress: 0};
    const audioElement = document.querySelector("audio");
    audioElement.addEventListener("timeupdate", this.handleTimeChange(audioElement));
  }
  assignCanvasContainer(cont){
    this.canvasCont = cont;
  }
  assignCanvas(canvas){
    this.canvas = canvas;
    this.canvasCtx = canvas.getContext('2d');
  }
  render(){
    const playButton =( <svg
      viewBox= "0,0,50,50"
      onClick={()=> {
        if(this.props.loaded) this.props.playAction();
      }}>
          <polygon points="0,0 50,25 0,50"
            fill="white" />
          </svg>
        );
    const forwardButton =( <svg
      viewBox= "0,0,50,50"
    onClick={this.props.forwardAction}>
    <polygon points="0,10 25,25 0,40" fill="white"/>
    <polygon points="25,10 50,25 25,40" fill="white"/>
        </svg>
      );
    const pauseButton =( <svg
      viewBox= "0,0,50,50"
    onClick={this.props.pauseAction}>
    <polygon points="0,0 20,0 20,50 0,50" fill="white"/>
    <polygon points="30,0 50,0 50,50 30,50" fill="white"/>
        </svg>
        );
  const backButton =(<svg
    viewBox= "0,0,50,50"
  onClick={this.props.backAction}>
  <polygon points="50,10 25,25 50,40" fill="white"/>
  <polygon points="25,10 0,25 25,40" fill="white"/>
      </svg>
      );
    return(
    <div id="audio-controls-content" className={this.props.loaded ? "active" : ""}>
      <div className="controls">
        <div>{backButton}</div>
        <div>{this.props.playing? pauseButton : playButton}</div>
        <div>{forwardButton}</div>
      </div>
      <div id="audio-progress">
        <div id="audio-current-time" className={this.props.loaded ? "active" : ""}>
          {this.props.loaded? this.formatTime(this.audioElement.currentTime) :
            this.formatTime(0)}
        </div>
        <div id="audio-seek-container"
          className={this.props.loaded ? "active" : ""}
          ref={this.assignCanvasContainer}
          onMouseDown={this.handleStartSeeking}>
          <canvas id="audio-seek-canvas"
            ref={this.assignCanvas}></canvas>
        </div>
        <div id="audio-duration" className={this.props.loaded ? "active" : ""}>
          {this.props.loaded? this.formatTime(this.audioElement.duration) :
            this.formatTime(0)}
        </div>
      </div>
  </div>);
  }
  componentDidUpdate(){
    this.drawCanvas();
  }
  formatTime(seconds){
    const minutes = Math.floor(seconds/60);
    const secs = Math.floor(seconds % 60);
    if (isNaN(minutes)){
      return "0:00";
    }
    return `${minutes}:${secs < 10 ? "0": ""}${secs}`
  }
  drawCanvas(){
    const width = this.canvas.width;
    const progressX = this.canvas.width * this.state.progress;
    const height = this.canvas.height;
    this.canvasCtx.fillStyle = "#3f3f3f";
    this.canvasCtx.fillRect(0,0,width, height);
    if(this.props.loaded){
      this.canvasCtx.fillStyle = "#0c70ae";
      this.canvasCtx.fillRect(0,0,progressX, height);
    }

  }

  handleStartSeeking(e){
    if(e.button !== 0) return;
    e.preventDefault();
      this.handleSeeking(e);
      if(this.props.playing) this.audioElement.pause();
        window.addEventListener("mouseup", this.handleStopSeeking);
        window.addEventListener("mousemove", this.handleSeeking);
  }

  handleStopSeeking(e){
    e.preventDefault();
      if(this.props.playing) this.audioElement.play();
      window.removeEventListener("mouseup", this.handleStopSeeking);
      window.removeEventListener("mousemove", this.handleSeeking);
  }

  handleSeeking(e){
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const rectWidth = rect.right - rect.left;
    let x = e.clientX - rect.left;
    if(x < 0) x = 0;

      this.audioElement.currentTime = x /rectWidth * this.audioElement.duration;
  }
}
