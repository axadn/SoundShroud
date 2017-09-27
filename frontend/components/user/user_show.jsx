import React from "react";
import TracksIndexContainer from "./tracks_index_container";
export default class UserShow extends React.Component{
  display_name(){
    return this.props.user.display_name? this.props.user.display_name : this.props.user.username
  }
  render(){
    let locationElement;
    if(this.props.loading) return null;
    if(this.props.user.location &&
      this.props.user.location.length > 0){
      locationElement = <div className="banner-info-text">
        <a>this.props.user.loction</a>
      </div>;
    }
    return(
      <div className = "user-show-content">
        <div className = "user-show banner">
          <img className="medium" src={this.props.user.image_url}/>
          <div>
            <div className="banner-info-text">
              <a>{this.display_name()}</a>
            </div>
            {locationElement}
          </div>
        </div>
        <TracksIndexContainer trackIds={this.props.user.track_ids}/>
      </div>
    );
  }
}
