class Api::CommentsController < ApplicationController
  before_action :verify_logged_in, only: [:create]

  def create
    @comment = Comment.new(comment_params)
    @comment.user_id = current_user.id
    @comment.track_id = params[:track_id]
    if @comment.save
      render :show
    else
      render json: @comment.errors.messages
    end
  end

  def index
    @track = Track.find_by(id: params[:track_id])
    if @track
      @comments = @track.comments.includes(:user).order("created_at DESC")
      render :index
    else
      render json: {general: ["No such track"]}, status: 404
    end
  end

  def comment_params
    params.require(:comment).permit(:body)
  end
end
