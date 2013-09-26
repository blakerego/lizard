class AddGroupIdToTiles < ActiveRecord::Migration
  has_many :tiles
  def change
    add_column :tiles, :group_id, :integer
  end
end
