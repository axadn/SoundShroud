import React from "react";
import TrackItem from "../track/track_item";
export default props=>{
    if (props.loading) return <div className="search-page">
        <h3>Loading</h3>
    </div>;
    const results = props.results.map(result=>{
        if(result.searchable_type == "Track"){
            return(
                <li key={`trackItem${result.id}`}>
                    <TrackItem track={result}></TrackItem>
                </li>
            );
        }
        else return "";
    });
    return (<div className="search-page">
        <h3>{`Search Results for ${props.query}`}</h3>
        <ul className="search-result-list">
            {results}
        </ul>
    </div>);  
};