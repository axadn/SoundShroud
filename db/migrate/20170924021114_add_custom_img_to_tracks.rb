class AddCustomImgToTracks < ActiveRecord::Migration[5.1]
  def change
    add_column :tracks, :custom_img, :bool, default: false
  end
end
