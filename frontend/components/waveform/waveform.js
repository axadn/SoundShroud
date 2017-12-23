import React from "react";

const DEFAULT_SAMPLES = [];
const BUFFER_LENGTH =2048;
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
    window.addEventListener("resize", this.updateCanvas);
    this.mounted = true;
    this.updateCanvas();
  }
  componentWillUnmount(){
    window.removeEventListener("resize", this.updateCanvas);
    this.mounted = false;
    this.dataArray = null;
  }
  componentWillReceiveProps(newProps){
    if(newProps.currentlyPlaying && !this.dataArray){
      this.dataArray = new Uint8Array(BUFFER_LENGTH);
    }
    else if(this.props.currentlyPlaying && !newProps.currentlyPlaying){
      this.dataArray = null;
    }
  }
  componentDidUpdate(){
    if(this.props.currentlyPlaying){
      this.updateCanvas();
    }
  }
  updateCanvas(){
    if(!this.mounted) return;
    if(this.props.currentlyPlaying && !this.dataArray)
      this.dataArray = new Uint8Array(BUFFER_LENGTH);
    let colors, intensities, intensity,
    r, g, b;
    if(this.props.currentlyPlaying){
      this.props.audioAnalyser.getByteTimeDomainData(this.dataArray);
      window.requestAnimationFrame(this.updateCanvas);
      const sampleFrequency = Math.floor(this.dataArray.length / this.props.samples.length);
      colors = [];
      intensities= [];
      for(let i = 0; i < this.dataArray.length; i += sampleFrequency){
        intensity = Math.abs(128.0 - this.dataArray[i])/128.0;
        intensities.push(intensity);
        r = intensity > 0.2 ? 230 : 149;
        g = intensity > 0.2 ? 230 : 187;
        b = intensity > 0.2 ? 230 : 193;
        colors.push(`rgb(${r}, ${g}, ${b})`);
      }
    }

    else{
      colors = this.props.samples.map(sample=>"rgb(200, 200, 200)");
    }
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
    let topHeight;
    for(let i = 0; i < samples.length; ++i){
      ctx.fillStyle = colors[i];
      xOffset = i * rectWidth;
      yOffset = height * (1 - samples[i]) / 2;
      topHeight = samples[i] * height / 2;
      let topOffset = yOffset;
      if(this.props.currentlyPlaying){
        topHeight = intensities[i] * height;
        topOffset = height * (1 - intensities[i])/2;
      }
      ctx.fillRect(xOffset + 1, topOffset,rectWidth/2, topHeight);
      if(!this.props.currentlyPlaying){
        ctx.fillStyle = "rgb(70, 70, 70)";
        yOffset += samples[i] * height / 2;
        ctx.fillRect(xOffset, yOffset,rectWidth * 0.65, samples[i] * height / 2 );
      }
    }
  }
  render(){
    return <canvas ref="canvas"
    className="waveform-canvas"></canvas>;
  }
}
