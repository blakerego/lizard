//= require vimeo_fetcher

window.TRACK = function() {}

TRACK.prototype = {

  tile: null, 

  id: null, 

  data_fetcher: null,

  init: function(tile)
  {
    this.tile = tile; 

    this.id = this.tile.id;
    this.url = this.tile.media_url;
  },

  ready: function() 
  {
    return this.data_fetcher.duration != null;
  },

  get_duration_data: function(callback)
  {
    this.data_fetcher = new VIMEO_FETCHER(); 
    this.data_fetcher.init(this.url, this.id, callback); 
  },

  unbind_fetcher: function()
  {
    this.data_fetcher.vimeo_wrapper.ready_callback = null;
    this.data_fetcher.vimeo_wrapper.remove_duration_callback();
    this.data_fetcher.vimeo_wrapper = null;
    this.data_fetcher = null;
  }

}