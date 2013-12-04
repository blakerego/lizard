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

    if (this.duration_data_available())
    {
      /// If track data is already loaded, use the callback immediately. 
      /// We do not want to load the same data multiple times.
      this.external_callback_duration.call(this, this.tracks);
    }
    else 
    {
      /// Otherwise, iterate through the tracks to obtain duration values.
      this.iterator = 0;
      this.iterate();      
    }
  }, 

  duration_data_available: function()
  {
    var undefined_values_present = false;
    var durations = this.tracks.map(function(track) 
      {
        if (typeof(track.duration) === "undefined")
        {
          undefined_values_present = true;
        }
        return track.duration 
      } );
    return !undefined_values_present;
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
