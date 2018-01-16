import React from "react";
import TrackItem from "../track/track_item";
import UserItem from "../user/user_item";
export default props=>{
    if (props.loading) return <div className="search-page">
        <h3>Loading</h3>
    </div>;
    const results = props.results.map(result=>{
        if(result.searchable_type == "Track"){
            return(
                <li key={`trackItem${result.id}`}>
                    <TrackItem track={result}/>
                </li>
            );
        }
        else return(
            <li key={`userItem${result.id}`}>
                <UserItem user={result}/>
            </li>
        );
    });
    return (<div className="search-page">
        <h3>{`Search Results for "${props.query}"`}</h3>
        <ul className="search-result-list">
            {results}
        </ul>
    </div>);  
};