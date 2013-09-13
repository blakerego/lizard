authorization do 
  role :admin do 
    has_permission_on [:tiles], :to => [:index, :show, :new, :create, :edit, :update, :destroy, :publish, :aws_success_action, :reorder, :edit_image]
  end
end