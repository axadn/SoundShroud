class AddProcessedFlagToTracks < ActiveRecord::Migration[5.1]
  def change
    add_column :tracks, :processed, :boolean, null: false, default: false
  end
end
