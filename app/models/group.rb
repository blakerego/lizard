class Group < ActiveRecord::Base

  def self.group_types 
    return ['album']
  end

end
