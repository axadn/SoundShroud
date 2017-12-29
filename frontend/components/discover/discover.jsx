import React from "react";
import TracksIndexContainer from "../track/tracks_index_container";
import LandingPageContainer from "../landing_page/landing_page_container";

export default class Discover extends React.Component{
  constructor(props){
    super(props);
  }
  componentWillMount(){
    this.props.fetchPlaylist();
  }
  render(){
    const landingPagePlaceholder = this.props.logged_in ? "" : <LandingPageContainer/>;
      return(
        <div className="discover-page">
          {landingPagePlaceholder}
          <button className="blue button" onClick={this.props.fetchPlaylist}>
            shuffle
          </button>
          <TracksIndexContainer/>
        </div>
      );
  }
}
