class Api::TracksController < ApplicationController
  SUPPORTED_EXTENSIONS = ['.mp3', '.ogg', '.wav',
                          '.flac'].freeze
  #SUPPORTED_IMG_EXTENSTIONS
  PRESIGNED_URL_TIMEOUT = 30

  def self.valid_extension?(filename)
    match = /(\.\w+)$/.match(filename)
    extension = match[0].downcase if match
    extension && SUPPORTED_EXTENSIONS.include?(extension) ? extension : nil
  end

  def track_params
    unless params["track"].respond_to? :permit
      params["track"] = JSON.parse(params["track"])
    end
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
      render json: { general: ["track not found"] }, status: 404
    end
  end

  def verify
    @params_errors = params_errors
    if @params_errors.empty?
      get_track_temp_presigned_post
    else
      render json: @params_errors, status: 422
    end
  end

  def params_errors
    @track = Track.new(track_params)
    @track.artist_id = current_user.id
    errors = {}
    file_errors = []
    if params[:filename]
      extension = Api::TracksController.valid_extension? params[:filename]
      file_errors << "not a supported file type" unless extension
    else
      file_errors << "must select a file"
    end
  #  if parames[:image]
    errors[:file] = file_errors unless file_errors.empty?
    errors.merge!(@track.errors.messages) unless @track.valid?
    errors
  end

  def create
    @params_errors = params_errors
    if @params_errors.empty?
      @track = Track.new(track_params)
      @track.artist_id = current_user.id
      @track.save!
      handle_file
    else
      render json: @params_errors
    end
  end

  def destroy
    @track = Track.find_by(id: params[:id])
    if @track
      if @track.artist_id == current_user.id
        s3_bucket.object("tracks/#{@track.id}").delete
        @track.delete
        render json: { success: true }
      else
        render json: { general: ["wrong user"] }, status: 403
      end
    else
      render json: { general: ["nothing to delete"] }, status: 404
    end
  end

  def handle_file
    extension = Api::TracksController.valid_extension? params[:file].tempfile.path
    if extension
      input_filename = params[:file].tempfile.path
      output_filename = "tmp/#{@track.id}.mp3"
      begin
        Sox::Cmd.new.add_input(input_filename)
          .set_output(output_filename).run
        s3_filename = "tracks/#{@track.id}.mp3"
        upload_to_s3(output_filename, s3_filename)
        render json: { success: true }
      rescue Sox::Error => e
        @track.delete
        render json: { general: e.message }, status: 422
      end
    else
      render json: { general: ["Not a supported file type"] }
    end
  end

  def get_track_temp_presigned_post
    random_id = SecureRandom.urlsafe_base64
    obj = s3_bucket.object("tracks/temp/#{random_id}")
    post = obj.presigned_post(key: "tracks/temp/#{random_id}", acl: "private")
    render json: {fields: post.fields, url: post.url}
  end

  def get_img_temp_presigned_post
    random_id = SecureRandom.urlsafe_base64
    obj = s3_bucket.object("img/tracks/temp/#{random_id}")
    post = obj.presigned_post(key: "img/tracks/temp/#{random_id}")
    render json: post.fields
  end

  def get_s3_url
    obj = s3_bucket.object("tracks/#{params[:id]}")
    url = obj.presigned_url(:get, expires_in: PRESIGNED_URL_TIMEOUT)
    render plain: url
  end

end
