class CreateTiles < ActiveRecord::Migration
  def change
    create_table :tiles do |t|
      t.string :name
      t.string :media_type
      t.integer :position
      t.boolean :published

      t.timestamps
    end
  end
end
