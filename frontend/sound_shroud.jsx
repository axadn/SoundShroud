import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/root";
import configureStore from "./store/store";
import {receiveSession} from "./actions/session_actions";
import {postUserImage, postTrackImage} from "./actions/image_actions";
document.addEventListener("DOMContentLoaded", () => {
  addAutoplayListeners();
  const root = document.getElementById("root");
  const store = configureStore();
  window.postUserImage = postUserImage;
  window.postTrackImage = postTrackImage;
  document.addEventListener
  if(window.currentUser){
    store.dispatch(receiveSession(currentUser));
  }
  ReactDOM.render(<Root store={store}/>, root);
});

function addAutoplayListeners(){
  window.removeEventListener('keydown', enableAutoplay);
  window.removeEventListener('mousedown', enableAutoplay);
  window.removeEventListener('touchstart', enableAutoplay);
}

function enableAutoplay(){
  document.querySelector("audio").load();
  window.removeEventListener('keydown', enableAutoplay);
  window.removeEventListener('mousedown', enableAutoplay);
  window.removeEventListener('touchstart', enableAutoplay);
}
