class RemoveImageLimit < ActiveRecord::Migration
  def change
    change_column :tiles, :image, :text, :limit => nil 
  end
end
