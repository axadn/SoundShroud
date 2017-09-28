class ApplicationController < ActionController::Base
  helper_method :logged_in?, :current_user, :verify_logged_in, :user_img_url,
  :track_img_url
  #protect_from_forgery with: :exception
  SUPPORTED_EXTENSIONS = ['.jpg', '.gif', '.png',
  '.jpeg']

  def user_img_url(id)
    "https://s3-us-west-1.amazonaws.com/soundshroud/users/images/#{id}.jpeg"
  end

  def track_img_url(id)
    "https://s3-us-west-1.amazonaws.com/soundshroud/tracks/images/#{id}.jpeg"
  end

  def self.valid_image_extension?(filename)
    match = /(\.\w+)$/.match(filename)
    extension = match[0].downcase if match
    (extension && SUPPORTED_EXTENSIONS.include?(extension)) ? extension : nil
  end

  def image_params_errors
    errors = []
    #errors << "must be under 5MB" if params[:image_size] >= 5000
    errors << "not a supported file type" unless @image_extension
    errors
  end

  def current_user
    return nil if session[:session_token].nil?
    @current_user ||= User.find_by(session_token: session[:session_token])
  end

  def logout(user)
    user.session_token = nil
    user.save
    session[:session_token] = nil
  end

  def login(user)
    user.reset_session_token!
    session[:session_token] = user.session_token
  end

  def verify_logged_in
    unless logged_in?
      render json: {general: ["must be logged_in"]}, status: 403
      false
    end
  end

  def user_params
    params.require(:user).permit(:username, :password)
  end

  def logged_in?
    !!current_user
  end

  def s3_bucket
    @s3_bucket ||=(
    aws_client = Aws::S3::Client.new(region: 'us-west-1',
  access_key_id: ENV["S3_ID"],
    secret_access_key: ENV["S3_KEY"])

    s3 = Aws::S3::Resource.new(client: aws_client)
    s3.bucket('soundshroud')
    )
  end
end
