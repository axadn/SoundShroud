class Api::PlaylistsController < ApplicationController
  def from_track_id
    @tracks = Track.find(params[:id]).artist.tracks.order(
      "created_at DESC")
    render "api/tracks/index"
  end

  def random
    @tracks = Track.select("*").limit("25").order("RANDOM()")
    render "api/tracks/index"
  end
end
