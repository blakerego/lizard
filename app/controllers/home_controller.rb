class HomeController < ApplicationController

	def index
		@tiles = Tile.where(:published => true)
	end

end