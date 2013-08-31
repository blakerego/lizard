class AddSizeToTile < ActiveRecord::Migration
  def change
    add_column :tiles, :size, :integer
  end
end
