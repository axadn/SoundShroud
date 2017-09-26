export const RECEIVE_COMMENTS = "RECEIVE_COMMENTS";
export const RECEIVE_COMMENTS_LOADED = "RECEIVE_COMMENTS_LOADED";
export const RECEIVE_COMMENTS_LOADING = "RECEIVE_COMMENTS_LOADING";
import * as CommentAPIUtil from "../utils/api_comment_utils";
export const receiveComments = comments => ({
  type: RECEIVE_COMMENTS,
  payload: comments
});

export const fetchCommentsThunk = trackId => dispatch => (
  CommentAPIUtil.fetchComments(trackId)
  .then(res =>{
    dispatch(receiveComments(res));
    dispatch(receiveCommentsLoaded());
    }
  )
);

export const postCommentThunk = (trackId, commentData, callBack)=> dispatch => (
  CommentAPIUtil.postComment(trackId, {comment:commentData})
  .then(res => callBack(res))
);


export const receiveCommentsLoaded = () =>({
  type: RECEIVE_COMMENTS_LOADED
});

export const receiveCommentsLoading = () => ({
  type: RECEIVE_COMMENTS_LOADING
});
