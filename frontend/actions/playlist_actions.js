export const RECEIVE_PLAYLIST = "RECEIVE_PLAYLIST";
export const RECEIVE_PLAYLIST_INDEX = "RECEIVE_PLAYLIST_ID";
export const FORWARD_PLAYBACK = "FORWARD_PLAYBACK";
export const BACK_PLAYBACK = "BACK_PLAYBACK";
export const PAUSE_PLAYBACK = "PAUSE_PLAYBACK";
export const START_PLAYBACK = "START_PLAYBACK";
export const RECEIVE_AUDIO_LOADED = "RECEIVE_AUDIO_LOADED";
export const RECEIVE_AUDIO_LOADING = "RECEIVE_AUDIO_LOADING";
export const COPY_PLAYLIST_FROM_PAGE = "COPY_PLAYLIST_FROM_PAGE";

import {receiveTracks} from "./track_actions";
import * as APIUtils from "../utils/api_playlist_utils";

export const receivePlaylist = payload => ({
  type: RECEIVE_PLAYLIST,
  payload
});
export const copyPlaylistFromPage = (id) =>({
  type: COPY_PLAYLIST_FROM_PAGE,
  payload: id
});
export const receivePlaylistIndex = index => ({
  type: RECEIVE_PLAYLIST_INDEX,
  payload: index
});

export const pausePlayback = () =>({
  type: PAUSE_PLAYBACK
});

export const startPlayback = () => ({
  type: START_PLAYBACK
});

export const forwardPlayback = () =>({
  type: FORWARD_PLAYBACK
});

export const backPlayback = () =>({
  type: BACK_PLAYBACK
});

export const fetchRandomPlaylistThunk = callback => dispatch => {
  APIUtils.fetchRandomPlaylist().then(tracks=> dispatch(
    receiveTracks(tracks)
  )).then(callback);

};

export const currentlyLoadingAudioAction = () =>({
  type: RECEIVE_AUDIO_LOADING
});

export const finishedLoadingAudioAction = () =>({
  type: RECEIVE_AUDIO_LOADED
});
