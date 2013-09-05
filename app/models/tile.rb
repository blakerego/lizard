class Tile < ActiveRecord::Base
	attr_accessor :vimeo_id
	default_scope order('position ASC')
	mount_uploader :image, ImageUploader
	def self.media_types 
		return ['video', 'audio', 'image']
	end
end
