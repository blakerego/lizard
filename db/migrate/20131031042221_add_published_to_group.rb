class AddPublishedToGroup < ActiveRecord::Migration
  def change
    add_column :groups, :published, :boolean
  end
end
