export const fetchTracks = userId => (
  $.ajax({method: "get", url: `api/${userId}/track`}));

export const fetchTrack = id => (
  $.ajax({method: "get", url: `api/tracks/${id}`}));

export const process_track = (data) =>(
  $.ajax({
    method: "post",
    data,
    url: "api/tracks/process"
  })
)
export const updateTrack = data => (
  $.ajax({method: "PATCH", url: `api/tracks/${data.track.id}`, data})
);

export const verifyValidParams = verifyData => (
  $.ajax({method: "post", url: `api/tracks/verify`, data: verifyData })
);
export const deleteTrack = id => (
  $.ajax({method: "delete", url: `api/tracks/${id}`}));

export const postToS3 =(file,id) => {
  req = new XMLHttpRequest();
};

export const getS3Url = id => (
  $.ajax({method: "get", url: `/api/tracks/s3/${id}`}));

export const fetchUserTracks = userId => (
  $.ajax({method : "get", url: `api/users/${userId}/tracks`})
)
