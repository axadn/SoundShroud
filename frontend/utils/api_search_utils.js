export const fetchSearchResults = query => $.ajax({
    method: "get", url: `api/search?query=${query}`});