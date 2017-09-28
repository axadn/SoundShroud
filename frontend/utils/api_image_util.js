export const presignedUserPost = (img , id)=>(
  $.ajax({method: "post", url: `/api/users/${id}/img/verify`,
          data: {filename: img.name}})
);

export const presignedTrackPost = (img , id)=>(
  $.ajax({method: "post", url: `/api/tracks/${id}/img/verify`,
          data: {filename: img.name}})
);
