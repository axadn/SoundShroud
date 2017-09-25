export const fetchTracks = userId => (
  $.ajax({method: "get", url: `api/${userId}/track`}));

export const fetchTrack = id => (
  $.ajax({method: "get", url: `api/tracks/${id}`}));

// export const postTrack = formData => {
//   const request = new XMLHttpRequest();
//   request.open("POST", "api/tracks");
//   request.send(formData);
//   request.onload = () => {
//     window.response = JSON.parse(request.responseText)
//   }
//   return request;
// };
export const postTrack = ({file, s3Info, trackParams}) =>{
  const formData = new FormData();
    Object.keys(s3Info.fields).forEach(key => {
      formData.append(key, s3Info.fields[key]);
    });
    s3Info.fields.file = file;
    formData.append("file", file);
  $.ajax({
    xhr: function(){
        var xhr = new window.XMLHttpRequest();
        // Handle progress
        //Upload progress
        xhr.upload.addEventListener("progress", function(evt){
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            //Do something with upload progress
            console.log(percentComplete);
          }
          },      false);
          return xhr;
    },
            type : 'POST',
            url : s3Info.url,
            data : formData,
            processData: false,
            beforeSend: logProgress,
             // tell jQuery not to convert to form data
            contentType: false,
            success: function(json) { console.log('Upload complete!') },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log('Upload error: ' + XMLHttpRequest.responseText);
            }
        });
  };
const logProgress = xhr => {
  debugger
  xhr.progress = e => {
    console.log(e.progress +"/" +e.total);
  }
};
//   const oReq = new XMLHttpRequest();
//
//
//
//   oReq.open("POST", s3Info.url, true);
//   oReq.setRequestHeader('Access-Control-Allow-Origin', '*');
//   oReq.setRequestHeader("content-type", "multipart/form-data");
//   oReq.send(formData);
// };

export const updateTrack = data => {
  $.ajax({method: "PATCH", url: `api/tracks/${track.id}`, data: track})
};

export const verifyValidParams = verifyData => (
  $.ajax({method: "post", url: `api/tracks/verify`, data: verifyData })
);
export const deleteTrack = id => (
  $.ajax({method: "delete", url: `api/tracks/${id}`}));

export const postToS3 =(file,id) => {
  req = new XMLHttpRequest();

  //(x-amz-algorithm), the credential scope (x-amz-credential) that you
  //used to generate the signing key,
  // and the date (x-amz-date)


  //acl
  //key
  //policy
  //x-amz-algorithm AWS4-HMAC-SHA256.
  //x-amz-credential <your-access-key-id>/<date>/<aws-region>/<aws-service>/aws4_request
  //x-amz-date example: 20130728)
  //x-amz-signature
};
