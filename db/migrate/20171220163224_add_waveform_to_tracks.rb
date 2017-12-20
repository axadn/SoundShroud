class AddWaveformToTracks < ActiveRecord::Migration[5.1]
  def change
    add_column :tracks, :waveform, :float, array: true
  end
end
