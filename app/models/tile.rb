class Tile < ActiveRecord::Base
	attr_accessor :vimeo_id
	default_scope order('position ASC')
	mount_uploader :image, ImageUploader
  belongs_to :group
	# after_save :enqueue_image

	def self.media_types 
		return ['video', 'audio', 'image']
	end

  def self.published
    return Tile.where(:published => true)
  end

  def self.secret
    return Tile.where("published is null OR published is false")
  end

  def image_name
    path = image.path || image.filename if image 
    if path.present?
      File.basename(image.path || image.filename)
    else
      ""
    end
  end	

  def thumb
    return image_url(:thumb)
  end

  def enqueue_image
    # ImageWorker.perform_async(id, key) if has_image_upload? && !skip_image_processing 
    # Leave in foreground for now.

    if has_image_upload? && !skip_image_processing
	    tile = Tile.find(id)
	    if (tile.key != key)
	    	tile.key = key
	      tile.remote_image_url = tile.image.direct_fog_url(with_path: true)
	      tile.skip_image_processing = true
	      begin
	      	tile.save!
	      rescue Exception => e
	      	puts "********************************"
	      	puts e.message	      	
	      end
	    	# tile.update_column(:image_processed, true)
	    end
    end
  end

  # class ImageWorker
  #   include Sidekiq::Worker
    
  #   def perform(id, key)
	 #    tile = Tile.find(id)
	 #    if (tile.key != key)
	 #    	tile.key = key
	 #      tile.remote_image_url = tile.image.direct_fog_url(with_path: true)
	 #      tile.skip_image_processing = true
	 #      begin
	 #      	tile.save!
	 #      rescue Exception => e
	 #      	puts "********************************"
	 #      	puts e.message
	 #      end
	 #    	# tile.update_column(:image_processed, true)
	 #    end
  #   end
  # end
end
