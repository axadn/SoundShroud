class ChangeTrackDescriptionToText < ActiveRecord::Migration[5.1]
  def change
    change_column :tracks, :description, :text
  end
end
