import React from "react";
export default ()=>{
    return <form className="search-bar"
    onSubmit={e=>{
        e.preventDefault();
        window.location=`/#/search/${
            document.querySelector(".search-text").value
        }`
        document.querySelector(".search-text").value = "";
    }}>
        <input type="text" className="search-text"></input>
        <button type="submit">search</button>
    </form>
}