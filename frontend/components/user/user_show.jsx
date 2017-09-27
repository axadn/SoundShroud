import React from "react";
import TracksIndexContainer from "./tracks_index_container";
export default class UserShow extends React.Component{

  display_name(){
    return this.props.user.display_name? this.props.user.display_name : this.props.user.username
  }
  render(){
    if(this.props.loading) return null;
    return <div className = "user-show">
      {this.display_name()}
      <TracksIndexContainer trackIds={this.props.user.track_ids}/>
    </div>
  }
}
