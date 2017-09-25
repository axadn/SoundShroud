import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/root";
import configureStore from "./store/store";
import {postSessionThunk, receiveSession,
   deleteSessionThunk} from "./actions/session_actions";
import {postTrack} from "./utils/api_track_utils";
import * as TrackAPI from "./utils/api_track_utils";
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  const store = configureStore();
  window.store = store;
  window.postTrack = postTrack;
  if(window.currentUser){
    store.dispatch(receiveSession(currentUser));
  }
  window.postSessionThunk = postSessionThunk;
  window.postTrack = TrackAPI.postTrack
  window.deleteSessionThunk = deleteSessionThunk;
  ReactDOM.render(<Root store={store}/>, root);
});
