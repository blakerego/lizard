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

  external_callback_duration: null,

  get_data_for_tracks: function(callback)
  {
    this.external_callback_duration = callback;
    this.iterator = 0;
    this.iterate();
  }, 

  iterate: function()
  {
    var track = this.tracks[this.iterator];
    track.get_duration_data(this.duration_callback_handler.bind(this));
  },

  tiles: function()
  {
    return this.tracks
          .map(function(track)
          {
            return track.tile;
          });
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
      /// All data is loaded. Broadcast the good news to the initial caller.
      this.external_callback_duration.call(this, this.tracks);
    }
  }
}
