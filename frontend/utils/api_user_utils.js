export const postUser = data =>(
  $.ajax({method: "post", url: "/api/users", data})
);
