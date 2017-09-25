export const fetchComments = trackId => (
  $.ajax({
    method: "get",
    url: `api/tracks/${trackId}/comments`
  })
);

export const postComment = (track_id, comment) => (
  $.ajax({
    method: "post",
    url: `api/tracks/${track_id}/comments`,
    data: comment
  })
);
