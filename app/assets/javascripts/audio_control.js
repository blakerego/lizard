//= require vimeo_wrapper

window.AUDIO_CONTROL = function() {}
AUDIO_CONTROL.prototype = {

  playing: false,

  ffwding: false,

  vimeo_player: new VIMEO_WRAPPER(),

  finish_callback: null,

  track_percent: 0,

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
    this.playing = current_inst.toggle($('.play'), true);
  },

  pause: function()
  {
    var current_inst = this;
    this.playing = current_inst.toggle($('.play'), false);    
  },

  reset_vimeo_wrapper: function(vimeo_selector)
  {
    this.vimeo_player.stop();
    this.vimeo_player.clear_callbacks();
    this.vimeo_player = new VIMEO_WRAPPER;
    this.vimeo_player.init(vimeo_selector);
    this.vimeo_player.add_play_progress_listener(this.on_play_progress);
    this.vimeo_player.add_play_listener(this.on_play); 
    this.vimeo_player.add_pause_listener(this.on_pause);
    this.vimeo_player.add_finish_listener(this.on_finish.bind(this));
  },

  on_play_progress: function(data)
  {
    this.track_percent = data['percent'];
    // console.log(this.track_percent);
  },

  on_play: function(data)
  {
    // console.log('on play event fired!');
  }, 

  on_pause: function(data)
  {
    // console.log('pause event fired!');
  }, 

  on_finish: function()
  {
    // console.log('vimeo video finish event fired');
    if (this.finish_callback != null)
    {
      this.finish_callback();
    }
  },

  set_finish_callback: function(callback)
  {
    this.finish_callback = callback;
  }

}
