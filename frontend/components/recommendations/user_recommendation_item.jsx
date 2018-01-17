import React from "react";

export default props => {
    const name = props.user.display_name || props.user.username;
    
    return(
        <div className="user-recommendation-item">
            <img className="small" src={props.user.image_url}/>
            <a>{name}</a>
        </div>
    );
}