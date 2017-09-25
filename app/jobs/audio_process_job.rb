class AudioProcessJob < ApplicationJob
  queue_as :default

  def perform(temp_name, track)
    aws_client = Aws::S3::Client.new(region: 'us-west-1',
    access_key_id: ENV["S3_ID"],
    secret_access_key: ENV["S3_KEY"])
    File.open("tmp/#{temp_name}", 'wb') do |file|
      aws_client.get_object({bucket: "soundshroud",
        key: "tracks/temp/#{temp_name}"}, target: file)
    end
    begin
      output_filename = "tmp/#{track.id}.mp3"
      Sox::Cmd.new.add_input("tmp/#{temp_name}")
        .set_output(output_filename).run
      s3_filename = "tracks/#{track.id}.mp3"
      File.open(output_filename, "rb") do |f|
        aws_client.put_object(body: f.read,
          bucket: "soundshroud", key: s3_filename)
      end
      track = Track.find_by(id: track.id)
      if track
        track.processed = true
        track.save!
      end
    rescue Sox::Error
      track.delete
    ensure
      File.delete("tmp/#{temp_name}") if File.exist?("tmp/#{temp_name}")
      File.delete("tmp/#{track.id}.mp3") if File.exist?("tmp/#{track.id}.mp3")
      aws_client.delete_object(bucket: "soundshroud",
      key: "tracks/temp/#{temp_name}")
    end
  end

end
