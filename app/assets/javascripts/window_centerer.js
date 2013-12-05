window.WINDOW_CENTERER = function() {}
WINDOW_CENTERER.prototype = {
  init: function()
  {
    var $this = this;
    $(window).on('resize', function()
    {
      $this.center_vertically();
    });
  },

  center_vertically: function()
  {
    if ($(window).width() < 770)
    {
      // This is the media breakpoint limit. 
      // Do not center if window is smaller than this.
      return;
    }
    var window_height = $(window).height();
    
    var body_height = $('body').height() * 
                      parseFloat($('body').css('zoom')) + 
                      parseFloat($('.tiles_area').css('margin-bottom')) + 
                      parseFloat($('.icons').height());


    var vertical_offset = (window_height - body_height) / 2;

    $('body').offset( {top: vertical_offset} );
  }
}
