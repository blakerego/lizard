window.VIDEO_MODAL_RENDERER = function() {}
VIDEO_MODAL_RENDERER.prototype = {

  adjust_size: function()
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
  },

  add_media_to_modal: function(media_url, autoplay)
  {
    $('.container').html('<iframe src="' + media_url + '?autoplay=' + autoplay.toString() + '&api=1" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
    $('.container').height('75%');
    $('.container').width('100%');
  }
}