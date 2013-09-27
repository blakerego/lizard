window.TILE_LAYOUT = function() {}
TILE_LAYOUT.prototype = {
  audio_control: null,

  current_tile: null,

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
      current_inst.on_tile_click($(this));
    })

    $('#full_tile_modal').on('hidden.bs.modal', function () {
      // $( '.tiles_area' ).toggle( "explode" );
    });
    
  },

  on_tile_click: function(tile)
  {
    // $( '.tiles_area' ).toggle( "explode" );
    var tile_data = tile.data();
    $('#full_tile_modal').modal().show();

    if (this.current_tile != null)
    {
      this.current_tile.removeClass('playing');
    }

    tile.addClass('playing');
    this.current_tile = tile;

    var tile_id = tile_data['id']; 
    var media_url = tile_data['media_url'];
    current_inst = this;
    $.get( "tiles/" + tile_id + "/full_tile", function( tile_data ) 
    {
      $('#full_tile_modal .modal-body').html(tile_data + "<div class='container'></div>");

      $('.container').html('<iframe src="' + media_url + '?autoplay=true&api=1" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');

      current_inst.audio_control.reset_vimeo_wrapper();
    });
  },

  open_first_tile: function()
  {
    this.on_tile_click($('.tile').first());
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
