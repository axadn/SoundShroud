export const generatePlaylist = trackId =>
  $.ajax({method: "get", url: `/api/playlists/tracks/${trackId}` });
