json.partial! 'api/users/user', user: @user
json.track_ids (@user.tracks.order("created_at DESC").map &:id)
