import React from "react";

const CACHE_SIZE = 5;

const MID_CACHE_INDEX = Math.floor(CACHE_SIZE/2);

const shiftCache = amount =>(state, props) =>{
  const cache = [];
  for(let i = 0; i < CACHE_SIZE; ++ i){
    cache.push(state.cache[i + amount] ||
      props.playlist[props.indexInPlaylist + i - MID_CACHE_INDEX] );
  }
  if(state.audioSource){
    state.audioSource.pause();
  }
  return {cache, playing: false, waitingToPlay: true, audioSource: null};
};

const assignCacheFromNewPlaylist = playlist => (state, props) =>{
  const cache = [];
  for(let i = 0; i < CACHE_SIZE; ++i){
    cache.push({id: playlist[props.indexInPlaylist + i - MID_CACHE_INDEX]});
  }
  if(state.audioSource){
    state.audioSource.pause();
  }
  return{cache, playing: false, waitingToPlay: true, audioSource: null};
};

const assignAudioSource = (state, props)=>{
  if(state.loaded && !state.audioSource){
    const audioSource = document.querySelector("audio");
    audioSource.src = URL.createObjectURL(state.cache[MID_CACHE_INDEX].binaryData);
    // const audioSource = state.audioCtx.createBufferSource();
    // state.audioCtx.decodeAudioData(state.cache[MID_CACHE_INDEX].binaryData,
    //   buffer => {
    //   audioSource.buffer = buffer;
    //   audioSource.connect(state.audioCtx.destination);
    // });
    return {audioSource};
  }
  return {audioSource: state.audioSource};
}

const setIfLoaded = (state, props) => {
  return {loaded: Boolean(state.cache[MID_CACHE_INDEX].binaryData)}
}

const handleQueuedPlay = (state, props) => {
  if(state.waitingToPlay && !state.playing && state.loaded){
    state.audioSource.play();
    return {waitingToPlay: false, playing: true};
  }
}

const fetchForCache = player => (state, props) =>{
  const current = state.cache[MID_CACHE_INDEX];
  if(!current.id) return {};
  if(!current.binaryData && !current.fetching){
    props.fetchForCache(current, current.id, ()=>{
        player.setState(setIfLoaded);
        player.setState(assignAudioSource);
        player.setState(handleQueuedPlay);
        player.setState(fetchForCache(player));
      }
    );
    return;
  }
  // let i = MID_CACHE_INDEX + 1;
  // do{
  //   if(!this.state.cache[i].binaryData &&
  //     !this.state.cache[i].fetching){
  //     this.props.fetchForCache(this.state.cache[i],
  //       this.state.cache[i].id, this.fetchForCache);
  //     return;
  //   }
  // }while(i <= CACHE_SIZE && this.state.cache[i].id);
  // i = MID_CACHE_INDEX -1;
  // do{
  //   if(!this.state.cache[i].binaryData &&
  //     !this.state.cache[i].fetching){
  //     this.props.fetchForCache(this.state.cache[i],
  //       this.state.cache[i].id, this.fetchForCache);
  //     break;
  //   }
  // }while(i >= 0 && this.state.cache[i].id);
}

export default class AudioPlayer extends React.Component{
  constructor(props){
    super(props);
    const cache = [];
    for(let i = 0; i< CACHE_SIZE; ++i ){
      cache.push({id: undefined});
    }
    this.state = {
      position: 0,
      loaded: false,
      waitingToPlay: false,
      playing: false,
      cache,
      audioCtx: new (window.AudioContext || window.webkitAudioContext)(),
      audioSource: undefined
    };
  }

  componentWillReceiveProps(newProps){
    if(newProps.playing !== this.props.playing){
      if(newProps.playing){
        this.setState({waitingToPlay: true})
      }
      else{
        this.setState({playing: false});
        this.state.audioSource.pause();
      }
    }
    if(this.props.playlist === newProps.playlist){
      if (newProps.indexInPlaylist != this.props.indexInPlaylist){
        this.setState(shiftCache(newProps.indexInPlaylist - this.props.indexInPlaylist));
      }
    }
    else{
      this.setState(assignCacheFromNewPlaylist(newProps.playlist));
    }
    this.cacheHandleLoop();
  }
  cacheHandleLoop(){
    this.setState(setIfLoaded);
    this.setState(assignAudioSource);
    this.setState(handleQueuedPlay);
    this.setState(fetchForCache(this));
  }

  handlePlay(){
    this.props.startPlayback();
  }
  handleSeek(e){
    position  = e.target.clientX / e.target.offsetX;
    this.setState({position});
    this.setState((state,props)=>({waitingToPlay: state.playing}));
    this.cacheHandleLoop();
  }
  handlePause(){
    this.props.stopPlayback();
  }
  render(){
    return <div className = "audio-progress">
      <audio controls></audio>
    </div>;
  }
}
