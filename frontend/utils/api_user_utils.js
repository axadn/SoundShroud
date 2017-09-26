export const postUser = data =>(
  $.ajax({method: "post", url: "/api/users", data})
);

export const fetchTrackCommentsUsers = trackId => (
  $.ajax({method: "get", url: `/api/tracks/${trackId}/users`})
);
