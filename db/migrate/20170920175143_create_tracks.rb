class CreateTracks < ActiveRecord::Migration[5.1]
  def change
    create_table :tracks do |t|
      t.string :title, null: false
      t.string :description
      t.string :genre
      t.integer :artist_id, null: false

      t.timestamps
    end
    add_index :tracks, [:title, :artist_id], unique: true
  end
end
