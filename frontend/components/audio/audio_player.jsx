import React from "react";
import AudioControlsContainer from "./audio_controls_container";
import {receivePlaylistId} from "../../actions/playlist_actions";
const CACHE_SIZE = 5;

const MID_CACHE_INDEX = Math.floor(CACHE_SIZE/2);

const shiftCache = amount =>(state, props) =>{
  const cache = [];
  for(let i = 0; i < CACHE_SIZE; ++ i){
    if(state.cache[i + amount] === undefined){
      cache.push({id:props.playlist[
        (props.indexInPlaylist + i - MID_CACHE_INDEX) % props.playlist.length
      ]});
    }
    else{
      cache.push(state.cache[i + amount]);
    }
  }
  state.audioSource.pause();
  return {cache, playing: false, waitingToPlay: true, srcIsValid: false};
};

const assignCacheFromNewPlaylist = (playlist, indexInPlaylist) => (state, props) =>{
  const cache = [];
  for(let i = 0; i < CACHE_SIZE; ++i){
    cache.push({id: playlist[(indexInPlaylist + i - MID_CACHE_INDEX) % playlist.length]});
  }
  state.audioSource.pause();
  return{cache, playing: false, waitingToPlay: true, srcIsValid: false};
};

const assignAudioSource = (state, props)=>{
  if(state.loaded && !state.srcIsValid){
    state.audioSource.src = URL.createObjectURL(state.cache[MID_CACHE_INDEX].binaryData);
    state.audioSource.currentTime = 0;
    return{srcIsValid: true};
  }
}
const invalidateCache = state => {
  const cache = state.cache;
  for(let i = 0; i < cache.length; ++i){
    cache[i].binaryData = null;
  }
  return {cache};
}
const receiveSongCacheData = payload => (state, props) =>{
  const cache = state.cache;
  for(let i = 0; i < cache.length; ++i){
    if(cache[i].id == payload.id){
      cache[i].binaryData = payload.binaryData;
    }
  }
  return {cache};
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
    props.currentlyLoadingAudioAction();
    props.fetchForCache(current.id, data=>{
        current.fetching = false;
        player.setState(receiveSongCacheData(data));
        player.setState(setIfLoaded);
        player.setState(assignAudioSource);
        player.setState(handleQueuedPlay);
        props.finishedLoadingAudioAction();
        player.setState(fetchForCache(player));
      }
    );
    current.fetching = true;
    return;
  }
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
      audioSource: document.querySelector("audio")
    };
  }

  componentWillReceiveProps(newProps){
    if(JSON.stringify(newProps.playlist) !==
       JSON.stringify(this.props.playlist)){
      this.setState(assignCacheFromNewPlaylist(newProps.playlist, newProps.indexInPlaylist));
    }
    else if(newProps.indexInPlaylist !== this.props.indexInPlaylist){
      if(this.props.indexInPlaylist === null){
        this.setState(assignCacheFromNewPlaylist(newProps.playlist, newProps.indexInPlaylist));
      }
      else{
        this.setState(shiftCache(newProps.indexInPlaylist - this.props.indexInPlaylist));
      }
    }
    if(newProps.playing !== this.props.playing){
      if(newProps.playing){
        this.setState({waitingToPlay: true})
      }
      else{
        this.setState({waitingToPlay: false,playing: false});
        this.state.audioSource.pause();
      }
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
      <AudioControlsContainer loaded={this.state.loaded} playing={this.props.playing}/>
    </div>;
  }
}
