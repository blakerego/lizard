window.VIMEO_TEMPLATE = function() {}
VIMEO_TEMPLATE.prototype = {
  build: function(media_url, autoplay, tile_id)
  {
    return '<iframe id="' + tile_id.toString() + '" src="' + media_url + '?autoplay=' + autoplay.toString() + '&api=1" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
  } 
}