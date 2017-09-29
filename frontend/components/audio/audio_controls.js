import React from "react";

export default class AudioControls extends React.Component{
  handleTimeChange(audioElement){
    return () => this.setState({progress:audioElement.currentTime/audioElement.duration});
  }
  componentWillMount(){
    this.state = {progress: 0}
    const audioElement = document.querySelector("audio");
    audioElement.addEventListener("timeupdate", this.handleTimeChange(audioElement));
  }
  render(){
    return <canvas></canvas>;
  }
}
