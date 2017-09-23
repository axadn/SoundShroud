export const fetchTracks = userId => (
  $.ajax({method: "get", url: `api/${userId}/track`}));

export const fetchTrack = id => (
  $.ajax({method: "get", url: `api/tracks/${id}`}));

export const postTrack = formData => {
  const request = new XMLHttpRequest();
  request.open("POST", "api/tracks");
  request.send(formData);
  return request;
};

export const verifyValidParams = verifyData => (
  $.ajax({method: "post", url: `api/tracks/verify`, data: verifyData })
);
export const deleteTrack = id => (
  $.ajax({method: "delete", url: `api/tracks/${id}`}));
