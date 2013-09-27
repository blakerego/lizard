//= require vimeo_wrapper

window.AUDIO_CONTROL = function() {}
AUDIO_CONTROL.prototype = {
  playing: false,
  ffwding: false,
  vimeo_player: new VIMEO_WRAPPER(),

  init: function()
  {
    
    var current_inst = this;

    /// Initialize Play / Pause button
    $('.play').on('click', function()
    {
      current_inst.playing = current_inst.toggle(this, !current_inst.playing);
    });

    /// Initialize Stop button, if it exists.
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
      if (!this.vimeo_player.play())
      {
        /// This means no song is selected.
        /// Consider changing - the following line requires global variable knowledge. yucky.
        // TILES.open_first_tile();
      }
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
    this.playing = current_inst.toggle($('.play'), true);
  },

  reset_vimeo_wrapper: function()
  {
    this.vimeo_player.stop();
    this.vimeo_player = new VIMEO_WRAPPER();
    this.vimeo_player.init();
    this.play();
  }

}
