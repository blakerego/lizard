class AddImageToTiles < ActiveRecord::Migration
  def change
    add_column :tiles, :image, :string
  end
end
