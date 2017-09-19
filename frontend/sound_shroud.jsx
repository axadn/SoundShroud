import React from "react";
import ReactDOM from "react-dom";
import Root from "./components/root";
import configureStore from "./store/store";
import {postSessionThunk, receiveSession,
   deleteSessionThunk} from "./actions/session_actions";

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  const store = configureStore();
  window.store = store;
  if(window.currentUser){
    store.dispatch(receiveSession(currentUser));
  }
  window.postSessionThunk = postSessionThunk;
  window.deleteSessionThunk = deleteSessionThunk;
  ReactDOM.render(<Root store={store}/>, root);
});
