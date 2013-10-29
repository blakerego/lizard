//= require vimeo_wrapper

function on_play_progress(data)
{
  console.log('on play progress not connected'); 
  console.log(data['percent']);
}

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

  reset_vimeo_wrapper: function()
  {
    this.vimeo_player.stop();
    this.vimeo_player = new VIMEO_WRAPPER();
    this.vimeo_player.init();
    this.vimeo_player.add_play_progress_listener(on_play_progress);
    // this.vimeo_player.add_play_progress_listener(this.on_play_progress);
    // this.vimeo_player.add_play_listener(this.on_play); 
    this.vimeo_player.add_pause_listener(this.on_pause);
  },

  on_play_progress: function(data)
  {
    console.log('on play progress'); 
    console.log(data['percent']);
    debugger;
  },

  on_play: function(data)
  {
    console.log('on play event fired!');
  }, 

  on_pause: function(data)
  {
    console.log('pause event fired!');
    debugger;
  }

}
