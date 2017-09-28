class AudioProcessJob
  @queue = :audio_process

  def self.perform(temp_name, trackId, temp_image_name)
    track = Track.find(trackId)
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
      debugger
      if track
        if temp_image_name
          self.perform_img(temp_image_name, track, aws_client)
        end
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

  def self.perform_img(temp_name, track, aws)
    #begin
      File.open("tmp/#{temp_name}", 'wb') do |file|
        aws.get_object({bucket: "soundshroud",
          key: "tracks/images/temp/#{temp_name}"}, target: file)
      end
      image = MiniMagick::Image.open("tmp/#{temp_name}")
      if image.width > 400 || image.height > 400
        image.resize "400x400"
      end
      output_filename = "tmp/#{track.id}.jpeg"
      image.write(output_filename)
      s3_filename = "tracks/images/#{track.id}.jpeg"
      File.open(output_filename, "rb") do |f|
        aws.put_object(body: f.read,
          bucket: "soundshroud", key: s3_filename, acl: "public-read")
      end
      track.custom_img = true
    #rescue
    #ensure
      File.delete("tmp/#{track.id}.jpeg") if File.exist?("tmp/#{track.id}.jpeg")
      File.delete("tmp/#{temp_name}") if File.exist?("tmp/#{temp_name}")
      aws.delete_object(bucket: "soundshroud",
      key: "tracks/images/temp/#{temp_name}")
    #end
  end

end
