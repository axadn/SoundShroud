export const postSession = data =>(
  $.ajax({method: "post",
  url: "/api/session", data},)
);

export const deleteSession = () => (
  $.ajax({method: "delete", url: 'api/session'})
);
