class Api::TracksController < ApplicationController
  SUPPORTED_EXTENSIONS = ['.mp3', '.ogg', '.wav',
  '.flac']
  PRESIGNED_URL_TIMEOUT = 30
  before_action :verify_logged_in, only: [:create, :destroy]
  def track_params
    params.require(:track).permit(:title, :description, :genre)
  end

  def index
    @tracks = User.find_by(id: params[:user_id]).tracks  
    render :index
  end

  def show
    @track = Track.find_by(id: params[:id])
    if @track
      render :show
    else
      render json: {general:["track not found"]}, status: 404
    end
  end

  def destroy
    @track = Track.find_by(id: params[:id])
    if @track
      if @track.artist_id == current_user.id
        s3_bucket.object("tracks/#{@track.id}").delete
        @track.delete
      else
        render json: {general: ["wrong user"]}, status: 403
      end
    else
      render json: {general: ["nothing to delete"]}, status: 404
    end
  end

  def create
    @track = Track.new(track_params)
    if @track.save
      handle_file
    else
      render json: @track.errors.messages
    end
  end

  def handle_file
    extension = Api::TracksController.valid_extension? params[:file].first
    if extension
      input_filename = "#{@track.id}#{extension}"
      output_filename = "#{@track.id}.mp3"
      File.write(input_filename, params[:file].last)
      begin
        Sox::Cmd.new.add_input(input_filename)
          .set_output(output_filename).run
        Api::TracksController.upload_to_s3 output_filename
        render json: "success"
      rescue Sox::errors => e
        render json: {genral: e.message}
      end
    else
      render json: {general: ["Not a supported file type"]}
    end
  end

  def getS3Url
    obj = s3_bucket.object("tracks/#{params[:id]}")
    url = obj.presigned_url(:get, expires_in: PRESIGNED_URL_TIMEOUT)
    render plain: url
  end

end
