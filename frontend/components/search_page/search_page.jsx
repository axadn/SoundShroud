export default props=>{
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