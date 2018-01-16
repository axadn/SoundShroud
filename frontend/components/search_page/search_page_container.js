 import {connect} from "react-redux";
 import React from "react";
 import {withRouter} from "react-router-dom";
 import SearchPage from "./search_page";
 import {receiveMainContentLoaded,
    receiveMainContentLoading} from "../../actions/loading_actions";
import {fetchSearchResultsThunk} from "../../actions/search_actions";

 const parentMapState = (state, props) =>({
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
 const childMapDispatch = dispatch=>({

 });
 const ConnectedChild = connect(childMapState, childMapDispatch)(SearchPage);
class SearchPageContainer extends React.Component{
    componentDidMount(){
        this.props.fetchSearch(this.props.query);
    }
    componentWillReceiveProps(newProps){
        debugger;
        if(this.props.query != newProps.query)
            this.props.fetchSearch(newProps.query);
    }
    render(){
        return <ConnectedChild query={this.props.query}/>;
    }
 }

 export default withRouter(connect(parentMapState, parentMapDispatch)(SearchPageContainer));
 