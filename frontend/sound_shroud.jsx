import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/root";
import configureStore from "./store/store";
import {receiveSession} from "./actions/session_actions";
import {postUserImage, postTrackImage} from "./actions/image_actions";
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  const store = configureStore();
  window.postUserImage = postUserImage;
  window.postTrackImage = postTrackImage;
  if(window.currentUser){
    store.dispatch(receiveSession(currentUser));
  }
  ReactDOM.render(<Root store={store}/>, root);
});
