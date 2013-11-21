//= require track

window.GROUP = function() {}

GROUP.prototype = {

  tracks: null,

  id: null,

  init: function(group_id)
  {
    this.id = group_id;
    this.tracks = [];
  }, 

  add_track_for_tile: function(tile)
  {
    var track = new TRACK(); 
    track.init(tile);
    this.tracks.push(track);
  }, 

  iterator: 0,

  get_data_for_tracks: function()
  {
    this.iterator = 0;
    this.iterate();
  }, 

  iterate: function()
  {
    var track = this.tracks[this.iterator];
    track.get_duration_data(this.duration_callback_handler.bind(this));
  },

  duration_callback_handler: function(duration, url)
  {
    var current_track = this.tracks[this.iterator];
    // assign value
    current_track.duration = duration;

    //unbind
    current_track.unbind_fetcher();

    this.iterator++;
    if (this.iterator < this.tracks.length)
    {
      this.iterate();
    }
    else
    {
      alert('finished loading!');
    }
  }
}
