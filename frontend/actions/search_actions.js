export const RECEIVE_SEARCH_RESULTS = "RECEIVE_SEARCH_RESULTS";
import * as SearchApiUtils from "../utils/api_search_utils";

export const fetchSearchResultsThunk = (query, doneCallback) => dispatch=>{
    SearchApiUtils.fetchSearchResults(query).then(
        results=>{
            dispatch(receiveSearchResults(results));
            doneCallback(results);
        }
    );
}; 

export const receiveSearchResults = results =>({
    type: RECEIVE_SEARCH_RESULTS,
    payload: results
});