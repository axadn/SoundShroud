class AddCustomImgToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :custom_img, :boolean, null: false, default: false
  end
end
