class ApplicationController < ActionController::Base
  helper_method :logged_in?, :current_user
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

  def user_params
    params.require(:user).permit(:username, :password)
  end

  def logged_in?
    !!current_user
  end

  def s3_signer
    Aws::Sigv4::Signer.new(
      service: 's3',
      region: 'us-west-1',
      access_key_id: ENV[:S3_ID],
      secret_access_key: ENV[:S3_KEY]
    )
  end

end
