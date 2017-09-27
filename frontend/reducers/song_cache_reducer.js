// RECEIVE_TRACK_FILE payload index
//
// [{trackId: 45, file: undefined, promise}, {trackId: 1 , file: undefined, promise}]
// {trackId, file, promise}
// [{trackId: 58, file: undefined, promise }, {trackId: 99, file: undefined, promise }]
//
// if loaded{
//   idx = curIdx +1
//   while(loaded at idx && idx <= curIdx +2){
//     if!(loaded at idx){
//       currentlyLoading = APICall(idx)
//       break;
//     }
//     idx += 1
//   }
// }
// else{
//   currentlyLoading = APICall(curIdx)
// }
