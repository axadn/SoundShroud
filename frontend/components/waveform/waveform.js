import React from "react";

const DEFAULT_SAMPLES = [];
for(let i = 0; i < 16; ++i){
  DEFAULT_SAMPLES.push(0.25);
  DEFAULT_SAMPLES.push(0.5);
  DEFAULT_SAMPLES.push(0.15);
  DEFAULT_SAMPLES.push(0.5);
}
export default class Waveform extends React.Component{
  constructor(props){
    super(props);
    this.updateCanvas = this.updateCanvas.bind(this);
  }
  componentDidMount(){
    this.setState({resizeId: window.addEventListener("resize", this.updateCanvas)});
    this.updateCanvas();
  }
  updateCanvas(){
    const ctx = this.refs.canvas.getContext('2d');
    this.refs.canvas.width = this.refs.canvas.clientWidth;
    this.refs.canvas.heigth = this.refs.canvas.clientHeight;
    const width = this.refs.canvas.width;
    const height = this.refs.canvas.height;
    let samples;
    if(this.props.samples){
      samples = this.props.samples;
    }
    else{
      samples = DEFAULT_SAMPLES;
    }
    const rectWidth = width / samples.length;
    ctx.clearRect(0,0,width, height);
    let yOffset, xOffset;
    for(let i = 0; i < samples.length; ++i){
      ctx.fillStyle = "rgb(200, 200, 200)";
      xOffset = i * rectWidth;
      yOffset = height * (1 - samples[i]) / 2;
      ctx.fillRect(xOffset + 1, yOffset,rectWidth/2, samples[i] * height / 2);
      ctx.fillStyle = "rgb(70, 70, 70)";
      yOffset += samples[i] * height / 2;
      ctx.fillRect(xOffset, yOffset,rectWidth * 0.65, samples[i] * height / 2 )
    }
  }
  render(){
    return <canvas ref="canvas"
    className="waveform-canvas"></canvas>;
  }
}
