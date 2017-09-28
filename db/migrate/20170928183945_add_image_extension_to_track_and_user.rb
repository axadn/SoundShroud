class AddImageExtensionToTrackAndUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :img_extension, :string, null: false, default: ".jpeg"
    add_column :tracks, :img_extension, :string, null: false, default: ".jpeg"
  end
end
