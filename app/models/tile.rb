class Tile < ActiveRecord::Base
	attr_accessor :vimeo_id

	def self.media_types 
		return ['video', 'audio', 'image']
	end
end
