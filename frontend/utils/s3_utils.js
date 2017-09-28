export const postPresigned = ({file, s3Info, progressCallback, doneCallback}) =>{
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
