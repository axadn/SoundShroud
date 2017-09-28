class Api::ImagesController < ApplicationController
  def track_verify
    return render json: { image: ["forbidden"] }, status: 403 unless logged_in?
    @extension = ApplicationController.valid_image_extension? params[:filename]
    return render json: { image: ["not a supported file type"] }, status: 422 unless @extension
    @track = Track.find_by(id: params[:id])
    return render json: { track: ["not found"] }, status: 404 unless @track
    obj = s3_bucket.object("tracks/images/#{params[:id]}#{@extension}")
    post = obj.presigned_post(key: "tracks/images/#{params[:id]}#{@extension}", acl: "public-read")
    @track.custom_img = true
    @track.img_extension = @extension
    @track.save
    render json: { fields: post.fields, url: post.url }
  end

  def user_verify
    return render json: { image: ["forbidden"] }, status: 403 unless logged_in?
    @user = User.find_by(id: params[:id])
    return render json: { image: ["forbidden"] }, status: 403 unless @user.id == current_user.id
    @extension = ApplicationController.valid_image_extension? params[:filename]
    return render json: { image: ["not a supported file type"] }, status: 422 unless @extension

    obj = s3_bucket.object("users/images/#{params[:id]}#{@extension}")
    post = obj.presigned_post(key: "users/images/#{params[:id]}#{@extension}", acl: "public-read")
    @user.custom_img = true
    @user.img_extension = @extension
    @user.save
    render json: { fields: post.fields, url: post.url }
  end
end
