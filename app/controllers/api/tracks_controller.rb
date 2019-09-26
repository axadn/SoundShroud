class Api::TracksController < ApplicationController
  SUPPORTED_EXTENSIONS = ['.mp3', '.ogg', '.wav',
                          '.flac'].freeze
  #SUPPORTED_IMG_EXTENSTIONS
  PRESIGNED_URL_TIMEOUT = 600

  def self.valid_extension?(filename)
    match = /(\.\w+)$/.match(filename)
    extension = match[0].downcase if match
    extension && SUPPORTED_EXTENSIONS.include?(extension) ? extension : nil
  end

  def img_temp_presigned_post
    @errors = image_params_errors
    if !@errors.empty?
      render json: { general: @errors }, status: 422
    else
      random_id = SecureRandom.urlsafe_base64
      obj = s3_bucket.object("img/tracks/temp/#{random_id}")
      post = obj.presigned_post(key: "img/tracks/temp/#{random_id}")
      render json: post.fields
    end
  end

  def track_params
    unless params["track"].respond_to? :permit
      params["track"] = JSON.parse(params["track"])
    end
    params.require(:track).permit(:title, :description, :genre)
  end

  def index
    @tracks = User.find_by(id: params[:user_id]).tracks.order("created_at DESC")
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

  def verify #verify form parms are valid and file extensions are supported before actual upload
    return render json: { general: "forbidden" }, status: 403 unless logged_in?
    @extension = Api::TracksController.valid_extension? params[:filename]
    @params_errors = params_errors
    if params[:image_filename]
      @image_extension = Api::TracksController.valid_image_extension? params[:image_filename]
      img_errors = image_params_errors
      @params_errors[:image] = img_errors unless img_errors.empty?
    end
    if @params_errors.empty?
      render json: track_temp_presigned_post
    else
      render json: @params_errors, status: 422
    end
  end

  def track_temp_presigned_post #returns the form fields necessary to upload to temp S3 storage
    return render json: { general: "forbidden" }, status: 403 unless logged_in?
    random_id = SecureRandom.urlsafe_base64
    temp_filename = "#{random_id}#{@extension}"
    obj = s3_bucket.object("tracks/temp/#{temp_filename}")
    post = obj.presigned_post(key: "tracks/temp/#{temp_filename}",
                              acl: "private")
    s3_info = { audio: { fields: post.fields, url: post.url,
                         temp_filename: temp_filename } }
    if params[:image_filename]
      img_temp_filename = "#{random_id}#{@image_extension}"
      obj = s3_bucket.object("tracks/images/temp/#{img_temp_filename}")
      img_post = obj.presigned_post(key: "tracks/images/temp/#{img_temp_filename}",
                                    acl: "private")
      s3_info[:image] = { fields: img_post.fields, url: img_post.url,
                          temp_filename: img_temp_filename }
    end
    s3_info
  end

  def process_track #convert file types from temp S3 storage
    return render json: { general: "forbidden" }, status: 403 unless logged_in?
    track = Track.new(track_params)
    track.artist_id = current_user.id
    track.save!
    tmp_img = params.key?(:temp_image_filename) ? params[:temp_image_filename] : false
    Resque.enqueue(AudioProcessJob, params[:temp_filename], track.id, tmp_img)
    render json: { id: track.id }
  end

  def audio_process_status
    return render json: { general: "forbidden" }, status: 403 unless logged_in?
    @track = Track.find_by(id: params[:id])
    return render json: { general: "forbidden" }, status: 403 unless @track.artist_id == current_user.id
    if @track
      if @track.processed
        render :show
      else
        render json: { status: "processing" }
      end
    else
      render json: { status: "failed" }
    end
  end

  def params_errors
    @track = Track.new(track_params)
    @track.artist_id = current_user.id
    errors = {}

    file_errors = []
    if params[:filename] && !params[:filename].empty?
      file_errors << "not a supported file type" unless @extension
    else
      file_errors << "must select a file"
    end

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

  def update
    @track = Track.find_by(id: params[:id])
    @track.attributes = track_params
    if @track.save
      render :show
    else
      render json: @track.errors.messages, status: 422
    end
  end

  def destroy
    @track = Track.find_by(id: params[:id])
    if @track
      if @track.artist_id == current_user.id
        Aws.use_bundled_cert!
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

  def get_s3_url
    obj = s3_bucket.object("tracks/#{params[:id]}.mp3")
    url = obj.presigned_url(:get, expires_in: PRESIGNED_URL_TIMEOUT)
    render plain: url
  end

end
