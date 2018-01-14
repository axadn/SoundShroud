import React from 'react';
import {connect} from 'react-redux';
import PlaybackTrackInfo from "./playback_track_info";

const mapStateToProps = (state, ownProps) =>{
    const index = state.entities.tracks.playlistIndex;
    return{
        track: (index != null && index != undefined) ? 
            state.entities.tracks.tracks[state.entities.tracks.playlistIds[index]] :
            null
    };
};

export default connect(mapStateToProps)(PlaybackTrackInfo);