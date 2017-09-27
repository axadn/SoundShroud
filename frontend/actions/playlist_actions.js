export const RECEIVE_PLAYLIST = "RECEIVE_PLAYLIST";
export const PAUSE_PLAYBACK = "PAUSE_PLAYBACK";
export const START_PLAYBACK = "START_PLAYBACK";

export const receivePlaylist = ids => ({
  type: RECEIVE_PLAYLIST,
  payload: ids
});

export const pausePlayback = () =>({
  type: PAUSE_PLAYBACK
});

export const startPlayback = () => ({
  type: START_PLAYBACK
});
