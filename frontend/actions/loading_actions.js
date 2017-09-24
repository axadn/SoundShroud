export const RECEIVE_MAIN_CONTENT_LOADING = "RECEIVE_MAIN_CONTENT_LOADING";
export const RECEIVE_MAIN_CONTENT_LOADED = "RECEIVE_MAIN_CONTENT_LOADED";


export const receiveMainContentLoaded = () => ({
  type: RECEIVE_MAIN_CONTENT_LOADED
});

export const receiveMainContentLoading = () => ({
  type: RECEIVE_MAIN_CONTENT_LOADING
});
