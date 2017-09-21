export const fetchTracks = userId => (
  $.ajax({method: "get", url `api/${userId}/track`}));

export const fetchTrack = id => (
  $.ajax({method: "get", url: `api/tracks/${id}`}));

export const postTrack = data => (
  $.ajax({method: "post", url: `api/tracks`,
  data, proccessData: false, contentType: false }));

export const deleteTrack = id => (
  $.ajax({method: "delete", url `api/tracks/${id}`}));
