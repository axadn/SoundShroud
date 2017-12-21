export const RECEIVE_PLAYLIST = "RECEIVE_PLAYLIST";
export const RECEIVE_PLAYLIST_ID = "RECEIVE_PLAYLIST_ID";
export const FORWARD_PLAYBACK = "FORWARD_PLAYBACK";
export const BACK_PLAYBACK = "BACK_PLAYBACK";
export const PAUSE_PLAYBACK = "PAUSE_PLAYBACK";
export const START_PLAYBACK = "START_PLAYBACK";
import {receiveTracks} from "./track_actions";
import * as APIUtils from "../utils/api_playlist_utils";

export const receivePlaylist = ids => ({
  type: RECEIVE_PLAYLIST,
  payload: ids
});

export const receivePlaylistIndex = index => ({
  type: RECEIVE_PLAYLIST_ID,
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
