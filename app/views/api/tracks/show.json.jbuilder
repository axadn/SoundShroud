json.partial! "api/tracks/track", track: @track
json.extract! @track, :description, :genre
