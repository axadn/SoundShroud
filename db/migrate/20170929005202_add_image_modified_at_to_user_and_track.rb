class AddImageModifiedAtToUserAndTrack < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :image_modified_at, :timestamp, null: false, default: DateTime.now
    add_column :tracks, :image_modified_at, :timestamp, null: false, default: DateTime.now
  end
end
