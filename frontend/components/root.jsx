import React from "react";
import {Provider} from "react-redux";
import App from "./app";
import NavBar from "./nav_bar/nav_bar";
export default (props)=>{
    return(
      <Provider store={props.store}>
        <App/>
      </Provider>
    );
}
