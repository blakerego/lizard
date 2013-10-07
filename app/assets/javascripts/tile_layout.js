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
    });

  },

  on_tile_click: function(tile)
  {
    var tile_data = tile.data();
    $('#full_tile_modal').modal().show();

    var current_tile_clicked = false;

    if (this.current_tile != null)
    {
      current_tile_clicked = $(this.current_tile).data()['id'] == tile_data['id'];
      if (!current_tile_clicked)
      {
        this.current_tile.removeClass('playing');
      }
    }

    if (!current_tile_clicked)
    {
      tile.addClass('playing');
      this.current_tile = tile;
    }

    var tile_id = tile_data['id']; 
    var media_url = tile_data['media_url'];
    current_inst = this;
    $.get( "tiles/" + tile_id + "/full_tile", function( tile_data ) 
    {

      if (current_tile_clicked)
      {
        $('#full_tile_modal').modal().show();
      }
      else
      {
        current_inst.open_modal_dialog(tile_data, media_url);
      }
    });
  },

  open_modal_dialog: function(tile_data, media_url)
  {
    var close_btn = '<span class="button_wrapper"><button class="close modal_close">x</button></span>';
    $('#full_tile_modal .modal-body').html(close_btn + tile_data + "<div class='container'></div>");
    
    var value = $('#media_type').data()['value'];

    if (value == 'video')
    {
      this.add_video_to_modal(media_url);
      $('.container').height('75%');
      $('.container').width('100%');
    }
    else
    {
      this.add_audio_to_modal(media_url);
      $('.image_block img').on('load', function()
      {
        height = $('.image_block img').height();
        $('.full').height(height);
        $('.image_block .block .body').height(height - 122);
      });
    }

    $('.modal_close').on('click', function()
    {
      $('#full_tile_modal').modal('toggle');
    })

  },

  add_audio_to_modal: function(media_url)
  {
    $('.container').html('<iframe src="' + media_url + '?autoplay=true&api=1" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
    $('.container').hide();
    this.audio_control.reset_vimeo_wrapper();
  },

  add_video_to_modal: function(media_url)
  {
    $('.container').html('<iframe src="' + media_url + '?autoplay=true&api=1" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
    this.audio_control.reset_vimeo_wrapper();    
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
    markup += "<div class='" + c + "' data-id='" + tile.id + "' data-media_url='" + tile.media_url + "' style='background-image: url(\"" + tile.thumb+ "\")'><div class='play_tile'>0<span class='play-icon'>Now Playing</span><div class='btm-row'><span class='expand-icon'></span></div></div></div>";
    return markup;
  }
}
