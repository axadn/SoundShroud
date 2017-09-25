# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
User.create(username: "example", password: "password")
User.create(username: "example2", password: "password")
User.create(username: "Bob", password: "password123")
Track.create(title: "A Great Struggle", artist_id: 1,
 description: "a short piece", genre: "soundtrack" )
Track.create(title: "I'm not sure", artist_id: 1, description: "ell wrold")
Comment.create(body: "It's very classical", user_id: 2, track_id: 1)
Comment.create(body: "I like it", user_id: 3, track_id: 1)
