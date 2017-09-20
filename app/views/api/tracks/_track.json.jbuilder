json.extract! track, :id, :title, :author_id
json.set! :author_display_name, track.author.display_name
