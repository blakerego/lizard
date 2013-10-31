class Group < ActiveRecord::Base

  def self.group_types 
    return ['album']
  end

  def tiles
    return Tile.where(:group_id => self.id)
  end

end
