//= require vimeo_template

window.AUDIO_MODAL_RENDERER = function() {}
AUDIO_MODAL_RENDERER.prototype = {

  adjust_size: function()
  {
    $('.modal-dialog').css('margin-top', '100px');
    $('.modal-dialog').width('1215px'); 

    var $this = this;
    var current_image = $('.image_block img');
    if (current_image.width() > 0)
    {
      /// Already loaded.
      $this.perform_adjustments();
    }
    else 
    {
      /// Image width indicates not yet ready.
      current_image.on('load', function()
      {
        $this.perform_adjustments();
      });
    }
  }, 

  perform_adjustments: function()
  {
    height = $('.image_block img').height();
    if (height > 0)
    {
      $('.full').height(height);
      $('.image_block .block .body').height(height - 122);
    }
  },

  add_media_to_modal: function(media_url, autoplay, tile_data)
  {
    var tile_id = tile_data['id'];
    $('.container').html((new VIMEO_TEMPLATE).build(media_url, autoplay, tile_id));
    $('.container').hide();

    var background_color = tile_data['background_color'];

    if (typeof(background_color) !== "undefined")
    {

      $('.modal-content').css('background-color', background_color);
    }
    else
    {
      $('.modal-content').css('background-color', 'white');
    }
  }
}