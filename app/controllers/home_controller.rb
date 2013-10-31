class HomeController < ApplicationController

	def index
		@tiles = Tile.published
    @groups = Group.all
	end

end