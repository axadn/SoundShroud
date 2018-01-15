class Track < ApplicationRecord
  include PgSearch
  validates :title, presence: true,
  uniqueness: {scope: :artist_id}
  validates :title, length: {maximum: 64}
  validates :description, length: {maximum: 2048}
  validates :genre, length: {maximum: 32}
  has_many :comments
  belongs_to :artist, foreign_key: :artist_id, class_name: :User

  multisearchable against: [:title, :description, :genre],
                  using: {
                    tsearch: {
                      negation: true,
                      any_word: true                      
                    }
                  }
end
