class User < ApplicationRecord
  validates :password, length: {minimum: 6, allow_nil: true}
  validates :username,:password_digest, presence: true, uniqueness: true
  validates  :session_token,uniqueness: true, allow_nil: true
  after_initialize :ensure_session_token
  has_many :tracks
  attr_accessor :password

  def self.find_by_credentials(opts)
    user = User.find_by(username: opts[:username])
    return user if user && user.is_password?(opts[:password])
    nil
  end

  def is_password?(pass)
    BCrypt::Password.new(self.password_digest).is_password?(pass)
  end

  def password=(new_pass)
    @password = new_pass
    self.password_digest = BCrypt::Password.create(new_pass)
  end

  def ensure_session_token
    self.session_token ||= User.generate_session_token
  end

  def reset_session_token!
    self.session_token = User.generate_session_token
    self.save
  end

  def self.generate_session_token
    SecureRandom.urlsafe_base64
  end

end