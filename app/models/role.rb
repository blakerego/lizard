class Role < ActiveRecord::Base

  has_many :assignments
  has_many :users, :through => :assignments
  validates_uniqueness_of :name

  def add_user(user)
    if !has_user?(user)
      self.users << user 
      self.save!
    end
  end

  def remove_user(user)
    assignment = get_user_assignment(user)
    if assignment.present?
      assignment.destroy
    end
  end

  def has_user?(user)
    return get_user_assignment(user).present?
  end

  def get_user_assignment(user)
    return Assignment.find_by_role_id_and_user_id(self.id, user.id)
  end

end
