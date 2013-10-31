class HomeController < ApplicationController

	def index
		@tiles = Tile.published
    group_id = params[:group_id]
    @group = group_id.present? ? Group.find(group_id) : Group.first
	end

end