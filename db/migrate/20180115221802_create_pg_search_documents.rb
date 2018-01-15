class CreatePgSearchDocuments < ActiveRecord::Migration[5.1]
  def self.up
    say_with_time("Creating table for pg_search multisearch") do
      create_table :pg_search_documents do |t|
        t.text :content
        t.belongs_to :searchable, :polymorphic => true, :index => true
        t.timestamps null: false
      end
    end
    say_with_time("Re-saving all users and tracks") do
      Track.find_each(:batch_size => 1000) do |track|
        track.save!
      end
      User.find_each(batch_size: 1000) do |user|
        user.save!
      end
    end
  end

  def self.down
    say_with_time("Dropping table for pg_search multisearch") do
      drop_table :pg_search_documents
    end
  end
end
