//= require modal_renderer_factory

window.TILE_LAYOUT = function() {}
TILE_LAYOUT.prototype = {
  media_control: null,

  group_manager: null,

  current_tile: null,

  currently_playing: false,

  rendering_strategy: null,

  init: function(group_manager, media_control)
  {
    this.group_manager = group_manager;
    this.media_control = media_control;
    this.initialize_layout(this.group_manager.default_group_tiles());
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
    var $this = this;
    $('span.play-icon').on('click', function()
    {
      var tile = $(this).closest('.tile');
      $this.on_play_click(tile);
    });

    $('span.expand-icon').on('click', function()
    {
      var tile = $(this).closest('.tile');
      $this.on_expand_click(tile);
    });

    $('.album_btn').on('click', function()
    {
      var group_id = $(this).data()["groupId"];
      debugger;
      $this.switch_album_view(group_id);
    });

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
    if (tile == null)
    {
      return;
    }

    // Play the song / video, but don't open up the dialog. 
    var tile_data = tile.data();
    var current_tile_clicked = this.is_tile_clicked(tile, tile_data);
    this.update_selected_tile(tile, current_tile_clicked);

    if (!current_tile_clicked)
    {
      this.load_tile(tile_data, current_tile_clicked, true);
    }
  },

  play_next_tile: function()
  {
    this.on_play_click($(this.get_next_tile()));
  },

  get_next_tile: function()
  {
    if (this.current_tile == null)
    {
      /// Nothing selected, return first tile.
      return $('.tile-row').first().children().first();
    }

    var next_in_row = this.get_next_element(this.current_tile);
    if (next_in_row != null)
    {
      /// Next tile is in current row.
      return next_in_row;
    }

    /// Get first tile from next row.
    var next_row = this.get_next_element(this.current_tile.parent());
    if (next_row != null)
    {
      return next_row.children()[0];
    }

    /// current tile is last tile. nothing left to return but null.
    return null; 

  },

  get_next_element: function(element)
  {
    var parent = element.parent(),
      children = parent.children(),
      current_index = children.index(element);
    if (current_index < children.length -1 && current_index >= 0)
    {
      return $(children[current_index + 1]);
    }
    else 
    {
      return null; 
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
    $.get( "tiles/" + tile_id + "/full_tile", function( tile_markup ) 
    {
      if (current_tile_clicked)
      {
        current_inst.rendering_strategy.adjust_size();
      }
      else
      {
        current_inst.on_tile_loaded(tile_markup, media_url, tile_id, autoplay);
      }
    });
  },

  on_tile_loaded: function(tile_markup, media_url, tile_id, autoplay)
  {
    this.update_rendering_strategy(tile_markup);
    this.rendering_strategy.add_media_to_modal(media_url, autoplay, tile_id);
    this.media_control.reset_vimeo_wrapper(); 
    this.media_control.set_finish_callback(this.on_tile_finished.bind(this));
    this.rendering_strategy.adjust_size();
  },

  on_tile_finished: function()
  {
    this.play_next_tile();
  },

  update_rendering_strategy: function(tile_markup)
  {
    $('#full_tile_modal .modal-body').html(tile_markup + "<div class='container'></div>");
    var value = $('#media_type').data()['value'];
    this.rendering_strategy = (new MODAL_RENDERER_FACTORY()).get(value);    
  }, 

  switch_album_view: function(group_id)
  {
    this.initialize_layout(this.group_manager.tiles_for_group(group_id));
  }

}
