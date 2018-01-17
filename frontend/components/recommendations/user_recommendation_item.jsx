import React from "react";
import {redirectToUser} from "../../utils/route_utils";

export default props => {
    const name = props.user.display_name || props.user.username;
    
    return(
        <div className="user-recommendation-item" >
            <img className="small user-img"
             onClick={
                redirectToUser(props.user.id)}
             src={props.user.image_url}/>
            <a className ="username-link" onClick={
                redirectToUser(props.user.id)}>
                {name}
            </a>
        </div>
    );
}