import React from "react";

export default props => {
  return(
    <div className={`document-play-button ${props.large ? "large" : "small"}`}
       onClick={handlePlayButton(props)}>
      <img className={currentlyPlaying(props)? "":"hidden"}
        src= {window.pause_img_url}></img>
      <img className={currentlyPlaying(props)? "hidden":""}
        src= {window.play_img_url}></img>
    </div>
  );
};

const handlePlayButton = props => ()=> {
  if(props.current_in_playlist){
    if(props.playing){
      props.pauseTrack();
    }
    else{
      props.resumeTrack();
    }
  }
  else{
    const trackIds = Object.keys(props.tracksOnPage);
    props.dispatchPlaylist(trackIds);
    props.playlistItemByIndex(trackIds.indexOf(props.trackId.toString()));
  }
};

const currentlyPlaying = props => {
  return props.current_in_playlist && props.playing;
};
