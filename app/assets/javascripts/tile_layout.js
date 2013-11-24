//= require modal_renderer_factory

window.TILE_LAYOUT = function() {}
TILE_LAYOUT.prototype = {
  media_control: null,

  group_manager: null,

  current_tile: null,

  currently_playing: null,

  rendering_strategy: null,

  tile_selected_events: null,

  track_progress_events: null,

  init: function(group_manager, media_control)
  {
    this.group_manager = group_manager;
    this.media_control = media_control;
    this.currently_playing = false;
    this.initialize_layout(this.group_manager.default_group_tiles());
    this.initialize_handlers();
    this.tile_selected_events = [];
    this.track_progress_events = [];
  },

  /**************************
    Initializers
  ***************************/

  initialize_layout: function(tiles)
  {
    var $this = this;

    // var markup = "<div class='row tile-row'>";
    
    // var current_row_size = 0; 

    // $.each(tiles, function(index, tile)
    // {
    //   if (current_row_size + tile.size <= 12)
    //   {
    //     markup += $this.add_tile(tile, false);
    //     current_row_size += tile.size;
    //   }
    //   else 
    //   {
    //     markup += $this.add_tile(tile, true);
    //     current_row_size += tile.size - 12;
    //   }

    // });

    var tiles_area = $('.tiles_area');

    this.masonry_object = tiles_area.masonry(
    {
      itemSelector: '.tile', 
      // columnWidth: '.tile'
    });


      // $('.remove_me').remove();
      // $('.index_grid').css({'visibility': 'visible'})


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


    // tiles_area.fadeOut(500, function()
    // {
    //   // $(this).html(markup + "</div>")
    //   tiles_area.fadeIn(500);
    //   $('span.play-icon').on('click', function()
    //   {
    //     var tile = $(this).closest('.tile');
    //     $this.on_play_click(tile);
    //   });

    //   $('span.expand-icon').on('click', function()
    //   {
    //     var tile = $(this).closest('.tile');
    //     $this.on_expand_click(tile);
    //   });

    // });

  },

  initialize_handlers: function()
  {
    var $this = this;
    $('.album_btn').on('click', function()
    {
      var group_id = $(this).data()["groupId"];
      $this.switch_group_view(group_id);
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
    markup += "<div class='" + c + "' data-id='" + tile.id + "' data-media_url='" + tile.media_url;
    if (typeof(tile.background_color) !== "undefined" && tile.background_color != null)
    {
      markup += "' data-background_color='" + tile.background_color;
    }
    markup += "' style='background-image: url(\"" + tile.thumb + "\")'><div class='play_tile'>0<span class='play-icon'>0</span>" + "<div class='btm-row'><span class='expand-icon'></span></div></div></div>";
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
    

    if (!current_tile_clicked)
    {
      // tile switch
      this.toggle_playing(tile, true);
      this.update_selected_tile(tile);
      this.load_tile(tile_data, current_tile_clicked, true);
    }
    else 
    {
      this.toggle_playing(tile);
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

    if (!current_tile_clicked)
    {
      this.update_selected_tile(tile);
    }

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
        this.current_tile.removeClass('selected');
        this.current_tile.removeClass('playing');
      }
    }
    return current_tile_clicked;
  },

  toggle_playing: function(tile, is_playing)
  {
    if (typeof is_playing !== 'undefined')
    {
      this.currently_playing =  is_playing;
    }
    else
    {
      this.currently_playing = !this.currently_playing;
    }

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
  },

  update_selected_tile: function(tile)
  {
    tile.addClass('selected');
    this.current_tile = tile;
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
        current_inst.on_tile_loaded(tile_markup, media_url, tile_data, autoplay);
      }
    });

    var length = this.tile_selected_events.length; 
    for(var i=0; i < length; i++)
    {
      this.tile_selected_events[i].call(this, this.current_tile);
    }

  },

  on_tile_loaded: function(tile_markup, media_url, tile_data, autoplay)
  {
    this.update_rendering_strategy(tile_markup);
    this.rendering_strategy.add_media_to_modal(media_url, autoplay, tile_data);
    this.media_control.reset_vimeo_wrapper($('iframe#' + tile_data['id'])); 

    this.media_control.vimeo_player.add_play_progress_listener(this.on_play_progress.bind(this));

    this.media_control.set_finish_callback(this.on_tile_finished.bind(this));
    this.rendering_strategy.adjust_size();

    $('span.play').unbind('click', this.modal_play_clicked)
                  .bind('click', this.modal_play_clicked.bind(this));

  },

  on_play_progress: function(data)
  {
    var length = this.track_progress_events.length; 
    for(var i=0; i < length; i++)
    {
      this.track_progress_events[i].call(this, data);
    }
  },

  modal_play_clicked: function()
  {
    this.on_play_click(this.current_tile);
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

  switch_group_view: function(group_id)
  {
    this.initialize_layout(this.group_manager.tiles_for_group(group_id));
  },

  bind: function(event_name, callback)
  {
    if (event_name == "tile_selected")
    {
      this.tile_selected_events.push(callback);
    }
    else if (event_name == "track_progress")
    {
      this.track_progress_events.push(callback);
    }
  }

}
