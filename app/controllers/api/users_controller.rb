class Api::UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    if @user.save
      login(@user)
      render :show
    else
      render json: @user.errors.messages, status: 422
    end
  end

  def index
    @track = Track.find_by(id: params[:track_id])
    if @track
      @users = @track.comments.includes(:user).map{|comment| comment.user}
      render :index
    end
  end
end
