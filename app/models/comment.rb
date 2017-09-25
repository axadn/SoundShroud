class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :track
   validates :body, presence: true 
end
