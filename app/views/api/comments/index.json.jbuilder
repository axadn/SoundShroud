json.array! (@comments) do |com|
  json.partial! "api/comments/comment", comment: com
end
