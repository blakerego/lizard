class AddMediaUrlToTile < ActiveRecord::Migration
  def change
    add_column :tiles, :media_url, :string
  end
end
