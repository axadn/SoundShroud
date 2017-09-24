json.extract! track, :id, :title, :artist_id
if track.artist.display_name.nil?
  json.set! :artist_display_name, track.artist.username
else
  json.set! :artist_display_name, track.artist.display_name
end
