class Group < ActiveRecord::Base

  has_many :tiles

  def self.group_types 
    return ['album', 'EP']
  end

  def self.published
    return Group.where(:published => true)
  end

  def published_tiles
    return Tile.published.where(:group_id => self.id)
  end

end
