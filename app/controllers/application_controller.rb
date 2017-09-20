class ApplicationController < ActionController::Base
  helper_method :logged_in?, :current_user, :verify_logged_in
  #protect_from_forgery with: :exception
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

  def s3_signer

  end

  def s3_bucket
    @s3_bucket ||=(
    aws_client = Aws::S3::Client.new region: 'us-west-1',
    access_key_id: ENV["S3_ID"],
    secret_access_key: ENV["S3_KEY"]

    s3 = Aws::S3::Resource.new(client: aws_client)
    s3.bucket('soundshroud')
    )
  end

  def self.valid_extension?(filename)
    extension = /(\.\w+)$/.match(filename)[0].downcase
    (SUPPORTED_EXTENSIONS.includes? extension) ? extension : nil
  end

  def self.upload_to_s3(filename)
    obj = Api::TracksController.s3_bucket.object(filename)
    obj.upload_file(filename)
  end


end
