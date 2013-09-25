//= require vimeo_wrapper

window.AUDIO_CONTROL = function() {}
AUDIO_CONTROL.prototype = {
  playing: false,
  ffwding: false,
  vimeo_inst: new VIMEO_WRAPPER(),

  init: function()
  {
    
    var current_inst = this;

    $('.play').on('click', function()
    {
      current_inst.playing = current_inst.toggle(this, !current_inst.playing);
    });

    $('.stop').on('click', function()
    {
      current_inst.toggle($('.play'), false);
      current_inst.playing = false;
      current_inst.vimeo_inst.stop();
    });
  }, 

  toggle: function(button, playing)
  {
    if(playing)
    {
      $(button).addClass('playing');
      this.vimeo_inst.play();            
      return true;
    }
    else 
    {
      $(button).removeClass('playing');
      this.vimeo_inst.pause();
      return false;
    }
  },

  play: function()
  {
    var current_inst = this;
    current_inst.toggle($('.play'), true);
  },

  reset_vimeo_wrapper: function()
  {
    this.vimeo_inst.stop();
    this.vimeo_inst = new VIMEO_WRAPPER();
    this.vimeo_inst.init();
    this.play();
  }

}
