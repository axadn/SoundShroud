export const postUser = data =>(
  $.ajax({method: "post", url: "/api/users", data})
);

export const fetchTrackCommentsUsers = trackId => (
  $.ajax({method: "get", url: `/api/tracks/${trackId}/users`})
);

export const fetchUser = userId => (
  $.ajax({method: "get", url: `/api/users/${userId}`})
)

export const postImage = (userId, imageFile) => {
  $.ajax({method: "post", url: `/api/users/${userId}image`});
};

export const fetchReccomendedUsers = (currentUserId) => {
  $.ajax({method: "get", url: `/api/users/recommended`});
};
