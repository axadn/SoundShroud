import React from 'react';
import {connect} from 'react-redux';
import PlaybackTrackInfo from "./playback_track_info";

const mapStateToProps = (state, ownProps) =>{
    const index = state.entities.playlist.currentIndex;
    track: (index) ? 
            state.entities.tracks.tracks[state.entities.playlist.ids[index]] :
            null; 
};

export default connect(mapStateToProps)(PlaybackTrackInfo);