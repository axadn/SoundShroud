class Track < ApplicationRecord
  validates :title, presence: true,
  uniqueness: {scope: :artist_id}
  validates :title, length: {maximum: 64}
  validates :description, length: {maximum: 2048}
  validates :genre, length: {maximum: 32}
end
