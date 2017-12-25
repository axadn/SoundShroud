import React from "react";

const DEFAULT_SAMPLES = [];
const UPPER_COLOR = "rgb(200, 200, 200)";
const LOWER_COLOR = "rgb(70, 70, 70)";
const BUFFER_LENGTH = 512;
const OSCILLOSCOPE_SAMPLE_COUNT = 64;
const OSCILLOSCOPE_SAMPLE_LENGTH = Math.floor(BUFFER_LENGTH / OSCILLOSCOPE_SAMPLE_COUNT);
for(let i = 0; i < 16; ++i){
  DEFAULT_SAMPLES.push(0.25);
  DEFAULT_SAMPLES.push(0.5);
  DEFAULT_SAMPLES.push(0.15);
  DEFAULT_SAMPLES.push(0.5);
}
export default class Waveform extends React.Component{
  constructor(props){
    super(props);
    this.loadingDataArray = [];
    this.previewCenterIndex = 0;
    for(let i = 0; i < OSCILLOSCOPE_SAMPLE_COUNT; ++i){
      this.loadingDataArray.push(0);
    }
    this.drawFullWaveForm = this.drawFullWaveForm.bind(this);
    this.drawOscilloscope = this.drawOscilloscope.bind(this);
    this.updateCanvasHeight = this.updateCanvasHeight.bind(this);
  }
  componentDidMount(){
    window.addEventListener("resize", this.updateCanvasHeight);
    this.mounted = true;
    console.log(this.props.currentlyPlaying)
    if(this.props.currentlyPlaying){
      if(!this.dataArray) this.dataArray = new Uint8Array(BUFFER_LENGTH);
      this.drawOscilloscope();
    }
    else{
        this.drawFullWaveForm();
    }
  }
  componentWillUnmount(){
    window.removeEventListener("resize", this.updateCanvasHeight);
    this.mounted = false;
    this.dataArray = null;
  }
  componentWillReceiveProps(newProps){
    if(!newProps.currentlyPlaying){
      this.dataArray = null;
      this.drawFullWaveForm();
    }
    else if(newProps.currentlyPlaying){
      this.dataArray = new Uint8Array(BUFFER_LENGTH);
      this.drawOscilloscope();
    }
  }
  updateCanvasHeight(){
    this.refs.canvas.width = this.refs.canvas.clientWidth;
    this.refs.canvas.heigth = this.refs.canvas.clientHeight;
    if(!this.props.currentlyPlaying) this.drawFullWaveForm();
  }
  drawFullWaveForm(){
    if(!this.mounted) return;
    const samples = this.props.samples || DEFAULT_SAMPLES;
    const width = this.refs.canvas.width;
    const height = this.refs.canvas.height;
    const halfHeight = height/ 2;
    const ctx = this.refs.canvas.getContext('2d');
    const rectWidth = width / samples.length;

    ctx.clearRect(0,0,width, height);
    let yOffset, rectHeight;

    ctx.fillStyle = UPPER_COLOR;
    for(let i = 0; i < samples.length; ++i){
      yOffset = height * (1 - samples[i]) / 2;
      rectHeight = samples[i] * height / 2;
      ctx.fillRect(rectWidth * i + 1, yOffset, rectWidth/2, rectHeight);
    }
    ctx.fillStyle = LOWER_COLOR;
    for(let i = 0; i < samples.length; ++i){
      ctx.fillRect(rectWidth * i, halfHeight,rectWidth * 0.65, samples[i] * height / 2 );
    }

  }
  drawOscilloscope(timestamp = 0){
    if(!this.dataArray || !this.mounted) return;
    this.lastTimeStamp = this.lastTimeStamp || timestamp;

    const width = this.refs.canvas.width;
    const height = this.refs.canvas.height;
    const halfHeight = height/ 2;
    const ctx = this.refs.canvas.getContext('2d');
    const rectWidth = width / OSCILLOSCOPE_SAMPLE_COUNT;
    const topWidth = rectWidth/2;
    const bottomWidth = rectWidth * 0.65;

    ctx.clearRect(0,0,width, height);

    let dataArray;
    let sampleLength;
    if(this.props.loading){
      sampleLength = 1;
      dataArray = this.loadingDataArray;
      this.previewCenterIndex += (timestamp - this.lastTimeStamp) / 200.0;
      if(this.previewCenterIndex > this.loadingDataArray.length){
        this.previewCenterIndex -=
          Math.floor(this.previewCenterIndex /
             this.loadingDataArray.length) * this.loadingDataArray.length;
      }
      for(let i = 0; i < this.loadingDataArray.length; ++i){
        if(i === Math.floor(this.previewCenterIndex)){
          this.loadingDataArray[i] = 256;
        }
        else{
          this.loadingDataArray[i] = 128;
        }
      }
    }
    else{
      sampleLength = OSCILLOSCOPE_SAMPLE_LENGTH;
      dataArray = this.dataArray;
      this.props.audioAnalyser.getByteTimeDomainData(this.dataArray);
    }


    let sample;
    let sampleNumber = 0;
    for(let i = 0; i < dataArray.length; i += sampleLength){
      sample = dataArray[i];
      ctx.fillStyle = (sample > 128) ? UPPER_COLOR : LOWER_COLOR;
      ctx.fillRect(rectWidth * sampleNumber, halfHeight,
         (sample > 128) ? topWidth : bottomWidth,
          halfHeight * ((128  - sample) / 128.0));
      ++sampleNumber;
    }
    this.lastTimeStamp = timestamp;
    window.requestAnimationFrame(this.drawOscilloscope);
  }
  // updateCanvas(){
  //
  //   if(this.props.currentlyPlaying && !this.dataArray)
  //
  //   let colors, intensities, intensity,
  //   r, g, b;
  //   if(this.props.currentlyPlaying){
  //
  //     window.requestAnimationFrame(this.updateCanvas);
  //     const sampleFrequency = Math.floor(this.dataArray.length / this.props.samples.length);
  //     colors = [];
  //     intensities= [];
  //     for(let i = 0; i < this.dataArray.length; i += sampleFrequency){
  //       intensity = Math.abs(128.0 - this.dataArray[i])/128.0;
  //       intensities.push(intensity);
  //       r = intensity > 0.2 ? 230 : 149;
  //       g = intensity > 0.2 ? 230 : 187;
  //       b = intensity > 0.2 ? 230 : 193;
  //       colors.push(`rgb(${r}, ${g}, ${b})`);
  //     }
  //   }
  //
  //   else{
  //     colors = this.props.samples.map(sample=>"rgb(200, 200, 200)");
  //   }
  //}
  render(){
    return <canvas ref="canvas"
    className="waveform-canvas"></canvas>;
  }
}
