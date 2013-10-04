authorization do 

  role :guest do 
    has_permission_on [:tiles], :to => [:full_tile]
  end

  role :admin do 
    includes :guest
    has_permission_on [:tiles], :to => [:show, :index, :new, :create, :edit, :update, :destroy, :publish, :aws_success_action, :reorder, :edit_image, :sizing]
  end
end