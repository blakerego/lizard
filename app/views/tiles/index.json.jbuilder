json.array!(@tiles) do |tile|
  json.extract! tile, :name, :media_type, :position, :published
  json.url tile_url(tile, format: :json)
end
