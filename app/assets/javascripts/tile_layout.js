//= require modal_renderer_factory

window.TILE_LAYOUT = function() {}
TILE_LAYOUT.prototype = {
  media_control: null,

  current_tile: null,

  currently_playing: false,

  modal_renderer: null,

  init: function(tile_data, media_control)
  {
    this.media_control = media_control;
    this.initialize_layout(JSON.parse(tile_data));
    this.initialize_handlers();
  },

  /**************************
    Initializers
  ***************************/

  initialize_layout: function(tiles)
  {
    var current_inst = this;
    var markup = "<div class='row tile-row'>";
    
    var current_row_size = 0; 
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

  },

  initialize_handlers: function()
  {
    var current_inst = this;
    $('span.play-icon').on('click', function()
    {
      var tile = $(this).closest('.tile');
      current_inst.on_play_click(tile);
    });

    $('span.expand-icon').on('click', function()
    {
      var tile = $(this).closest('.tile');
      current_inst.on_expand_click(tile);
    })

    $('#full_tile_modal').on('hidden.bs.modal', function () {
    });
  },

  /**************************
    Layout
  ***************************/
  add_tile: function(tile, new_row)
  {
    var c = "tile col-xs-6 col-md-" + tile.size.toString();
    var markup = "";

    if (new_row)
    {
      markup += "</div><div class='row tile-row'>"
    }
    markup += "<div class='" + c + "' data-id='" + tile.id + "' data-media_url='" + tile.media_url + "' style='background-image: url(\"" + tile.thumb+ "\")'><div class='play_tile'>0<span class='play-icon'>0</span><div class='btm-row'><span class='expand-icon'></span></div></div></div>";
    return markup;
  },


  /**************************
    Handlers
  ***************************/
  on_play_click: function(tile)
  {
    // Play the song / video, but don't open up the dialog. 
    var tile_data = tile.data();
    var current_tile_clicked = this.is_tile_clicked(tile, tile_data);
    this.update_selected_tile(tile, current_tile_clicked);

    if (!current_tile_clicked)
    {
      this.load_tile(tile_data, current_tile_clicked, true);
    }
  },

  on_expand_click: function(tile)
  {
    // Load the video, but don't play it. 
    // Show the full tile.
    var tile_data = tile.data();
    var current_tile_clicked = this.is_tile_clicked(tile, tile_data);
    this.load_tile(tile_data, current_tile_clicked, false);
    $('#full_tile_modal').modal().show();
  },

  is_tile_clicked: function(tile, tile_data)
  {
    var current_tile_clicked = false;

    if (this.current_tile != null)
    {
      current_tile_clicked = $(this.current_tile).data()['id'] == tile_data['id'];
      if (!current_tile_clicked)
      {
        this.current_tile.removeClass('playing');
      }
    }
    return current_tile_clicked;
  },

  update_selected_tile: function(tile, current_tile_clicked)
  {
    if (current_tile_clicked)
    {
      this.currently_playing = !this.currently_playing;
      if (this.currently_playing)
      {
        this.media_control.play();
        tile.addClass('playing');
      }
      else 
      {
        this.media_control.pause();
        tile.removeClass('playing');
      }
    }
    else
    {
      this.currently_playing = true;
      tile.addClass('playing');
      this.current_tile = tile;
    }
  },

  load_tile: function(tile_data, current_tile_clicked, autoplay)
  {
    var tile_id = tile_data['id']; 
    var media_url = tile_data['media_url'];
    current_inst = this;
    $.get( "tiles/" + tile_id + "/full_tile", function( tile_data ) 
    {
      if (current_tile_clicked)
      {
        current_inst.modal_renderer.adjust_size();
      }
      else
      {
        current_inst.on_tile_loaded(tile_data, media_url, autoplay);
      }
    });
  },

  on_tile_loaded: function(tile_data, media_url, autoplay)
  {
    this.reset_renderer(tile_data);
    this.modal_renderer.add_media_to_modal(media_url, autoplay);
    this.media_control.reset_vimeo_wrapper(); 
    this.modal_renderer.adjust_size();
  },

  reset_renderer: function(tile_data)
  {
    $('#full_tile_modal .modal-body').html(tile_data + "<div class='container'></div>");
    var value = $('#media_type').data()['value'];
    this.modal_renderer = (new MODAL_RENDERER_FACTORY()).get(value);    
  }

}
