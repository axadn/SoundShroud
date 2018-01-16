import React from "react";
import TrackItem from "../track/track_item";
export default props=>{
    if (props.loading) return <div></div>;
    debugger;
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
    return (<div className="searchPage">
        <ul>
            {results}
        </ul>
    </div>);  
};