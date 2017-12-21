import React from "react";
import TracksIndex from "../track/tracks_index";

export default class Discover extends React.Component{
  constructor(props){
    super(props);
  }
  componentWillMount(){
    this.props.fetchPlaylist();
  }
  render(){
    debugger;
    const tracks = Object.keys(this.props.tracks).map(
      key=> this.props.tracks[key]);
    if(!this.props.loading && tracks.length > 0){
      return(
        <div className="discover-page">
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
