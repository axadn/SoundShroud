import React from "react";
import TracksIndexContainer from "./tracks_index_container";
import UpdatableImageContainer from "../updatable_image_container";
export default class UserShow extends React.Component{
  display_name(){
    return this.props.user.display_name? this.props.user.display_name : this.props.user.username
  }
  render(){
    let locationElement;
    if(this.props.loading) return null;

    const display_name = this.display_name();
    if(this.props.user.location &&
      this.props.user.location.length > 0){
      locationElement = <div className="banner-info-text">
        <a>this.props.user.loction</a>
      </div>;
    }
    return(
      <div className = "user-show-content">
        <div className = "user-show banner">
          <UpdatableImageContainer src={this.props.user.image_url}
            inputId= "user-show-img-input"
            size="medium"
            type="user"
            id={this.props.user.id}
            ></UpdatableImageContainer>
          <div>
            <div className="banner-info-text">
              <a>{display_name}</a>
            </div>
            {locationElement}
          </div>
        </div>
        <h3>Tracks by {display_name}</h3>
        <TracksIndexContainer trackIds={this.props.user.track_ids}
         animationClassName="tracks-ease-in-right"/>
      </div>
    );
  }
}
