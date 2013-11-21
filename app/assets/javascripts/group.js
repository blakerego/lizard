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
  }
}