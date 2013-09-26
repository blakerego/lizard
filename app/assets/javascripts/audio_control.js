//= require vimeo_wrapper

window.AUDIO_CONTROL = function() {}
AUDIO_CONTROL.prototype = {
  playing: false,
  ffwding: false,
  vimeo_player: new VIMEO_WRAPPER(),

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
      current_inst.vimeo_player.stop();
    });
  }, 

  toggle: function(button, playing)
  {
    if(playing)
    {
      $(button).addClass('playing');
      this.vimeo_player.play();            
      return true;
    }
    else 
    {
      $(button).removeClass('playing');
      this.vimeo_player.pause();
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
    this.vimeo_player.stop();
    this.vimeo_player = new VIMEO_WRAPPER();
    this.vimeo_player.init();
    this.play();
  }

}
