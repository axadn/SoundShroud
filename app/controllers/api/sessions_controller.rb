class Api::SessionsController < ApplicationController
  def create
    @user = User.find_by_credentials(user_params)
    if @user
      login(@user)
      render :show
    else
      render json: {general: ["Invalid username or password"]}, status: 422
    end
  end

  def destroy
    if logged_in?
      @user = User.find_by(session_token: session[:session_token])
      logout(@user)
      render :show
    else
      render json: "not logged in"
    end
  end
end
