export const generatePlaylist = trackId =>
  $.ajax({method: "get", url: `/api/playlists/tracks/${trackId}` });

export const fetchRandomPlaylist = () =>
  $.ajax({method: "get", url: `/api/playlists/random`});
