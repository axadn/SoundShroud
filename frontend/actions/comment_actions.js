export const RECEIVE_COMMENTS = "RECEIVE_COMMENTS";

export const receiveComments = tracks => ({
  type: RECEIVE_COMMENTS,
  payload: tracks
});

export const fetchCommentsThunk = trackId => dispatch => (
  CommentAPIUtil.fetchComments(trackId)
  .then(res => dispatch(receiveTracks(res))));
