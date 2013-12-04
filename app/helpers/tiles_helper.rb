module TilesHelper
  def tiles_input(tile, title)
    if tile.present? and tile.media_url.present?
      tile.media_url.split('/').last
    else
      ""
    end
  end
end
