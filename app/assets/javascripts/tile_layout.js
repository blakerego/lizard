window.TILE_LAYOUT = function() {}
TILE_LAYOUT.prototype = {
  audio_control: null,

  init: function(tile_data, audio_control)
  {
    this.audio_control = audio_control;
    var tiles = JSON.parse(tile_data);
    var markup = "<div class='row tile-row'>";
    
    var current_row_size = 0; 
    var current_inst = this;
    $.each(tiles, function(index, tile)
    {
      if (current_row_size + tile.size <= 12)
      {
        markup += current_inst.add_tile(tile, false);
        current_row_size += tile.size;
      }
      else 
      {
        markup += current_inst.add_tile(tile, true);
        current_row_size += tile.size - 12;
      }

    });

    $('.tiles_area').html(markup + "</div>");

    $('.tile').on('click', function()
    {
      $('#full_tile_modal').modal().show();
      
      var data = $(this).data();
      var tile_id = data['id']; 
      var media_url = data['media_url'];
      current_inst

      $.get( "tiles/" + tile_id + "/full_tile", function( data ) 
      {
        $('#full_tile_modal .modal-body').html(data + "<div class='container'></div>");

        $('.container').html('<iframe src="' + media_url + '?autoplay=true&api=1" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
        current_inst.audio_control.reset_vimeo_wrapper();
      });


    })
  },

  add_tile: function(tile, new_row)
  {
    var c = "tile col-xs-12 col-md-" + tile.size.toString();
    var markup = "";

    if (new_row)
    {
      markup += "</div><div class='row tile-row'>"
    }
    markup += "<div class='" + c + "' data-id='" + tile.id + "' data-media_url='" + tile.media_url + "' style='background-image: url(\"" + tile.thumb+ "\")'><div class='play_tile'>0<span class='play-icon'></span><div class='btm-row'><span class='share-icon'></span><span class='expand-icon'></span></div></div></div>";
    return markup;
  }
}
