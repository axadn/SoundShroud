import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/root";
import configureStore from "./store/store";
import {receiveSession} from "./actions/session_actions";
import {postUserImage, postTrackImage} from "./actions/image_actions";
import { setAudioAnalyser } from "./actions/audio_analyser_actions";
let store;
document.addEventListener("DOMContentLoaded", () => {
  addAutoplayListeners();
  const root = document.getElementById("root");
  store = configureStore();
  window.postUserImage = postUserImage;
  window.postTrackImage = postTrackImage;
  document.addEventListener
  if(window.currentUser){
    store.dispatch(receiveSession(currentUser));
  }
  ReactDOM.render(<Root store={store}/>, root);
});

function addAutoplayListeners(){
  window.addEventListener('keydown', enableAutoplay);
  window.addEventListener('mousedown', enableAutoplay);
  window.addEventListener('touchstart', enableAutoplay);
}

function enableAutoplay(){
  document.querySelector("audio").load();
  window.removeEventListener('keydown', enableAutoplay);
  window.removeEventListener('mousedown', enableAutoplay);
  window.removeEventListener('touchstart', enableAutoplay);
  store.dispatch(setAudioAnalyser(setupAudioAnalyser()));
}

function setupAudioAnalyser (){
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioCtx.createAnalyser();
  const audioSrc = audioCtx.createMediaElementSource(
    document.querySelector("audio")
  );
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);
  return analyser;
};
