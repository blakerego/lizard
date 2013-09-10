class HomeController < ApplicationController

	def index
		@tiles = Tile.published
	end

end