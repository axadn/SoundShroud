json.partial! "api/tracks/track", track: @track
json.extract! @track, :description, :genre
json.comment_ids (@track.comments.order(:created_at).map &:id)
if @track.artist.custom_img
  json.artist_img user_img_url(@track.artist_id)
else
  json.artist_img asset_path("default_profile.jpeg")
end
