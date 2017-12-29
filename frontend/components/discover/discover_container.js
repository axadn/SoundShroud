import {connect} from "react-redux";
import {receiveMainContentLoaded, receiveMainContentLoading}
  from "../../actions/loading_actions";
import {fetchRandomPlaylistThunk} from "../../actions/playlist_actions";
import Discover from "./discover";
import React from "react";
import {logged_in} from "../../reducers/selectors";

const mapStateToProps = state => {
  return{
    logged_in: logged_in(state)
}};

const mapDispatchToProps = dispatch => ({
  fetchPlaylist: () =>{
    dispatch(receiveMainContentLoading());
    dispatch(fetchRandomPlaylistThunk(() =>
      dispatch(receiveMainContentLoaded())
    ));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Discover);
