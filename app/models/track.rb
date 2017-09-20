class Track < ApplicationRecord
  validates :title, presence: true,
  uniqueness: {scope: :artist_id}
  validates :title, length: {maximum: 64}
  validates :description, length: {maximum: 2048}
  validates :genre, length: {maximum: 32}
  belongs_to :artist, foreign_key: :artist_id, class_name: :User
end
