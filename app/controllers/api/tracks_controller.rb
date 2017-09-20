class Api::TracksController < ApplicationController

  def getS3Url

    aws_client = Aws::S3::Client.new region: 'us-west-1',
    access_key_id: "AKIAIHIMU4ICNUR7FXNQ",
    secret_access_key: "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"

    s3 = Aws::S3::Resource.new(client: aws_client)
    bucket = s3.bucket('soundshroud')
    obj = bucket.object("tracks/#{params[:id]}")
    url = obj.presigned_url(:get, expires_in: 30)
    render plain: url
  end
end
