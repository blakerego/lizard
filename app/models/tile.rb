class Tile < ActiveRecord::Base
	attr_accessor :vimeo_id
	default_scope order('position ASC')
	mount_uploader :image, ImageUploader
	after_save :enqueue_image

	def self.media_types 
		return ['video', 'audio', 'image']
	end

  def image_name
    File.basename(image.path || image.filename) if image
  end	

  def enqueue_image
    ImageWorker.perform_async(id, key) if key.present?
  end

  class ImageWorker
    include Sidekiq::Worker
    
    def perform(id, key)
      tile = Tile.find(id)
      # binding.pry
      tile.key = key
      tile.remote_image_url = tile.image.direct_fog_url(with_path: true)
      tile.save!
      tile.update_column(:image_processed, true)
    end
  end
end
