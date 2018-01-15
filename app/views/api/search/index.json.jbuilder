json.array! @results.map do |result|
    json.extract! result, :searchable_type
    if result.searchable_type == "User"
        json.partial! "api/users/user", user: result.searchable
    else
        json.partial! "api/tracks/track", track: result.searchable
    end
end