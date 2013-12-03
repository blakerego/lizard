//= require group

/*
  This class is responsible for switching between active groups.
*/
window.GROUP_MANAGER = function() {}
GROUP_MANAGER.prototype = {

  default_group_id: null,

  groups: {},

  all_tiles: null,

  init: function(tile_data, default_group_id)
  {
    this.all_tiles = tile_data;
    this.default_group_id = default_group_id;
    this.groups = this.generate_album_hash(this.all_tiles);
    this.current_group = this.groups[this.default_group_id];
    this.group_switch_events = [];
    var $this = this;
    $('.album_btn').on('click', function()
    {
      var group_id = $(this).data()["groupId"];
      $this.switch_group(group_id);
    });


  },

  generate_album_hash: function(tiles)
  {
    var album_hash = {}

    $.each(this.all_tiles, function(index, tile)
    {
      if (typeof(album_hash[tile.group_id]) === 'undefined')
      {
        var group = new GROUP();
        group.init( tile.group_id );
        album_hash[ tile.group_id ] = group;
      }
      album_hash[ tile.group_id ].add_track_for_tile(tile)

    });
    return album_hash;
  },

  get_duration_data_for_groups: function(callback)
  {
    this.groups[this.current_group.id].get_data_for_tracks(callback);
  },

  switch_group: function(group_id)
  {
    this.current_group = this.groups[group_id];
    var length = this.group_switch_events.length; 
    for(var i=0; i < length; i++)
    {
      this.group_switch_events[i].call(this, group_id);
    }

  },

  bind: function(event_name, callback)
  {
    if (event_name == "group_switch")
    {
      this.group_switch_events.push(callback)
    } 
  }

}

