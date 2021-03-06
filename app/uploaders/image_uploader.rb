# encoding: utf-8

class ImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::RMagick
  include CarrierWaveDirect::Uploader
  include CarrierWave::MimeTypes
  process :set_content_type

  version :thumb do
    process :resize_to_limit => [nil, 205]
  end

end
