class AddSkipImageProcessingToTile < ActiveRecord::Migration
  def change
    add_column :tiles, :skip_image_processing, :boolean
  end
end
