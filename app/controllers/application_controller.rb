class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter { |c| Authorization.current_user = c.current_user }

  protected

  def permission_denied
    binding.pry
    flash[:error] = "Sorry, you are not allowed to access that page."
    redirect_to root_url
  end

end
