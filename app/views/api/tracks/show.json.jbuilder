json.partial! "api/tracks/track", track: @track
json.extract! @track, :description, :genre
json.comment_ids (@track.comments.order(:created_at).map &:id)
