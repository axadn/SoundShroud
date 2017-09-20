@tracks.each do |track|
  json.set! track.id, (json.partial! "api/tracks/track", track: track)
end
