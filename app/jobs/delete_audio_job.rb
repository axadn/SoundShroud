class DeleteAudioJob < ApplicationJob
  queue_as :default

  def perform(id)
    aws_client = Aws::S3::Client.new(region: 'us-west-1',
    access_key_id: ENV["S3_ID"],
    secret_access_key: ENV["S3_KEY"])
    aws_client.delete_object(bucket: "soundshroud",
    key: "tracks/#{id}.mp3")
  end
end
