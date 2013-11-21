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
    this.data_fetcher = new VIMEO_FETCHER(); 
    this.data_fetcher.init(this.url, $('iframe#loading_area'));
  },

  ready: function() 
  {
    return this.data_fetcher.duration != null;
  },

  duration: function()
  {
    return this.data_fetcher.duration;
  }

}