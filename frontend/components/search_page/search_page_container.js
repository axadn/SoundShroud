 import {connect} from "react-redux";
 import React from "react";
 import {withRouter} from "react-router-dom";
 import {SearchPage} from "search_page";
 import {receiveMainContentLoaded,
    receiveMainContentLoading} from "../../actions/loading_actions";
import {fetchSearchThunk} from "../../actions/search_actions";

 const parentMapState = state =>({
    query: props.match.params.query
 });
 const parentMapDispatch = (dispatch, props) =>({
    fetchSearch: query =>{
        dispatch(receiveMainContentLoading());
        dispatch(fetchSearchResultsThunk(
                    query,
                    ()=> dispatch(receiveMainContentLoaded())
                )
        );
    }
 });

 const childMapState = state =>({
    loading: state.loading.mainContent,
    results: state.entities.searchResults
 });
 const childMapDispatch = dispatch({

 });

 class SearchPageContainer extends React.Component{
    componentDidMount(){
        this.props.fetchSearch(this.props.query);
    }
    componentWillReceiveProps(newProps){
        this.props.fetchSearch(this.props.query);
    }
    render(){
        return <ConnectedChild/>;
    }
 }
 const ConnectedChild = connect(childMapState, childMapDispatch)(SearchPage);