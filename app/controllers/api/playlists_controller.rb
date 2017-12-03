class Api::PlaylistsController < ApplicationController
  def from_track_id
    tracks = Track.find(params[:id]).user.tracks.select(:id).order(
      "created_at DESC")
    render :index
  end
end
