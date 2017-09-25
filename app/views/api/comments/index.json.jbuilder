@comments.each do |comment|
  json.set! comment.id do
    json.id comment.id
    json.partial! "api/comments/comment", comment: comment
  end
end
