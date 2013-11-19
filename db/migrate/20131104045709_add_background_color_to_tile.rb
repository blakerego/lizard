class AddBackgroundColorToTile < ActiveRecord::Migration
  def change
    add_column :tiles, :background_color, :string
  end
end
