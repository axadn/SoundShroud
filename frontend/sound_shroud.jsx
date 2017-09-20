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
  const ajax2 = url => (
    $.ajax({
      method: "get",
      url: "https://s3-us-west-1.amazonaws.com/soundshroud/tracks/1",
    })
  );
  const setHeaders =headers=> xhr => {
    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key]);
    });

  }
  const setResultToWindow = res => {

    window.res = res;
  }
  $.ajax({
    method: "get", url: "api/tracks/s3/1"}).then(setResultToWindow);
  if(window.currentUser){
    store.dispatch(receiveSession(currentUser));
  }
  window.postSessionThunk = postSessionThunk;
  window.deleteSessionThunk = deleteSessionThunk;
  ReactDOM.render(<Root store={store}/>, root);
});
