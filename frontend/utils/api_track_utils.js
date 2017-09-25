export const fetchTracks = userId => (
  $.ajax({method: "get", url: `api/${userId}/track`}));

export const fetchTrack = id => (
  $.ajax({method: "get", url: `api/tracks/${id}`}));

export const uploadTrack = ({file, s3Info, progressCallback, doneCallback}) =>{
  const formData = new FormData();
    Object.keys(s3Info.fields).forEach(key => {
      formData.append(key, s3Info.fields[key]);
    });
    s3Info.fields.file = file;
    formData.append("file", file);
  return $.ajax({
    xhr: function(){
        var xhr = new window.XMLHttpRequest();
        // Handle progress
        //Upload progress
        xhr.upload.addEventListener("progress",progressCallback,false);
          return xhr;
          },
          type : 'POST',
          url : s3Info.url,
          data : formData,
          processData: false,
           // tell jQuery not to convert to form data
          contentType: false
        });
};
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
