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
  }
}