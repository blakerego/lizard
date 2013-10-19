window.TILE_LAYOUT = function() {}
TILE_LAYOUT.prototype = {
  audio_control: null,

  current_tile: null,

  currently_playing: false,

  init: function(tile_data, audio_control)
  {
    this.audio_control = audio_control;
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
    var c = "tile col-xs-12 col-md-" + tile.size.toString();
    var markup = "";

    if (new_row)
    {
      markup += "</div><div class='row tile-row'>"
    }
    markup += "<div class='" + c + "' data-id='" + tile.id + "' data-media_url='" + tile.media_url + "' style='background-image: url(\"" + tile.thumb+ "\")'><div class='play_tile'>0<span class='play-icon'>Now Playing</span><div class='btm-row'><span class='expand-icon'></span></div></div></div>";
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

    if (current_tile_clicked)
    {
      if (this.currently_playing)
      {
        this.audio_control.pause();
      }
      else 
      {
        this.audio_control.play();
      }
    }
    else 
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
    this.show_modal();
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
    this.currently_playing = !this.currently_playing;
    if (current_tile_clicked)
    {
      if (this.currently_playing)
      {
        this.audio_control.pause();
        tile.removeClass('playing');
      }
      else 
      {
        this.audio_control.play();
        tile.addClass('playing');
      }
    }
    else
    {
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
        current_inst.adjust_size_for_media();
      }
      else
      {
        current_inst.on_tile_loaded(tile_data, media_url, autoplay);
      }
    });
  },

  on_tile_loaded: function(tile_data, media_url, autoplay)
  {
    $('#full_tile_modal .modal-body').html(tile_data + "<div class='container'></div>");
    
    var value = $('#media_type').data()['value'];

    if (value == 'video')
    {
      this.add_video_to_modal(media_url, autoplay);
      $('.container').height('75%');
      $('.container').width('100%');
    }
    else
    {
      this.add_audio_to_modal(media_url, autoplay);
    }
    this.adjust_size_for_media();
  },

  add_audio_to_modal: function(media_url, autoplay)
  {
    $('.container').html('<iframe src="' + media_url + '?autoplay=' + autoplay.toString() + '&api=1" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
    $('.container').hide();
    this.audio_control.reset_vimeo_wrapper();
  },

  add_video_to_modal: function(media_url, autoplay)
  {
    $('.container').html('<iframe src="' + media_url + '?autoplay=' + autoplay.toString() + '&api=1" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
    this.audio_control.reset_vimeo_wrapper();    
  },

  show_modal: function()
  {
    $('#full_tile_modal').modal().show();
  },

  adjust_size_for_media: function()
  {
    var value = $('#media_type').data()['value'];

    if (value == 'video')
    {
      $('.modal-dialog').css('margin-top', '0');
      var iframe_width = $('iframe').width();
      if (iframe_width > 400)
      {
        $('.modal-dialog').width(iframe_width);
      }
      else
      {
        $('.modal-dialog').width(940);
      }
    }
    else 
    {
      $('.modal-dialog').css('margin-top', '100px');
      $('.modal-dialog').width('1215px'); 
      $('.image_block img').on('load', function()
      {
        height = $('.image_block img').height();
        if (height > 0)
        {
          $('.full').height(height);
          $('.image_block .block .body').height(height - 122);
        }
      });
    }
  }

}
