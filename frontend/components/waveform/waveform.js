import React from "react";

export default class Waveform extends React.Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    this.updateCanvas();
  }
  updateCanvas(){
    const ctx = this.refs.canvas.getContext('2d');
    const width = this.refs.canvas.width;
    const height = this.refs.canvas.height;
    const rectWidth = width / this.props.samples.length;
    ctx.clearRect(0,0,width, height);
    ctx.fillStyle = "rgb(255, 255, 255)";
    let yOffset, xOffset;
    for(let i = 0; i < this.props.samples.length; ++i){
      xOffset = i * rectWidth;
      yOffset = height * (1 - this.props.samples[i]) / 2;
      ctx.fillRect(xOffset, yOffset,rectWidth, this.props.samples[i] * height);
    }
  }
  render(){
    return <canvas ref="canvas" className="waveform-canvas"></canvas>;
  }
}
