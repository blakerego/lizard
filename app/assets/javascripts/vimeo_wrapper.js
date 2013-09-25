window.VIMEO_WRAPPER = function() {}
VIMEO_WRAPPER.prototype = {
  vimeo_frame: null,
  url: null,
  status: 'uninitiated',
  init: function()
  {
    this.vimeo_frame = $('iframe');
    this.url = this.vimeo_frame.attr('src').split('?')[0];
    this.status = 'initiated';
  },

  post: function(action, value) 
  {
    if (this.vimeo_frame == null)
      return false;
    var data = { method: action }; 
    if (value) 
    {
      data.value = value;
    }
    this.vimeo_frame[0].contentWindow.postMessage(JSON.stringify(data), this.url);
  },

  pause: function()
  {
    this.post('pause');
  },

  play: function()
  {
    this.post('play');
  },

  stop: function()
  {
    this.post('stop');
  }
}