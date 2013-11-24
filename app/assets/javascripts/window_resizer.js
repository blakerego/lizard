window.WINDOW_RESIZER = function() {}
WINDOW_RESIZER.prototype = {
  init: function()
  {
    var $this = this;
    $(window).on('resize', function()
    {
      $this.resize();
    });
  },

  resize: function()
  {
    width = $(window).width();
    height = $(window).height();
    
    var width_ratio = 1;
    var height_ratio = 1; 
    if (width > 770)
    {
      width_ratio = width / 1205
    }
    height_ratio = height / 750
    var ratio = width_ratio <= height_ratio ? width_ratio : height_ratio;
    $('body').css('zoom', ratio );

  }
}
