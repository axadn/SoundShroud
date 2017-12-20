import React from "react";

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
    const rectWidth = width / this.props.samples.length;
    ctx.clearRect(0,0,width, height);
    let yOffset, xOffset;
    for(let i = 0; i < this.props.samples.length; ++i){
      ctx.fillStyle = "rgb(200, 200, 200)";
      xOffset = i * rectWidth;
      yOffset = height * (1 - this.props.samples[i]) / 2;
      ctx.fillRect(xOffset + 1, yOffset,rectWidth/2, this.props.samples[i] * height / 2);
      ctx.fillStyle = "rgb(70, 70, 70)";
      yOffset += this.props.samples[i] * height / 2;
      ctx.fillRect(xOffset, yOffset,rectWidth * 2/3, this.props.samples[i] * height / 2 )
    }
  }
  render(){
    return <canvas ref="canvas" onresize={this.updateCanvas}
    className="waveform-canvas"></canvas>;
  }
}
