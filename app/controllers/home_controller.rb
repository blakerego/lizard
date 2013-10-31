class HomeController < ApplicationController

	def index
    group_id = params[:group_id]
    @group = group_id.present? ? Group.find(group_id) : Group.first
    @tiles = @group.tiles
	end

end