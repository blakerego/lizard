class AddLyricsToTile < ActiveRecord::Migration
  def change
    add_column :tiles, :lyrics, :text
  end
end
