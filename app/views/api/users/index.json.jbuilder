@users.each do |user|
  json.set! user.id do
    json.extract! user, :id, :username, :location
    if user.custom_img
      json.image_url = user_img_url(user.id)
    else
      json.image_url = asset_path("default_profile.jpeg")
    end
  end
end
