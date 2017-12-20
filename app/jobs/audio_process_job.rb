class AudioProcessJob
  @queue = :audio_process

  def self.perform(temp_name, trackId, temp_image_name)
    track = Track.find(trackId)
    aws_client = Aws::S3::Client.new(region: 'us-west-1',
    access_key_id: ENV["S3_ID"],
    secret_access_key: ENV["S3_KEY"])
    File.open("tmp/#{temp_name}", 'wb') do |file|
      aws_client.get_object({bucket: ENV["S3_BUCKET"],
        key: "tracks/temp/#{temp_name}"}, target: file)
    end
    begin

      output_filename = "tmp/#{track.id}.mp3"
      wav_filename = "tmp/#{track.id}.wav"

      Sox::Cmd.new.add_input("tmp/#{temp_name}")
        .set_output(output_filename).run
      Sox::Cmd.new.add_input("tmp/#{temp_name}")
        .set_output(wav_filename).run

      s3_filename = "tracks/#{track.id}.mp3"
      File.open(output_filename, "rb") do |f|
        aws_client.put_object(body: f.read,
          bucket: ENV["S3_BUCKET"], key: s3_filename)
      end

      track = Track.find_by(id: track.id)
      if track
        if temp_image_name
          self.perform_img(temp_image_name, track, aws_client)
        end
        track.waveform = self.generate_waveform(wav_filename)
        track.processed = true
        track.save!
      end

    rescue Sox::Error
      track.delete
    ensure
      File.delete("tmp/#{temp_name}") if File.exist?("tmp/#{temp_name}")
      File.delete("tmp/#{track.id}.mp3") if File.exist?("tmp/#{track.id}.mp3")
      File.delete("tmp/#{track.id}.wav") if File.exist?("tmp/#{track.id}.wav")
      aws_client.delete_object(bucket: ENV["S3_BUCKET"],
      key: "tracks/temp/#{temp_name}")
    end
  end

  def self.generate_waveform(temp_name)
    reader = WaveFile::Reader.new(temp_name)
    sample_offset = 0
    preview_resolution = 64
    form = reader.format()
    sub_window_resolution = 8
    sample_resolution = 2 ** form.bits_per_sample
    num_channels = form.channels
    window_size = reader.total_sample_frames / preview_resolution
    sub_window_size = window_size / sub_window_resolution
    amplitude_samples = []
    until reader.current_sample_frame() >= reader.total_sample_frames
      buffer = reader.read(window_size)
      amplitude_samples.push(
        self.averageBuffer(buffer, num_channels, sub_window_size) / sample_resolution
      )
    end
    amplitude_samples
  end

  def self.averageBuffer(buffer, num_channels, sub_window_size)
    buffer_idx = 0
    sum = 0
    num_windows = 0
    while buffer_idx < buffer.samples.length
      sub_window = buffer.samples.slice(buffer_idx, sub_window_size)
      sum += self.sub_window_max(sub_window, buffer.channels())
      buffer_idx += sub_window_size
      num_windows += 1
    end
    sum.to_f / num_windows
  end

  def self.sub_window_max(window, num_channels)
    if(num_channels > 1)
      window.max do |a,b|
        a.inject(0){|accum, channel| accum + channel.abs} <=>
          b.inject(0){|accum, channel| accum + channel.abs}
      end.inject(0){|accum,channel| accum + channel.abs}
    else
      window.max{|a,b| a.abs <=> b.abs}.abs
    end
  end


  def self.perform_img(temp_name, track, aws)
    begin
      File.open("tmp/#{temp_name}", 'wb') do |file|
        aws.get_object({bucket: ENV["S3_BUCKET"],
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
          bucket: ENV["S3_BUCKET"], key: s3_filename, acl: "public-read")
      end
      track.custom_img = true
      track.img_extension = ".jpeg"
      track.image_modified_at = DateTime.now
    rescue
    ensure
      File.delete("tmp/#{track.id}.jpeg") if File.exist?("tmp/#{track.id}.jpeg")
      File.delete("tmp/#{temp_name}") if File.exist?("tmp/#{temp_name}")
      aws.delete_object(bucket: ENV["S3_BUCKET"],
      key: "tracks/images/temp/#{temp_name}")
    end
  end

end
