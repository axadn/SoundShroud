import React from "react";
import TracksIndex from "../track/tracks_index";
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
    const tracks = this.props.tracks;
    if(!this.props.loading && tracks.length > 0){
      return(
        <div className="discover-page">
          {landingPagePlaceholder}
          <button className="blue button" onClick={this.props.fetchPlaylist}>
            shuffle
          </button>
          <TracksIndex tracks = {tracks}/>
        </div>
      )
    }
    else{
      return <div></div>
    }
  }
}
