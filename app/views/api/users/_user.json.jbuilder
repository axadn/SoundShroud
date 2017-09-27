json.extract! user, :id, :username, :display_name, :location
if user.custom_img
  json.set! :image_url, user_img_url(user.id)
else
  json.set! :image_url, asset_path("default_profile.jpeg")
end
