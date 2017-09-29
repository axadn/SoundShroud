json.extract! track, :id, :title, :artist_id, :created_at
if track.artist.display_name.nil?
  json.set! :artist_display_name, track.artist.username
else
  json.set! :artist_display_name, track.artist.display_name
end

if track.custom_img
  json.set! :img_url, track_img_url(track)
elsif track.artist.custom_img
  json.set! :img_url, user_img_url(track)
else
  json.set! :img_url, asset_path("default_profile.jpeg")
end
